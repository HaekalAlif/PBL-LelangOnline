"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import Link from "next/link";

interface TokoData {
  id: number;
  id_user: number;
  nama_toko: string;
  deskripsi: string;
  alamat: string;
  kontak: string;
  is_active: boolean;
  is_deleted: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

interface BarangData {
  id_barang: number;
  nama_barang: string;
  harga_awal: number;
  gambar_barang: string;
  gambar_barang_url: string;
  grade: string;
  status_barang: string;
  created_at: string;
  deskripsi_barang: string;
}

const TokoPage = () => {
  const [loading, setLoading] = useState(true);
  const [toko, setToko] = useState<TokoData | null>(null);
  const [barangList, setBarangList] = useState<BarangData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("id_user="))
          ?.split("=")[1];

        if (!userId) {
          router.push("/login");
          return;
        }

        console.log("Fetching with userId:", userId); // Debug log

        // Fetch toko data
        const tokoResponse = await axios.get("/stores/my-store", {
          headers: { "X-User-Id": userId },
        });

        console.log("Toko Response:", tokoResponse.data); // Debug log

        if (tokoResponse.data.status === "success" && tokoResponse.data.data) {
          setToko(tokoResponse.data.data);

          // Get the toko ID
          const tokoId = tokoResponse.data.data.id;
          console.log("Fetching items for toko ID:", tokoId); // Debug log

          try {
            // Fetch barang data with proper error handling
            const barangResponse = await axios.get(`/stores/${userId}/items`);
            console.log("Barang Response:", barangResponse.data); // Debug log

            if (
              barangResponse.data.status === "success" &&
              Array.isArray(barangResponse.data.data)
            ) {
              setBarangList(barangResponse.data.data);
            } else {
              console.error("Invalid barang data format:", barangResponse.data);
              setBarangList([]);
            }
          } catch (barangError) {
            console.error("Error fetching barang:", barangError);
            setBarangList([]);
          }
        }
      } catch (error: any) {
        console.error("Error in fetchData:", error);
        console.error("Error response:", error.response?.data);
        if (error.response?.status === 400) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="container max-w-7xl py-6">
        <Skeleton className="h-[200px] w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      </div>
    );
  }

  if (!toko) {
    return (
      <div className="container max-w-4xl py-6">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-800">
              Belum Memiliki Toko
            </h2>
            <p className="text-gray-500">
              Anda belum memiliki toko. Mulai berjualan dengan membuat toko Anda
              sendiri.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="text-center mb-6">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
              <p className="mt-4 text-sm text-gray-500">
                Buat toko Anda sekarang dan mulai menjual produk Anda
              </p>
            </div>
            <Link href="/user/toko/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Buat Toko Sekarang
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-6 space-y-6">
      {/* Toko Info Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{toko.nama_toko}</h2>
            <p className="text-gray-500">{toko.deskripsi}</p>
          </div>
          <Link href="/user/toko/barang/create">
            <Button className="bg-black hover:bg-gray-300 hover:text-black">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Barang
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Alamat</h3>
              <p>{toko.alamat}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Kontak</h3>
              <p>{toko.kontak}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barang List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Daftar Barang</h3>
        {!barangList || barangList.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">
                Belum ada barang yang ditambahkan
              </p>
              <Link href="/user/toko/barang/create" className="mt-4">
                <Button>Tambah Barang Pertama</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {barangList.map((barang) => (
              <Link
                href={`/user/toko/barang/${barang.id_barang}`}
                key={barang.id_barang}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative">
                    {barang.gambar_barang_url && (
                      <img
                        src={barang.gambar_barang_url}
                        alt={barang.nama_barang}
                        className="object-cover w-full h-full rounded-t-lg"
                      />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{barang.nama_barang}</h4>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                      {barang.deskripsi_barang}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Rp {barang.harga_awal.toLocaleString("id-ID")}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          barang.status_barang === "Tersedia"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        Grade {barang.grade}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokoPage;
