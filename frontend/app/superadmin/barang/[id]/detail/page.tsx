"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Timer, Users } from "lucide-react";

interface Barang {
  id_barang: number;
  nama_barang: string;
  deskripsi_barang: string;
  harga_awal: number;
  gambar_barang: string;
  gambar_barang_url: string;
  grade: string;
  status_barang: string;
  kondisi_detail: string;
  berat_barang: number;
  dimensi: string;
  kategori: {
    nama_kategori: string;
  };
  toko: {
    nama_toko: string;
    user?: {
      username?: string;
    };
  };
}

export default function DetailBarang() {
  const [barang, setBarang] = useState<Barang | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const response = await axiosInstance.get(`/barang/${params.id}`);
        setBarang(response.data.data);
      } catch (err) {
        setError("Failed to fetch item details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarang();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !barang) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500 text-lg">{error || "Item not found"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Link href="/superadmin/barang" className="inline-flex items-center mb-6">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Barang
        </Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Section */}
        <Card>
          <CardContent className="p-0 aspect-square relative">
            <img
              src={barang.gambar_barang_url || "/placeholder-image.jpg"}
              alt={barang.nama_barang}
              className="object-cover w-full h-full rounded-lg"
            />
          </CardContent>
        </Card>

        {/* Details Section */}
        <Card>
          <CardHeader className="space-y-2">
            <h2 className="text-2xl font-bold">{barang.nama_barang}</h2>
            <div className="flex gap-2">
              <Badge variant="secondary">{barang.kategori.nama_kategori}</Badge>
              <Badge>Grade {barang.grade}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-green-600">
                Rp {barang.harga_awal.toLocaleString("id-ID")}
              </h3>
            </div>

            <Separator />

            <div>
              <p className="text-gray-600">{barang.deskripsi_barang}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Status" value={barang.status_barang} />
              <InfoItem label="Kondisi" value={barang.kondisi_detail} />
              <InfoItem label="Berat" value={`${barang.berat_barang} kg`} />
              <InfoItem label="Dimensi" value={barang.dimensi} />
              <InfoItem label="Toko" value={barang.toko.nama_toko} />
              <InfoItem
                label="Penjual"
                value={barang.toko.user?.username || "N/A"}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);
