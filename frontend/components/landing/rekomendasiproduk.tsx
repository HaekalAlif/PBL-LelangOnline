'use client';

import React from 'react';
import { useRouter } from 'next/navigation'

const categories = [
  'Pakaian', 'Elektronik', 'Motor', 'Mobil', 'Aksesoris', 'Perabotan', 'Olahraga', 'Lain - Lain'
];

const products = Array(8).fill({
  image: '/camera.png',
  name: 'Nama Barang',
  price: '100.000.00'
});

export default function Rekomendasi() {
  const router = useRouter() // Pindahkan useRouter ke dalam komponen
  
    const handleProduk = () => {
      router.push('/produk')
    }
  return (
    <div className="bg-white min-h-screen">
      <h1 className="text-center bg-amber-50 text-4xl font-bold mb-8 h-24 justify-center pt-7">Rekomendasi</h1>

      <div className="flex gap-8 mx-48">
        {/* Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-md w-1/4 h-[700px]">
          <h2 className="text-2xl font-bold text-orange-500 mb-6">Filter</h2>
          <h3 className="text-lg font-semibold mb-4">Filter Kategori</h3>
          {categories.map((cat, index) => (
            <label key={index} className="flex items-center mb-2">
              <input type="radio" name="category" className="mr-2" />
              {cat}
            </label>
          ))}
          <h3 className="text-lg font-semibold mt-6 mb-4">Harga</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Range Harga Minimum"
              className="w-full p-2 border rounded-md mb-2"
            />
            <input
              type="text"
              placeholder="Range Harga Maksimum"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button className="w-full bg-[#F79E0E] text-white py-2 rounded-md mb-2">Terapkan</button>
          <button className="w-full text-[#F79E0E] border border-[#F79E0E] py-2 rounded-md">Reset Filter</button>
        </div>

        {/* Product Section */}
        <div className="grid grid-cols-4 gap-6 flex-1">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-72 object-cover rounded-md" />
              <div className="flex justify-between items-center p-2">
                <div>
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-yellow-500 font-semibold">Rp {product.price}</p>
                </div>
                <button className="bg-[#F79E0E] text-white py-1 px-4 rounded">Beli Barang</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p onClick={handleProduk} className="text-right text-[#F79E0E] mt-6 mx-48 cursor-pointer">Lihat Semua</p>
      <hr className="border-b-1 border-black mx-24 mt-6" />
    </div>
  );
}
