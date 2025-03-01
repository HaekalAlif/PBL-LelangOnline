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
import { MoreHorizontal, Search, Store, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

interface Toko {
  id_toko: number; // Changed from id to id_toko to match backend
  id_user: number;
  username: string; // Owner's username
  nama_toko: string;
  deskripsi: string;
  alamat: string;
  kontak: string;
  is_active: boolean;
  created_at: string;
}

export default function TokoPage() {
  const [mounted, setMounted] = useState(false);
  const [toko, setToko] = useState<Toko[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchToko();
    }
  }, [search, statusFilter, mounted]);

  const fetchToko = async () => {
    try {
      // Get user ID from cookies
      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("id_user="))
        ?.split("=")[1];

      if (!userId) {
        console.log("User ID not found in cookies");
        router.push("/login");
        return;
      }

      const response = await axios.get("/stores", {
        headers: {
          "X-User-Id": userId,
        },
        params: {
          search: search || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
        },
      });

      if (response.data.status === "success") {
        setToko(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching stores:", error.response?.data);

      if (error.response?.status === 400) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-blue-100 p-3">
              <Store className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Total Stores
              </p>
              <h3 className="text-2xl font-bold">{toko.length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-green-100 p-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                Active Stores
              </p>
              <h3 className="text-2xl font-bold">
                {toko.filter((t) => t.is_active).length}
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
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : toko.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No stores found
                </TableCell>
              </TableRow>
            ) : (
              toko.map((store) => (
                <TableRow key={store.id_toko}>
                  <TableCell className="font-medium">
                    {store.nama_toko}
                  </TableCell>
                  <TableCell>{store.username}</TableCell>
                  <TableCell>{store.kontak}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {store.alamat}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          store.is_active ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {store.is_active ? "Active" : "Inactive"}
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
                              `/superadmin/toko/${store.id_toko}/detail`
                            )
                          }
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/superadmin/toko/${store.id_toko}/edit`
                            )
                          }
                        >
                          Edit
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
