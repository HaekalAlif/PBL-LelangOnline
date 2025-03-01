"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trophy, Timer, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Bid {
  id_penawaran: number;
  user_name: string;
  harga: number;
  created_at: string;
}

interface LelangDetail {
  id_lelang: number;
  barang: {
    nama_barang: string;
    deskripsi_barang: string;
    gambar_barang_url: string;
    harga_awal: number;
    kondisi_detail: string;
    toko: {
      nama_toko: string;
    };
  };
  harga_minimal_bid: number;
  tanggal_mulai: string;
  tanggal_berakhir: string;
  status: string;
  jumlah_bid: number;
  penawaran_tertinggi?: {
    harga: number;
    user_name: string;
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

  return (
    <div className="flex items-center gap-2">
      <Timer className="h-4 w-4" />
      <span className="font-medium">{timeLeft}</span>
    </div>
  );
}

export default function LelangDetail({ params }: { params: { id: string } }) {
  const [lelang, setLelang] = useState<LelangDetail | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for lelang ID:", params.id);
        const lelangRes = await axios.get(`/lelang/${params.id}`);
        console.log("Lelang response:", lelangRes.data);

        if (lelangRes.data.status === "success") {
          setLelang(lelangRes.data.data);

          // Fetch bids if needed
          try {
            const bidsRes = await axios.get(`/lelang/${params.id}/bids`);
            if (bidsRes.data.status === "success") {
              setBids(bidsRes.data.data);
            }
          } catch (bidsError) {
            console.error("Error fetching bids:", bidsError);
            setBids([]);
          }
        } else {
          throw new Error("Failed to fetch lelang data");
        }
      } catch (error) {
        console.error("Error fetching auction details:", error);
        setError("Gagal memuat data lelang");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleBid = async () => {
    try {
      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("id_user="))
        ?.split("=")[1];

      if (!userId) {
        router.push("/login");
        return;
      }

      const response = await axios.post(`/lelang/${params.id}/bid`, {
        harga: parseInt(bidAmount),
        id_user: userId,
      });

      if (response.data.status === "success") {
        // Refresh data after successful bid
        window.location.reload();
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Gagal melakukan penawaran");
    }
  };

  if (loading) {
    return (
      <div className="container max-w-7xl py-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-6">
      <Link href="/user/lelang" className="inline-flex items-center mb-6">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Lelang
        </Button>
      </Link>

      {error ? (
        <Card>
          <CardContent className="p-6 text-center text-red-600">
            {error}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
                  <img
                    src={lelang?.barang?.gambar_barang_url}
                    alt={lelang?.barang?.nama_barang}
                    className="object-contain w-full h-full"
                  />
                </div>

                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-2">
                    {lelang?.barang?.nama_barang}
                  </h1>
                  <p className="text-gray-600">
                    Oleh {lelang?.barang?.toko?.nama_toko}
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Deskripsi Barang</h2>
                  <p className="text-gray-700">
                    {lelang?.barang?.deskripsi_barang}
                  </p>

                  <h2 className="text-lg font-semibold">Kondisi Barang</h2>
                  <p className="text-gray-700">
                    {lelang?.barang?.kondisi_detail}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Bid Info Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* Display Current Price Info */}
                <div className="space-y-2">
                  <p className="text-gray-600">Harga Awal</p>
                  <p className="text-xl font-bold">
                    Rp {lelang?.barang?.harga_awal.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-600">Penawaran Tertinggi</p>
                  {bids && bids.length > 0 ? (
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        Rp {bids[0].harga.toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm text-gray-600">
                        oleh: {bids[0].user_name}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xl font-bold">Belum ada penawaran</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-gray-600">Minimal Kenaikan Bid</p>
                  <p className="text-md font-semibold">
                    Rp {lelang?.harga_minimal_bid.toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Bid Input Section */}
                {lelang?.status === "berlangsung" && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Minimal bid selanjutnya: Rp{" "}
                      {(
                        (bids && bids.length > 0
                          ? bids[0].harga
                          : lelang.barang.harga_awal) + lelang.harga_minimal_bid
                      ).toLocaleString("id-ID")}
                    </div>
                    <Input
                      type="number"
                      placeholder="Masukkan jumlah bid"
                      value={bidAmount}
                      onChange={(e) => {
                        setBidAmount(e.target.value);
                        setError("");
                      }}
                      min={
                        (bids && bids.length > 0
                          ? bids[0].harga
                          : lelang.barang.harga_awal) + lelang.harga_minimal_bid
                      }
                    />
                    {error && (
                      <p className="text-sm text-red-600 font-medium">
                        {error}
                      </p>
                    )}
                    <Button
                      className="w-full"
                      onClick={handleBid}
                      disabled={
                        !bidAmount ||
                        parseInt(bidAmount) <
                          (bids && bids.length > 0
                            ? bids[0].harga
                            : lelang.barang.harga_awal) +
                            lelang.harga_minimal_bid
                      }
                    >
                      Bid Sekarang
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leaderboard Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Klasemen Bid Tertinggi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bids.length > 0 ? (
                  <div className="space-y-3">
                    {bids.map((bid, index) => (
                      <div
                        key={bid.id_penawaran}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`${
                              index === 0 ? "text-yellow-500" : "text-gray-500"
                            } font-semibold`}
                          >
                            #{index + 1}
                          </span>
                          <span>{bid.user_name}</span>
                        </div>
                        <span className="font-semibold">
                          Rp {bid.harga.toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <p>Belum ada bid</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
