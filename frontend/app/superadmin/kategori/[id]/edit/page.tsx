"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "@/lib/axios";

const formSchema = z.object({
  nama_kategori: z
    .string()
    .min(3, "Category name must be at least 3 characters"),
  is_active: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_kategori: "",
      is_active: "",
    },
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`/categories/${params.id}`);
        if (response.data.status === "success") {
          form.reset({
            nama_kategori: response.data.data.nama_kategori,
            is_active: String(response.data.data.is_active),
          });
        }
      } catch (error) {
        toast.error("Failed to fetch category data");
        router.push("/superadmin/kategori");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params.id, form, router]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const response = await axios.put(`/categories/${params.id}`, {
        ...values,
        is_active: values.is_active === "true",
      });

      if (response.data.status === "success") {
        toast.success("Category updated successfully");
        router.push("/superadmin/kategori");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update category");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Edit Category</h1>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="text-sm"
            >
              Back to Categories
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nama_kategori"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-50">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
