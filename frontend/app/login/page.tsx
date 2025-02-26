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

      console.log(response.data);

      // Set expiration date for 30 minutes
      const minutesToExpire = 30;
      const expirationDate = new Date();
      expirationDate.setTime(
        expirationDate.getTime() + minutesToExpire * 60 * 1000
      ); // 30 minutes in milliseconds
      const expires = `; expires=${expirationDate.toUTCString()}`;

      // Simpan data user yang diperlukan ke cookies
      document.cookie = `token=${response.data.data.token}${expires}; path=/`;
      document.cookie = `id=${response.data.data.user.id_user}${expires}; path=/`;
      document.cookie = `username=${response.data.data.user.username}${expires}; path=/`;
      document.cookie = `email=${response.data.data.user.email}${expires}; path=/`;
      document.cookie = `no_hp=${response.data.data.user.no_hp}${expires}; path=/`;
      document.cookie = `tanggal_lahir=${response.data.data.user.tanggal_lahir}${expires}; path=/`;
      document.cookie = `role=${response.data.data.user.role}${expires}; path=/`;
      document.cookie = `role_name=${response.data.data.user.role_name}${expires}; path=/`;
      
      // Redirect berdasarkan role
      if (response.data.data.user.role === 0) {
        router.push("/superadmin");
      } else if (response.data.data.user.role === 1) {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    } catch (err) {
      setError("Login gagal. Silakan periksa kredensial Anda.");
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
