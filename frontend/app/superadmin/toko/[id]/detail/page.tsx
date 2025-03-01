"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Package,
  Store,
  MapPin,
  Phone,
  Info,
  ChevronRight,
} from "lucide-react";

interface Toko {
  id_toko: number;
  id_user: number; // Add this field
  nama_toko: string;
  deskripsi: string;
  alamat: string;
  kontak: string;
  username: string;
  is_active: boolean;
}

interface Barang {
  id_barang: number;
  nama_barang: string;
  harga_awal: number;
  deskripsi_barang: string;
  status_barang: string;
  gambar_barang_url: string;
}

export default function TokoDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [toko, setToko] = useState<Toko | null>(null);
  const [barang, setBarang] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // First, get the store details and its user ID
        const storeResponse = await axiosInstance.get(`/stores/${params.id}`);
        const storeData = storeResponse.data.data;
        setToko(storeData);

        // Then get the items using the store's ID
        const barangResponse = await axiosInstance.get(
          `/stores/${storeData.id_toko}/items`
        );
        setBarang(barangResponse.data.data);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-destructive">Error: {error}</div>
      </div>
    );

  if (!toko)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Store not found</div>
      </div>
    );

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              Detail Toko
            </h1>
            <p className="text-muted-foreground">
              Informasi lengkap tentang toko dan daftar barang
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2"
          >
            Kembali
          </Button>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full max-w-[400px] grid grid-cols-2">
            <TabsTrigger value="info" className="gap-2">
              <Store className="h-4 w-4" />
              Informasi Toko
            </TabsTrigger>
            <TabsTrigger value="items" className="gap-2">
              <Package className="h-4 w-4" />
              Daftar Barang
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  <CardTitle>Informasi Toko</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">
                        Nama Toko
                      </label>
                      <p className="text-lg font-medium">{toko?.nama_toko}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">
                        Pemilik
                      </label>
                      <p className="text-lg font-medium">{toko?.username}</p>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">
                      Deskripsi
                    </label>
                    <p className="text-base leading-relaxed">
                      {toko?.deskripsi}
                    </p>
                  </div>

                  <Separator className="my-2" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">
                          Alamat
                        </label>
                        <p className="text-base">{toko?.alamat}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-5 w-5 text-muted-foreground mt-1" />
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">
                          Kontak
                        </label>
                        <p className="text-base">{toko?.kontak}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">
                        Status
                      </label>
                      <div>
                        <Badge
                          variant={toko?.is_active ? "default" : "destructive"}
                        >
                          {toko?.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="mt-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle>Daftar Barang</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-md border">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {barang.map((item) => (
                      <Card
                        key={item.id_barang}
                        className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/superadmin/barang/${item.id_barang}/detail`
                          )
                        }
                      >
                        <div className="relative h-48 w-full">
                          {item.gambar_barang_url ? (
                            <Image
                              src={item.gambar_barang_url}
                              alt={item.nama_barang}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted flex items-center justify-center">
                              <Package className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h3 className="font-medium line-clamp-1">
                                {item.nama_barang}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                }).format(item.harga_awal)}
                              </p>
                            </div>
                            <Badge variant="outline" className="shrink-0">
                              {item.status_barang}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            className="w-full mt-4 gap-2"
                            onClick={() =>
                              router.push(
                                `/superadmin/barang/${item.id_barang}/detail`
                              )
                            }
                          >
                            Lihat Detail
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
