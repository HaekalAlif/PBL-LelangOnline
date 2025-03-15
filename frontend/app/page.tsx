import Image from "next/image";
import Hero from "@/components/landing/herolanding";
import Feature from "@/components/landing/feature";
import Kelebihan from "@/components/landing/kelebihan";
import Rekomendasi from "@/components/landing/rekomendasiproduk";
import Navigation from "@/components/layout/nav";
import Footer from "@/components/layout/footer";




export default function Home() {
  return (
    <>
      <Navigation/>
      <Hero/>
      <Feature/>
      <Kelebihan/>
      <Rekomendasi/>
      <Footer/>
    </>
  );
}
