"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Search, Package, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

interface Barang {
  id_barang: number;
  id_kategori: number;
  id_toko: number;
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
  is_active: boolean;
  toko: {
    nama_toko: string;
    user?: {
      username: string;
    };
  };
  kategori: {
    nama_kategori: string;
  };
}

export default function BarangPage() {
  const [mounted, setMounted] = useState(false);
  const [barang, setBarang] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all"); // Add this
  const [categories, setCategories] = useState<any[]>([]); // Add this
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetchCategories();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mounted) {
        fetchBarang();
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [search, statusFilter, categoryFilter, mounted]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/categories");
      if (response.data.status === "success") {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBarang = async () => {
    try {
      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("id_user="))
        ?.split("=")[1];

      if (!userId) {
        console.log("User ID not found in cookies");
        router.push("/login");
        return;
      }

      // Prepare query parameters
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);

      const response = await axios.get(`/barang?${params.toString()}`, {
        headers: {
          "X-User-Id": userId,
        },
      });

      if (response.data.status === "success") {
        setBarang(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching items:", error.response?.data);
      if (error.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  if (!mounted) return null;

  return (
    <div className="p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-blue-100 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Items
              </p>
              <h3 className="text-2xl font-bold">{barang.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-green-100 p-3">
              <Store className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Active Items
              </p>
              <h3 className="text-2xl font-bold">
                {barang.filter((b) => b.is_active).length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Add Category Filter */}
        <Select
          value={categoryFilter}
          onValueChange={setCategoryFilter}
          defaultValue="all"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category.id_kategori}
                  value={category.id_kategori.toString()}
                >
                  {category.nama_kategori}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Existing Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          defaultValue="all"
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="tersedia">Tersedia</SelectItem>
              <SelectItem value="dalam_lelang">Dalam Lelang</SelectItem>
              <SelectItem value="terjual">Terjual</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : barang.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              barang.map((item) => (
                <TableRow key={item.id_barang}>
                  <TableCell className="font-medium">
                    {item.nama_barang}
                  </TableCell>
                  <TableCell>{item.toko.nama_toko}</TableCell>
                  <TableCell>{item.toko.user?.username || "N/A"}</TableCell>
                  <TableCell>{item.kategori.nama_kategori}</TableCell>
                  <TableCell>{formatPrice(item.harga_awal)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          item.status_barang === "tersedia"
                            ? "bg-green-500"
                            : item.status_barang === "dalam_lelang"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                      {item.status_barang === "tersedia"
                        ? "Tersedia"
                        : item.status_barang === "dalam_lelang"
                        ? "Dalam Lelang"
                        : "Terjual"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/superadmin/barang/${item.id_barang}/detail`
                            )
                          }
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
