'use server'

import SettingsSchema from '@/types/settings-schema';
import {createSafeActionClient} from 'next-safe-action'
import { auth } from '@/server/auth';
import bcrypt from 'bcrypt'
import { revalidatePath } from 'next/cache';
import { db } from '@/server';
import { eq } from 'drizzle-orm';
import { users } from '@/server/schema';

const action = createSafeActionClient();

const settings = action(SettingsSchema, async(values) => {
  const user = await auth();
  if(!user) return {error: "User not Found"};

  const dbUser = await db.query.users.findFirst({
    where: (eq(users.id, user.user?.id))
  })
  if(!dbUser) return {error: "User not Found"};

  if(user.user.isOAuth){
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled =undefined;
  }

  if(values.password && values.newPassword && dbUser.password){
    const passwordMatch = await bcrypt.compare(values.password, dbUser.password);
    if(!passwordMatch) return {error: "Passwords does not match"};

    const samePassword = await bcrypt.compare(values.newPassword, dbUser.password);
    if(samePassword) return {error: "New Password is the Same as old Password"};
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;

  }
  
  await db
    .update(users)
    .set({
      twoFactorEnabled: values.isTwoFactorEnabled,
      name: values.name,
      email: values.email,
      password: values.password,
      image: values.image,
    })
    .where(eq(users.id, dbUser.id));

  revalidatePath("/dashboard/settings")
  return { success: "Settings updated" }
});

export default settings;