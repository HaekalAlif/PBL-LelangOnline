"use client";

import React from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface Category {
  id_kategori: number;
  nama_kategori: string;
}

interface Barang {
  id_barang: number;
  nama_barang: string;
  id_kategori: number;
  deskripsi_barang: string;
  harga_awal: number;
  grade: string;
  kondisi_detail: string;
  berat_barang: number;
  dimensi: string;
  gambar_barang: string;
  gambar_barang_url: string; // Add this new property
}

const formSchema = z.object({
  nama_barang: z.string().min(3, "Nama barang minimal 3 karakter"),
  id_kategori: z.string().min(1, "Kategori harus dipilih"),
  id_toko: z.string().optional(), // Add this
  deskripsi_barang: z.string().min(10, "Deskripsi minimal 10 karakter"),
  harga_awal: z.string().min(1, "Harga awal harus diisi"),
  grade: z.string().min(1, "Grade harus dipilih"),
  kondisi_detail: z.string().min(10, "Kondisi detail minimal 10 karakter"),
  berat_barang: z.string().min(1, "Berat barang harus diisi"),
  dimensi: z.string().min(1, "Dimensi harus diisi"),
  gambar_barang: z
    .custom<File>(
      (value) => value instanceof File || typeof value === "string",
      {
        message: "Gambar harus diupload",
      }
    )
    .optional(),
});

export default function EditBarang({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [barang, setBarang] = useState<Barang | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, barangResponse] = await Promise.all([
          axios.get("/categories"),
          axios.get(`/barang/${resolvedParams.id}`),
        ]);

        setCategories(categoriesResponse.data.data);
        const barangData = barangResponse.data.data;
        setBarang(barangData);
        // Use gambar_barang_url directly from API
        setImagePreview(barangData.gambar_barang_url);

        // Set form values
        form.reset({
          nama_barang: barangData.nama_barang,
          id_kategori: String(barangData.id_kategori),
          deskripsi_barang: barangData.deskripsi_barang,
          harga_awal: String(barangData.harga_awal),
          grade: barangData.grade,
          kondisi_detail: barangData.kondisi_detail,
          berat_barang: String(barangData.berat_barang),
          dimensi: barangData.dimensi,
          gambar_barang: barangData.gambar_barang,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal memuat data");
      }
    };

    fetchData();
  }, [resolvedParams.id, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("gambar_barang", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const cookies = document.cookie.split("; ");
      const storeId = cookies
        .find((row) => row.startsWith("store_id="))
        ?.split("=")[1];

      const userId = cookies
        .find((row) => row.startsWith("id_user="))
        ?.split("=")[1];

      if (!storeId || !userId) {
        toast.error("Sesi tidak valid. Silakan login kembali.");
        router.push("/login");
        return;
      }

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "gambar_barang" && typeof value === "string") {
            // Skip if it's the existing image URL
            return;
          }
          if (key === "harga_awal" || key === "berat_barang") {
            formData.append(key, String(Number(value)));
          } else {
            formData.append(key, value);
          }
        }
      });

      formData.append("id_toko", storeId);
      formData.append("updated_by", userId);
      formData.append("status_barang", "tersedia");

      const response = await axios.post(
        `/barang/${resolvedParams.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-HTTP-Method-Override": "PUT",
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Barang berhasil diperbarui");
        router.push("/user/toko");
        router.refresh();
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Gagal memperbarui barang");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Barang</CardTitle>
          <CardDescription>
            Perbarui informasi barang yang akan dilelang
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Form fields are the same as create page */}
              <FormField
                control={form.control}
                name="nama_barang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Barang</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama barang" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="id_kategori"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id_kategori}
                            value={String(category.id_kategori)}
                          >
                            {category.nama_kategori}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="harga_awal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga Awal</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan harga awal"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">Seperti Baru</SelectItem>
                          <SelectItem value="B">Bekas Layak Pakai</SelectItem>
                          <SelectItem value="C">Rusak Ringan</SelectItem>
                          <SelectItem value="D">Rusak Berat</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="deskripsi_barang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Deskripsikan barang secara detail"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kondisi_detail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kondisi Detail</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Jelaskan kondisi barang secara detail"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="berat_barang"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Berat (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Berat dalam kilogram"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dimensi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimensi (PxLxT cm)</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 10x5x3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gambar_barang"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Gambar Barang</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload gambar baru untuk mengganti gambar yang ada
                    </FormDescription>
                    <FormMessage />
                    {imagePreview && (
                      <div className="mt-2 relative w-full h-[200px]">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Menyimpan..." : "Perbarui Barang"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
