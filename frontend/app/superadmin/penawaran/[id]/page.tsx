"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Timer, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import axios from "@/lib/axios";
import { formatPrice } from "@/lib/utils";
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
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

interface DetailPageProps {
  params: {
    id: string;
  };
}

export default function PenawaranDetailPage({ params }: DetailPageProps) {
  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEndAuctionDialog, setShowEndAuctionDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [auctionRes, bidsRes] = await Promise.all([
        axios.get(`/lelang/${params.id}`),
        axios.get(`/lelang/${params.id}/bids`),
      ]);

      setAuction(auctionRes.data.data);
      setBids(bidsRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndAuction = async () => {
    try {
      const response = await axios.put(`/lelang/${params.id}`, {
        status: "selesai",
      });

      if (response.data.status === "success") {
        toast.success("Lelang berhasil diakhiri", {
          description: "Status lelang telah diubah menjadi selesai",
        });
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Error ending auction:", error);
      toast.error("Gagal mengakhiri lelang", {
        description: "Terjadi kesalahan saat mengakhiri lelang",
      });
    }
  };

  if (loading || !auction) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Link href="/superadmin/lelang">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Lelang
            </Button>
          </Link>

          {auction.status === "berlangsung" && (
            <Button
              variant="destructive"
              onClick={() => setShowEndAuctionDialog(true)}
            >
              Akhiri Lelang
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-blue-100 p-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Harga Awal
                </p>
                <h3 className="text-2xl font-bold">
                  {formatPrice(auction.barang.harga_awal)}
                </h3>
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
                  Status
                </p>
                <Badge
                  className={
                    auction.status === "berlangsung"
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }
                >
                  {auction.status.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-purple-100 p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Bid
                </p>
                <h3 className="text-2xl font-bold">{bids.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="rounded-full bg-orange-100 p-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Minimal Kenaikan Bid
                </p>
                <h3 className="text-2xl font-bold">
                  {formatPrice(auction.harga_minimal_bid)}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Lelang</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nama Barang</p>
                <p className="font-medium">{auction.barang.nama_barang}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Toko</p>
                <p className="font-medium">{auction.barang.toko.nama_toko}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal Mulai</p>
                <p className="font-medium">
                  {new Date(auction.tanggal_mulai).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal Berakhir</p>
                <p className="font-medium">
                  {new Date(auction.tanggal_berakhir).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Harga Awal</p>
                <p className="font-medium">
                  {formatPrice(auction.barang.harga_awal)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Penawaran Tertinggi</p>
                <p className="font-medium text-green-600">
                  {auction.penawaran_tertinggi
                    ? formatPrice(auction.penawaran_tertinggi.harga)
                    : "Belum ada penawaran"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Minimal Bid Selanjutnya</p>
                <p className="font-medium text-orange-600">
                  {formatPrice(
                    (auction.penawaran_tertinggi?.harga ||
                      auction.barang.harga_awal) + auction.harga_minimal_bid
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status Lelang</p>
                <Badge
                  className={
                    auction.status === "berlangsung"
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }
                >
                  {auction.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Riwayat Penawaran</CardTitle>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  toast.info("Coming Soon", {
                    description: "Export feature will be available soon",
                  });
                }}
              >
                Export Data
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Penawar</TableHead>
                  <TableHead>Harga Bid</TableHead>
                  <TableHead>Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bids.map((bid, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {bid.user_name}
                    </TableCell>
                    <TableCell>{formatPrice(bid.harga)}</TableCell>
                    <TableCell>
                      {new Date(bid.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AlertDialog
          open={showEndAuctionDialog}
          onOpenChange={setShowEndAuctionDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Akhiri Lelang?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin mengakhiri lelang ini?
                {auction.penawaran_tertinggi
                  ? `Pemenang akan ditetapkan dengan bid tertinggi ${formatPrice(
                      auction.penawaran_tertinggi.harga
                    )}`
                  : "Tidak ada penawar untuk lelang ini."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleEndAuction}>
                Ya, Akhiri Lelang
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
