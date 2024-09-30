ALTER TABLE "orders" ALTER COLUMN "created" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "created" DROP NOT NULL;