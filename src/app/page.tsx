import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import ForAgents from '@/components/home/ForAgents';
import ForSellers from '@/components/home/ForSellers';
import Pricing from '@/components/home/PricingContact';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <Hero />
      <HowItWorks />
      <ForAgents />
      <ForSellers />
      <div className="bg-navy-gradient">
        <Pricing />
        <Footer />
      </div>
    </div>
  );
}
