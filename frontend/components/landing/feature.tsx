'use client';

import React from 'react';
import Image from 'next/image';
import { FaTshirt, FaTv, FaMotorcycle, FaCar, FaShoppingBag, FaCouch, FaDumbbell, FaThLarge } from 'react-icons/fa';

const categories = [
  { name: 'Pakaian', icon: <FaTshirt /> },
  { name: 'Elektronik', icon: <FaTv /> },
  { name: 'Elektronik', icon: <FaTv /> },
  { name: 'Motor', icon: <FaMotorcycle /> },
  { name: 'Mobil', icon: <FaCar /> },
  { name: 'Aksesoris', icon: <FaShoppingBag /> },
  { name: 'Perabotan', icon: <FaCouch /> },
  { name: 'Perabotan', icon: <FaCouch /> },
  { name: 'Olahraga', icon: <FaDumbbell /> },
  { name: 'Lain - Lain', icon: <FaThLarge /> },
];

const products = [
  { image: '/camera.png', name: 'Camera', price: '10000000' },
  { image: '/camera.png', name: 'Nama Barang', price: '0000000' },
  { image: '/camera.png', name: 'Nama Barang', price: '0000000' },
  { image: '/camera.png', name: 'Nama Barang', price: '0000000' },
  { image: '/camera.png', name: 'Nama Barang', price: '0000000' },
];

export default function Feature() {
  return (
    <div className="bg-amber-50 min-h-screen p-6">
      <div className="mx-48 my-12">
      {/* Kategori */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Kategori</h2>
        <hr className="border-b-1 border-black mt-4 mb-12" />
        <div className="grid grid-cols-5 gap-12 mx-64">
          {categories.map((cat, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-4 w-36 h-32 bg-[#F79E0E] text-white rounded-lg shadow-lg">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      <section className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">Flash Sale</h2>
          <a href="#" className="text-orange-500">Lihat Semua</a>
        </div>
        <p className="text-gray-600">Flash Sale akan segera berakhir</p>

        <div className="grid grid-cols-5 gap-4 mt-4">
          {products.map((product, index) => (
            <div key={index} className="bg-white p-4 rounded-lg relative shadow-xl">
              <Image src={product.image} alt={product.name} width={200} height={150} className="w-full h-64 object-cover rounded-md" />
              <div className="mt-3">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-yellow-500 font-semibold">{product.price}</p>
                <button className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg">Beli Barang</button>
              </div>
            </div>
          ))}
        </div>
        <hr className="border-b-1 border-black mt-12" />
      </section>
      </div>
    </div>
  );
}