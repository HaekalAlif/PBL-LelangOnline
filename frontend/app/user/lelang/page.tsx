"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "@/lib/axios";
import Link from "next/link";

interface LelangItem {
  id_lelang: number;
  id_barang: number;
  harga_minimal_bid: number;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  status: string;
  jumlah_bid: number;
  barang: {
    nama_barang: string;
    deskripsi_barang: string;
    gambar_barang_url: string;
    harga_awal: number;
    toko: {
      id_toko: number; // Changed from id to id_toko
      nama_toko: string;
    };
  };
  penawaran_tertinggi?: {
    harga: number;
    user_name: string;
  };
  created_by: {
    id_user: number;
    name: string;
  };
}

function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft("Lelang telah berakhir");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days}h ${hours}j ${minutes}m ${seconds}d`);
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [endDate]);

  return <div className="text-sm font-medium">{timeLeft}</div>;
}

export default function LelangPage() {
  const [lelangItems, setLelangItems] = useState<LelangItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLelang = async () => {
      try {
        const response = await axios.get("/lelang");
        if (response.data.status === "success") {
          setLelangItems(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLelang();
  }, []);

  if (loading) {
    return (
      <div className="container max-w-7xl py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Lelang Aktif ({lelangItems.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lelangItems.map((item) => (
          <Link href={`/user/lelang/${item.id_lelang}`} key={item.id_lelang}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={item.barang.gambar_barang_url}
                  alt={item.barang.nama_barang}
                  className="object-cover w-full h-full rounded-t-lg"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold">{item.barang.nama_barang}</h2>
                  <span className="text-sm text-gray-500">
                    {item.barang.toko.nama_toko}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {item.barang.deskripsi_barang}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Harga Awal</span>
                    <span className="font-semibold">
                      Rp {item.barang.harga_awal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Minimum Bid</span>
                    <span className="font-semibold">
                      Rp {item.harga_minimal_bid.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {item.penawaran_tertinggi && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bid Tertinggi</span>
                      <span className="font-semibold text-green-600">
                        Rp{" "}
                        {item.penawaran_tertinggi.harga.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-600">Sisa Waktu</span>
                    <CountdownTimer endDate={item.tanggal_berakhir} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {lelangItems.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                Belum ada lelang yang aktif
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
