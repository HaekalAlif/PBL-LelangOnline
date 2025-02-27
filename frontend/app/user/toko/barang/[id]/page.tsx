"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface BarangDetail {
  id_barang: number;
  nama_barang: string;
  deskripsi_barang: string;
  harga_awal: number;
  gambar_barang_url: string;
  grade: string;
  status_barang: string;
  kondisi_detail: string;
  berat_barang: number;
  dimensi: string;
  created_at: string;
  kategori: {
    nama_kategori: string;
  };
}

export default function BarangDetail({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [barang, setBarang] = useState<BarangDetail | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const userId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("id_user="))
          ?.split("=")[1];

        if (!userId) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`/items/${params.id}`, {
          headers: { "X-User-Id": userId },
        });

        if (response.data.status === "success") {
          setBarang(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarang();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="container max-w-4xl py-6">
        <Skeleton className="h-[400px] w-full mb-6" />
        <Skeleton className="h-8 w-[200px] mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
      </div>
    );
  }

  if (!barang) {
    return (
      <div className="container max-w-4xl py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500">Barang tidak ditemukan</p>
            <Link href="/user/toko" className="mt-4">
              <Button variant="outline">Kembali ke Toko</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <Link href="/user/toko">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Toko
        </Button>
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{barang.nama_barang}</h2>
            <p className="text-gray-500">{barang.kategori.nama_kategori}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image */}
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img
              src={barang.gambar_barang_url}
              alt={barang.nama_barang}
              className="object-contain w-full h-full"
            />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Harga Awal</h3>
              <p>Rp {barang.harga_awal.toLocaleString("id-ID")}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Grade</h3>
              <p>{barang.grade}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Berat</h3>
              <p>{barang.berat_barang} gram</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Dimensi</h3>
              <p>{barang.dimensi}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Deskripsi</h3>
            <p className="text-gray-600">{barang.deskripsi_barang}</p>
          </div>

          {/* Condition Details */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Kondisi Detail</h3>
            <p className="text-gray-600">{barang.kondisi_detail}</p>
          </div>

          {/* Status and Date */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                barang.status_barang === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {barang.status_barang === "active" ? "Aktif" : "Tidak Aktif"}
            </span>
            <span className="text-sm text-gray-500">
              Ditambahkan pada:{" "}
              {new Date(barang.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
