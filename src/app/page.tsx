import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';

export default function Home() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <Hero />
    </div>
  );
}
