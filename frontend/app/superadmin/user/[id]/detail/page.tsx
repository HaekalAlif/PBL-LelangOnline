"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Store, Trophy, User } from "lucide-react";

interface User {
  id_user: number;
  username: string;
  email: string;
  no_hp: string;
  foto_profil: string;
  tanggal_lahir: string;
  role: number;
  poin_reputasi: number;
  is_verified: boolean;
  is_active: boolean;
  store?: {
    id_toko: number;
    nama_toko: string;
  };
}

export default function UserDetail({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${params.id}`);
        setUser(response.data.data);
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-6">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="container max-w-lg mx-auto mt-8 p-6">
        <CardContent className="text-center space-y-4">
          <div className="text-red-500 text-xl">Error: {error}</div>
          <Button asChild variant="outline">
            <Link href="/superadmin/user">Return to Users List</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!user) return <div>User not found</div>;

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        <Button variant="outline" asChild>
          <Link href="/superadmin/user">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={user.foto_profil || "/default-avatar.png"}
                  alt={user.username}
                />
                <AvatarFallback>
                  <User className="h-16 w-16" />
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Badge variant={user.is_active ? "default" : "destructive"}>
                  {user.is_active ? "Active" : "Inactive"}
                </Badge>
                <Badge variant={user.is_verified ? "default" : "secondary"}>
                  {user.is_verified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem label="Username" value={user.username} />
                <InfoItem label="Email" value={user.email} />
                <InfoItem label="Phone" value={user.no_hp} />
                <InfoItem
                  label="Birth Date"
                  value={new Date(user.tanggal_lahir).toLocaleDateString()}
                />
                <InfoItem
                  label="Role"
                  value={user.role === 1 ? "Admin" : "User"}
                  className="capitalize"
                />
                <InfoItem
                  icon={<Trophy className="h-4 w-4" />}
                  label="Reputation Points"
                  value={user.poin_reputasi.toString()}
                />
              </div>

              {user.store && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      Store Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        {user.store.nama_toko}
                      </span>
                      <Button asChild>
                        <Link href={`/superadmin/toko/${user.store.id_toko}/detail`}>
                          View Store
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type InfoItemProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
};

const InfoItem = ({ label, value, icon, className = "" }: InfoItemProps) => (
  <div className="space-y-1">
    <div className="text-sm text-muted-foreground flex items-center gap-1">
      {icon}
      {label}
    </div>
    <div className={`font-medium ${className}`}>{value}</div>
  </div>
);
