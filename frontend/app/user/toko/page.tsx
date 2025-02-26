"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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

const TokoPage = () => {
  const [loading, setLoading] = useState(true);
  const [toko, setToko] = useState<TokoData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchToko = async () => {
      try {
        // Get user ID from cookies
        const userId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("id="))
          ?.split("=")[1];

        if (!userId) {
          console.log("User ID not found in cookies");
          router.push("/login");
          return;
        }

        console.log("Fetching with user ID:", userId); // Debug log

        const response = await axios.get("/stores/my-store", {
          headers: {
            "X-User-Id": userId,
          },
        });

        if (response.data.status === "success") {
          setToko(response.data.data);
        }
      } catch (error: any) {
        console.error("Error fetching store:", error.response?.data);

        if (error.response?.status === 400) {
          // Handle missing user ID
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchToko();
  }, [router]);

  if (loading) {
    return (
      <div className="container max-w-4xl py-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
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
    <div className="container max-w-4xl py-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">{toko.nama_toko}</h2>
          <p className="text-gray-500">{toko.deskripsi}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">Status</h3>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    toko.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {toko.is_active ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <p>
                  Dibuat pada:{" "}
                  {new Date(toko.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokoPage;
