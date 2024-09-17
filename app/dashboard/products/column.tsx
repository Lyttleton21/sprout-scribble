"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColumnDef, Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DeleteProduct } from "@/server/action/products/delete-product";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
// import { ProductVariant } from "./product-variant";

type productColumn = {
  id: number;
  title: string;
  image: string;
  price: number;
  variants: any;
};

export type VariantsWithImagesTags = {
  id: number;
  ProductType: String;
  Color: any;
  updatedAt: Date;
  ProductId: string;
};

// async function DeleteProductWrapper(id: string) {
//   const { data } = await DeleteProduct({ id });
//   if (!data) return new Error("Product not found");
//   if (data.success) toast.success(data.success);
//   if (data.error) toast.error(data.error);
// }

const ActionCell = ({ row }: { row: Row<productColumn> }) => {
  const { status, execute } = useAction(DeleteProduct, {
    onSuccess: (data) => {
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success(data.success);
      }
    },
    onExecute: () => {
      toast.loading("Deleting Product", { duration: 200 });
    },
  });
  const product = row.original;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="dark:focus:bg-primary focus:bg-primary/50 cursor-pointer">
          <Link href={`/dashboard/add-product?id=${product.id}`}>
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => execute({ id: product.id })}
          className="dark:focus:bg-destructive focus:bg-destructive/50 cursor-pointer"
        >
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<productColumn>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const cellImage = row.getValue("image") as string;
      const cellTitle = row.getValue("title") as string;
      return (
        <div className="">
          <Image
            src={cellImage}
            alt={cellTitle}
            width={50}
            height={50}
            className="rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "variants",
    header: "Variants",
    // cell: ({ row }) => {
    //   const variants = row.getValue("variants") as VariantsWithImagesTags[];
    //   // console.log("VARIANTS:::", variants);
    //   return (
    //     <div>
    //       {variants.map((variant) => (
    //         <div key={variant.id}>
    //           <TooltipProvider>
    //             <Tooltip>
    //               <TooltipTrigger asChild>
    //                 <ProductVariant
    //                   productID={variant.ProductId}
    //                   variant={variant}
    //                   editMode={true}
    //                 >
    //                   <div
    //                     className="w-5 h-5 rounded-full"
    //                     key={variant.id}
    //                     style={{ background: variant.Color }}
    //                   />
    //                 </ProductVariant>
    //               </TooltipTrigger>
    //               <TooltipContent>
    //                 <p>{variant.ProductType}</p>
    //               </TooltipContent>
    //             </Tooltip>
    //           </TooltipProvider>
    //         </div>
    //       ))}
    //       <TooltipProvider>
    //         <Tooltip>
    //           <TooltipTrigger asChild>
    //             <span className="text-primary">
    //               <ProductVariant productID={row.original.id} editMode={false}>
    //                 <PlusCircle className="h-5 w-5" />
    //               </ProductVariant>
    //             </span>
    //           </TooltipTrigger>
    //           <TooltipContent>
    //             <p>Create a new Variant</p>
    //           </TooltipContent>
    //         </Tooltip>
    //       </TooltipProvider>
    //     </div>
    //   );
    // },
  },

  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
      }).format(price);
      return <div className="font-medium text-xs">{formatted}</div>;
    },
  },
  {
    id: "action",
    header: "Action",
    cell: ActionCell,
  },
];
