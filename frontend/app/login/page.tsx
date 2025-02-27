"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          email,
          password,
        }
      );

      const { user, token } = response.data.data;

      // Set secure cookie options
      const cookieOptions = {
        expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        path: "/",
        secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
        sameSite: "strict" as const,
      };

      // Helper function to set cookies with options
      const setCookie = (name: string, value: string) => {
        const cookieValue = `${name}=${value}; expires=${cookieOptions.expires.toUTCString()}; path=${
          cookieOptions.path
        }${cookieOptions.secure ? "; Secure" : ""}; SameSite=${
          cookieOptions.sameSite
        }`;
        document.cookie = cookieValue;
      };

      // Store all user data in cookies
      Object.entries(user).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          setCookie(key, String(value));
        }
      });

      // Set auth token
      setCookie("token", token);

      // If user has store data, make separate request to get store details
      try {
        const storeResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/stores/user/${user.id_user}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (
          storeResponse.data.status === "success" &&
          storeResponse.data.data
        ) {
          const storeData = storeResponse.data.data;
          // Store essential store data in cookies
          setCookie("store_id", String(storeData.id_toko));
          setCookie("store_name", storeData.nama_toko);
          setCookie("store_status", String(storeData.is_active));
        }
      } catch (storeError) {
        console.warn("No store data found for user");
      }

      // Log stored cookies for debugging (remove in production)
      if (process.env.NODE_ENV !== "production") {
        console.log("Stored cookies:", document.cookie);
      }

      // Redirect based on role
      if (user.role === 0) {
        router.push("/superadmin");
      } else if (user.role === 1) {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Login gagal. Silakan periksa kredensial Anda."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
