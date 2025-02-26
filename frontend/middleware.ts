import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("token");
  const roleCookie = request.cookies.get("role_name");
  const token = tokenCookie ? tokenCookie.value : null;
  const role = roleCookie ? roleCookie.value.toLowerCase() : null; // Pastikan lowercase
  const pathname = request.nextUrl.pathname;

  // Jika tidak ada token atau role, arahkan ke login
  if (!token || !role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Definisi role-based access control
  const protectedRoutes = {
    "/superadmin": "superadmin", // Hanya superadmin bisa akses
    "/admin": "admin", // Hanya admin bisa akses
    "/user": "user", // Semua role bisa akses
  };

  for (const [route, allowedRole] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      // Jika role saat ini tidak cocok dengan role yang diizinkan
      if (role !== allowedRole) {
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url)); // Kembalikan ke halaman role asalnya
      }
    }
  }

  return NextResponse.next();
}

// Konfigurasi matcher untuk middleware
export const config = {
  matcher: ["/superadmin/:path*", "/admin/:path*", "/user/:path*"], // Pastikan path cocok
};
