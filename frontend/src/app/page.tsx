import FinalCTA from "@/components/landingpage/Cta";
import FAQ from "@/components/landingpage/Faq";
import Footer from "@/components/landingpage/Footer";
import Hero from "@/components/landingpage/Hero";
import HowItWorks from "@/components/landingpage/Howitworks";
import IdeaToLogic from "@/components/landingpage/Idea";
import UnfoldSection from "@/components/landingpage/Unfold";
import Navbar from "@/components/navigations/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <Navbar/>
    <Hero/> 
    <UnfoldSection/>
    <HowItWorks/>
    <IdeaToLogic/>
    <FinalCTA/>
    <FAQ/>
    <Footer/>
    </>
  );
}
