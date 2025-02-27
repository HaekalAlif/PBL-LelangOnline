"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "@/lib/axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  nama_kategori: z.string().min(3, "Category name must be at least 3 characters"),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateKategoriPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_kategori: "",
      is_active: true,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Get user ID from cookies
      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("id_user="))
        ?.split("=")[1];

      if (!userId) {
        toast.error("User data not found. Please login again");
        router.push("/login");
        return;
      }

      // Prepare complete data for category creation
      const completeData = {
        ...data,
        created_by: parseInt(userId),
        is_deleted: false,
      };

      const response = await axios.post("/categories", completeData, {
        headers: {
          "X-User-Id": userId,
        },
      });

      if (response.data.status === "success") {
        toast.success("Category created successfully");
        router.push("/superadmin/kategori");
        router.refresh();
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.data);

      if (error.response?.status === 401) {
        toast.error("Please login to continue");
        router.push("/login");
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(errors[key][0]);
        });
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.response?.data?.message || "Failed to create category");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Category</CardTitle>
          <CardDescription>
            Add a new category for products in the auction system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nama_kategori"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Set whether this category is active and can be used
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Category
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}