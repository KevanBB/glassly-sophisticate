
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12 overflow-hidden"
    >
      {/* Background gradient and effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-200 to-dark -z-10">
        {/* Animated gradient orbs for background effect */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-brand/5 blur-3xl opacity-50 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-brand-light/5 blur-3xl opacity-30 animate-float animate-delay-500"></div>
      </div>
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGZpbHRlciBpZD0ibm9pc2UiPgogICAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNzUiIHN0aXRjaFRpbGVzPSJzdGl0Y2giIG51bU9jdGF2ZXM9IjIiIHNlZWQ9IjAiIHJlc3VsdD0idHVyYnVsZW5jZSIgLz4KICAgIDxmZUNvbG9yTWF0cml4IHR5cGU9InNhdHVyYXRlIiB2YWx1ZXM9IjAiIC8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30 mix-blend-soft-light pointer-events-none -z-10"></div>
      
      {/* Content */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs text-white/80 mb-4">
            <span className="w-2 h-2 rounded-full bg-brand mr-2 animate-pulse-subtle"></span>
            Premium Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Welcome to <span className="text-brand">SubSpace</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mt-4">
            A premium, secure, and discreet platform for sophisticated users
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-white bg-gradient-to-r from-brand-dark to-brand hover:brightness-110 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;
