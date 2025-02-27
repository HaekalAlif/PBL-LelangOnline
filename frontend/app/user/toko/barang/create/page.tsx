"use client";

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
  id_kategori: number; // Change this from id to id_kategori
  nama_kategori: string;
}

const formSchema = z.object({
  nama_barang: z.string().min(3, "Nama barang minimal 3 karakter"),
  id_kategori: z.string().min(1, "Kategori harus dipilih"),
  id_toko: z.string().optional(),
  deskripsi_barang: z.string().min(10, "Deskripsi minimal 10 karakter"),
  harga_awal: z.string().min(1, "Harga awal harus diisi"),
  grade: z.string().min(1, "Grade harus dipilih"),
  status_barang: z.string().optional(),
  kondisi_detail: z.string().min(10, "Kondisi detail minimal 10 karakter"),
  berat_barang: z.string().min(1, "Berat barang harus diisi"),
  dimensi: z.string().min(1, "Dimensi harus diisi"),
  gambar_barang: z
    .custom<File>((value) => value instanceof File, {
      message: "Gambar harus diupload",
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateBarang() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        console.log("Categories response:", response.data); // Add this for debugging
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_barang: "",
      id_kategori: "",
      deskripsi_barang: "",
      harga_awal: "",
      grade: "",
      kondisi_detail: "",
      berat_barang: "",
      dimensi: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("gambar_barang", file, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: FormValues) => {
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
          if (key === "harga_awal" || key === "berat_barang") {
            formData.append(key, String(Number(value)));
          } else {
            formData.append(key, value);
          }
        }
      });

      formData.append("id_toko", storeId);
      formData.append("created_by", userId);
      formData.append("status_barang", "Tersedia");

      console.log(values);

      const response = await axios.post("/barang", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        toast.success("Barang berhasil ditambahkan");
        router.push("/user/toko");
        router.refresh();
      }
    } catch (error: any) {
      console.error("API Error:", error.response?.data);

      if (error.response?.status === 401) {
        toast.error("Silakan login terlebih dahulu");
        router.push("/login");
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(errors[key][0]);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Gagal menambahkan barang"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Tambah Barang Baru</CardTitle>
          <CardDescription>
            Lengkapi informasi barang yang akan dilelang
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        {categories &&
                          categories.map((category) => (
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
                      Upload gambar dengan format JPG, PNG, atau WEBP
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
                {isSubmitting ? "Menyimpan..." : "Simpan Barang"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
