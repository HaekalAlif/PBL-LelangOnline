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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  nama_toko: z.string().min(3, "Store name must be at least 3 characters"),
  deskripsi: z.string().min(10, "Description must be at least 10 characters"),
  alamat: z.string().min(5, "Address must be at least 5 characters"),
  kontak: z.string().min(10, "Contact number must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateTokoPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_toko: "",
      deskripsi: "",
      alamat: "",
      kontak: "",
    },
  });

  // ...existing imports...

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Get user data from cookies
      const cookies = document.cookie.split("; ");
      const userId = cookies
        .find((row) => row.startsWith("id="))
        ?.split("=")[1];

      if (!userId) {
        toast.error("User data not found. Please login again");
        router.push("/login");
        return;
      }

      // Prepare complete data for store creation
      const completeData = {
        ...data,
        id_user: parseInt(userId),
        created_by: parseInt(userId),
        is_active: true,
        is_deleted: false,
      };

      console.log("Submitting data:", completeData); // Debug log

      const response = await axios.post("/stores", completeData);

      if (response.data.status === "success") {
        toast.success("Store created successfully");
        router.push("/user/toko");
        router.refresh();
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.data); // Debug log

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
        toast.error(error.response?.data?.message || "Failed to create store");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Store</CardTitle>
          <CardDescription>
            Set up your store profile to start selling products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nama_toko"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deskripsi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kontak"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Store
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
