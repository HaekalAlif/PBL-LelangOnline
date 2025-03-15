import Image from "next/image";
import Navigation from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import DetailProduk from "@/components/produkpage/detailproduk";




export default function Home() {
  return (
    <>
      <Navigation/>
      <DetailProduk/>
      <Footer/>
    </>
  );
}
