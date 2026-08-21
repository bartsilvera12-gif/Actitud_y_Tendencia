import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import TrustMarquee from "@/components/sections/TrustMarquee";
import Products from "@/components/sections/Products";
import NuevosIngresos from "@/components/sections/NuevosIngresos";
import Manifesto from "@/components/sections/Manifesto";
import Lookbook from "@/components/sections/Lookbook";
import InstagramFeed from "@/components/sections/InstagramFeed";
import WhatsAppCTA from "@/components/sections/WhatsAppCTA";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { waGeneral } from "@/lib/whatsapp";

export default function App() {
  return (
    <div className="relative min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <TrustMarquee />
        <Products />
        <NuevosIngresos />
        <Manifesto />
        <Lookbook />
        <InstagramFeed />
        <WhatsAppCTA />
      </main>
      <Footer />

      {/* Botón flotante de WhatsApp */}
      <motion.a
        href={waGeneral()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-6px_rgba(37,211,102,0.7)]"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </motion.a>
    </div>
  );
}
