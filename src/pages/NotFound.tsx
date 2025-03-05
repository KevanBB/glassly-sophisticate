
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12 overflow-hidden"
    >
      {/* Background gradient and effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-200 to-dark -z-10">
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-brand/5 blur-3xl opacity-40 animate-float"></div>
      </div>
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-6"
      >
        <h1 className="text-7xl font-bold text-white">404</h1>
        <p className="text-xl text-white/70 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <motion.a
          href="/"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center space-x-2 px-6 py-3 mt-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to home</span>
        </motion.a>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
