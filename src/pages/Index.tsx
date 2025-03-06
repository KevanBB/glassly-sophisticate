
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const Index = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays automatically when loaded
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12 overflow-hidden"
    >
      {/* Video background */}
      <div className="absolute inset-0 z-[-20] w-full h-full overflow-hidden">
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="https://keypifghqlthxdelogxe.supabase.co/storage/v1/object/public/Media//Black%20and%20White%20Animated%20Get%20Ready%20Video_20250306_012439_0001.mp4" 
                  type="video/mp4" />
          Your browser does not support the video tag.
        </video>

      {/* Content */}
      <div className="text-center space-y-6 max-w-3xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs text-white/80 mb-6">
            <span className="w-2 h-2 rounded-full bg-crimson mr-2 animate-pulse-subtle"></span>
            Premium Platform
          </div>
          <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight tracking-tighter uppercase">
            <span className="text-crimson" style={{ textShadow: "0 0 10px rgba(220, 20, 60, 0.3)" }}>SubSpace</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mt-6 font-light tracking-wide">
            Engineered for Dominance
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-lg text-white bg-gradient-to-r from-crimson-dark to-crimson hover:brightness-110 transition-all duration-300 shadow-lg shadow-crimson/20 hover:shadow-xl hover:shadow-crimson/30"
          >
            <span className="font-medium">Get Started</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;
