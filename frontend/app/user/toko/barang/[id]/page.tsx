"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Trash2, Gavel, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

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

interface LelangFormData {
  id_barang: number;
  harga_minimal_bid: number;
  tanggal_mulai: string;
  tanggal_berakhir: string;
}

function CreateLelangForm({
  barangId,
  hargaAwal,
  onSuccess,
}: {
  barangId: number;
  hargaAwal: number;
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("id_user="))
        ?.split("=")[1];

      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await axios.post("/lelang", {
        id_barang: barangId,
        tanggal_mulai: formData.get("tanggal_mulai"),
        tanggal_berakhir: formData.get("tanggal_berakhir"),
        harga_minimal_bid: Number(formData.get("harga_minimal_bid")), // Get the actual input value
        created_by: userId,
      });

      if (response.data.status === "success") {
        router.push(`/user/lelang/${response.data.data.id_lelang}`);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Terjadi kesalahan saat membuat lelang"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <div className="mb-4">
          <Label>Harga Awal Barang</Label>
          <p className="text-lg font-semibold">
            Rp {hargaAwal.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="harga_minimal_bid">Minimal Kenaikan Bid</Label>
          <Input
            id="harga_minimal_bid"
            name="harga_minimal_bid"
            type="number"
            min="1000"
            defaultValue="50000"
            required
          />
          <p className="text-sm text-gray-500">
            Setiap bid baru harus lebih tinggi minimal sejumlah nilai ini dari
            bid sebelumnya.
            <br />
            Contoh: Jika harga awal Rp {hargaAwal.toLocaleString("id-ID")} dan
            minimal kenaikan Rp 50.000, maka bid pertama minimal Rp{" "}
            {(hargaAwal + 50000).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
        <Input
          id="tanggal_mulai"
          name="tanggal_mulai"
          type="datetime-local"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tanggal_berakhir">Tanggal Berakhir</Label>
        <Input
          id="tanggal_berakhir"
          name="tanggal_berakhir"
          type="datetime-local"
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Membuat Lelang..." : "Buat Lelang"}
      </Button>
    </form>
  );
}

export default function BarangDetail({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [barang, setBarang] = useState<BarangDetail | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

        const response = await axios.get(`/barang/${params.id}`, {
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

  const handleDelete = async () => {
    try {
      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("id_user="))
        ?.split("=")[1];

      if (!userId) {
        router.push("/login");
        return;
      }

      const response = await axios.delete(`/barang/${params.id}`, {
        headers: { "X-User-Id": userId },
      });

      if (response.data.status === "success") {
        router.push("/user/toko");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="container max-w-4xl py-6">
      <Link href="/user/toko">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Toko
        </Button>
      </Link>

      {loading ? (
        <div className="container max-w-4xl py-6">
          <Skeleton className="h-[400px] w-full mb-6" />
          <Skeleton className="h-8 w-[200px] mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
        </div>
      ) : !barang ? (
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
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{barang.nama_barang}</h2>
              <p className="text-gray-500">{barang.kategori.nama_kategori}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/user/toko/barang/${params.id}/edit`}>
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image */}
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
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

            {/* Lelang Button Section */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Status Lelang
                  </h3>
                  <p className="text-sm text-gray-600">
                    {barang.status_barang === "tersedia" && (
                      <span className="text-green-600">
                        Barang ini siap untuk dilelang
                      </span>
                    )}
                    {barang.status_barang === "lelang" && (
                      <span className="text-blue-600">
                        Lelang sedang berlangsung
                      </span>
                    )}
                    {barang.status_barang === "terjual" && (
                      <span className="text-gray-600">
                        Barang sudah terjual
                      </span>
                    )}
                  </p>
                </div>
                {barang.status_barang === "tersedia" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Gavel className="mr-2 h-4 w-4" />
                        Buat Lelang
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Buat Lelang Baru</DialogTitle>
                      </DialogHeader>
                      <CreateLelangForm
                        barangId={barang.id_barang}
                        hargaAwal={barang.harga_awal}
                        onSuccess={() => router.refresh()}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
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
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Barang</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus barang ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
