"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Gavel, AlertCircle, CheckCircle2, Timer } from "lucide-react";
import axios from "@/lib/axios";
import { formatPrice } from "@/lib/utils";

export default function LelangPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await axios.get("/lelang");
      setAuctions(response.data.data);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      berlangsung: { class: "bg-green-500 hover:bg-green-600", icon: Timer },
      selesai: { class: "bg-blue-500 hover:bg-blue-600", icon: CheckCircle2 },
      dibatalkan: { class: "bg-red-500 hover:bg-red-600", icon: AlertCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      class: "bg-gray-500",
      icon: AlertCircle,
    };

    return <Badge className={config.class}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-blue-100 p-3">
              <Gavel className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Lelang
              </p>
              <h3 className="text-2xl font-bold">{auctions.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-green-100 p-3">
              <Timer className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Lelang Aktif
              </p>
              <h3 className="text-2xl font-bold">
                {auctions.filter((a) => a.status === "berlangsung").length}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-blue-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Lelang Selesai
              </p>
              <h3 className="text-2xl font-bold">
                {auctions.filter((a) => a.status === "selesai").length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Lelang</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Toko</TableHead>
                <TableHead>Harga Awal</TableHead>
                <TableHead>Bid Tertinggi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Mulai</TableHead>
                <TableHead>Tanggal Berakhir</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auctions.map((auction) => (
                <TableRow key={auction.id_lelang}>
                  <TableCell className="font-medium">
                    {auction.barang.nama_barang}
                  </TableCell>
                  <TableCell>{auction.barang.toko.nama_toko}</TableCell>
                  <TableCell>
                    {formatPrice(auction.barang.harga_awal)}
                  </TableCell>
                  <TableCell>
                    {auction.penawaran_tertinggi ? (
                      <div>
                        <div className="font-medium">
                          {formatPrice(auction.penawaran_tertinggi.harga)}
                        </div>
                        <div className="text-sm text-gray-500">
                          oleh {auction.penawaran_tertinggi.user_name}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Belum ada bid</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(auction.status)}</TableCell>
                  <TableCell>
                    {new Date(auction.tanggal_mulai).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(auction.tanggal_berakhir).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        router.push(
                          `/superadmin/penawaran/${auction.id_lelang}`
                        )
                      }
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Detail
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
