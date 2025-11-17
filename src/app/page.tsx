import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import ForAgents from '@/components/home/ForAgents';
import ForSellers from '@/components/home/ForSellers';
import PricingContact from '@/components/home/PricingContact';
import Footer from '@/components/layout/Footer';
import DisclaimerPopup from '@/components/layout/DisclaimerPopup';
import StructuredData from '@/components/seo/StructuredData';

export default function Home() {
  return (
    <div className="min-h-screen bg-navy">
      <StructuredData />
      <Navbar />
      <Hero />
      <HowItWorks />
      <ForAgents />
      <ForSellers />
      <div className="bg-navy-gradient">
        <PricingContact />
        <Footer />
      </div>
      <DisclaimerPopup />
    </div>
  );
}
