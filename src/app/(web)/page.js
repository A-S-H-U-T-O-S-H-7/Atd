import Link from "next/link";
import HeroSection from "@/components/Web/HeroSection";
import Features from "@/components/Web/Features";
import AppDownload from "@/components/Web/AppDownload";
import Blog from "@/components/Web/Blog";
import Testimonial from "@/components/Web/Testimonial";
import VideoSection from "@/components/Web/VideoSection";
import Calculator from "@/components/Web/Calculator";
import UniqueStats from "@/components/Web/UniqueStats";
import PersonalFinanceComponent from "@/components/Web/PersonalFinance";

function page() {
  return (
    <div>
      <HeroSection />
      <UniqueStats />
      <Calculator />
      <Features />
      <AppDownload />
      <PersonalFinanceComponent />
      <VideoSection />
      <Testimonial />
      <Blog />
    </div>
  );
}

export default page;
