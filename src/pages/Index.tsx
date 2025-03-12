
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, EthereumIcon, CreditCard } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [buttonHovered, setButtonHovered] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Track mouse position for lighting effect
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    });
  };

  useEffect(() => {
    // Trigger page load animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    // Ensure video plays automatically when loaded
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }

    // Cleanup
    return () => clearTimeout(timer);
  }, []);

  // Text animation variants
  const letterVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: { delay: i * 0.08 }
    })
  };

  // Play subtle audio on button hover
  const playHoverSound = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  // Text animation components
  const AnimatedText = ({ text, delay = 0, className, glitch = false }: { text: string, delay?: number, className?: string, glitch?: boolean }) => (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: delay }}
      >
        {glitch ? (
          <span className={`inline-block relative ${showGlitch ? 'animate-glitch' : ''}`}>{text}</span>
        ) : (
          text.split("").map((char, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))
        )}
      </motion.div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex flex-col items-center justify-center px-4 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Hidden audio elements for sound design */}
      <audio ref={audioRef} className="hidden">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-tech-click-1140.mp3" type="audio/mpeg" />
      </audio>

      {/* Video background with dynamic lighting based on cursor position */}
      <div className="absolute inset-0 z-[-20] w-full h-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-dark-300/50 to-dark-100/30"
          style={{ 
            backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
            transition: "background-position 0.5s ease-out"
          }}
        ></div>
        <motion.div 
          className="absolute inset-0 bg-crimson/10"
          animate={{ 
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: "easeInOut"
          }}
        ></motion.div>
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="https://keypifghqlthxdelogxe.supabase.co/storage/v1/object/public/Media//Black%20and%20White%20Animated%20Get%20Ready%20Video_20250306_012439_0001.mp4" 
                  type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Navigation bar that transforms on scroll */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center"
      >
        <motion.div 
          className="text-2xl font-bold text-crimson"
          whileHover={{ 
            textShadow: "0 0 8px rgba(220, 20, 60, 0.8)",
            transition: { duration: 0.2 }
          }}
          onMouseEnter={() => {
            setShowGlitch(true);
            setTimeout(() => setShowGlitch(false), 800);
          }}
        >
          SubSpace
        </motion.div>
        <div className="hidden md:flex space-x-8">
          {["About", "Features", "Pricing"].map((item) => (
            <motion.a 
              key={item}
              href="#"
              className="text-white/70 hover:text-white relative"
              whileHover={{ 
                color: "#ffffff",
                textShadow: "0 0 5px rgba(255, 255, 255, 0.5)" 
              }}
              onMouseEnter={playHoverSound}
            >
              <span>{item}</span>
              <motion.span 
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-crimson"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
          ))}
        </div>
      </motion.nav>

      {/* Main hero content */}
      <div className="text-center space-y-12 max-w-4xl mx-auto z-10 pt-20">
        <AnimatePresence>
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Animated tag line */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-2"
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs text-white/80 mb-6">
                  <span className="w-2 h-2 rounded-full bg-crimson mr-2 animate-pulse-subtle"></span>
                  Premium Platform
                </div>
                
                {/* Main headline with animated text effects */}
                <div className="space-y-4 mb-6">
                  <AnimatedText 
                    text="Power has a new domain." 
                    className="text-xl md:text-2xl text-white/90 font-light"
                    delay={0.6}
                  />
                  
                  <motion.h1 
                    className="text-6xl md:text-8xl font-bold text-white leading-tight tracking-tighter uppercase"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    onMouseEnter={() => {
                      setShowGlitch(true);
                      setTimeout(() => setShowGlitch(false), 800);
                    }}
                  >
                    <span 
                      className={`text-crimson ${showGlitch ? 'animate-glitch' : ''}`} 
                      style={{ textShadow: "0 0 10px rgba(220, 20, 60, 0.5)" }}
                    >
                      SubSpace
                    </span>
                  </motion.h1>
                  
                  <AnimatedText 
                    text="Unrestricted, tech-driven power play." 
                    className="text-lg md:text-xl text-white/70 font-light"
                    delay={1.8}
                  />
                </div>
              </motion.div>
              
              {/* CTA button with animations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4, duration: 0.8 }}
                className="mt-12"
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 0 20px rgba(220, 20, 60, 0.4)"
                  }}
                  whileTap={{ 
                    scale: 0.97,
                    filter: "brightness(0.8)",
                  }}
                  onMouseEnter={() => {
                    setButtonHovered(true);
                    playHoverSound();
                  }}
                  onMouseLeave={() => setButtonHovered(false)}
                  onClick={() => {
                    // Add glitch effect before navigation
                    setShowGlitch(true);
                    setTimeout(() => {
                      navigate('/login');
                    }, 500);
                  }}
                  className="inline-flex items-center space-x-2 px-8 py-4 rounded-lg text-white bg-gradient-to-r from-gunmetal-dark to-gunmetal border border-white/5 shadow-lg shadow-crimson/20 hover:shadow-xl hover:shadow-crimson/30 transition-all duration-300 overflow-hidden relative"
                >
                  <span className="font-medium">
                    {buttonHovered ? "Submit to Power" : "Enter SubSpace"}
                  </span>
                  <ArrowRight className={`w-5 h-5 ml-2 transition-transform duration-300 ${buttonHovered ? 'translate-x-1' : ''}`} />
                  <motion.div 
                    className="absolute inset-0 bg-crimson/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: buttonHovered ? 0.2 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
                
                {/* Alternative signup options */}
                <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      y: -3,
                      transition: { duration: 0.2 }
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm text-white/70 bg-white/5 border border-white/10 transition-all"
                    onMouseEnter={playHoverSound}
                  >
                    <EthereumIcon className="w-4 h-4" />
                    <span>Sign up with Crypto</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      y: -3,
                      transition: { duration: 0.2 }
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm text-white/70 bg-white/5 border border-white/10 transition-all"
                    onMouseEnter={playHoverSound}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Sign up with Stripe</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Key features sections with hover effects */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 px-6 pb-24 z-10"
      >
        {/* Empowerment Section */}
        <motion.div 
          className="glass-panel p-6 rounded-xl relative overflow-hidden"
          whileHover={{ 
            y: -10,
            boxShadow: "0 10px 30px -10px rgba(220, 20, 60, 0.3)"
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-48 mb-4 flex items-center justify-center relative">
            <motion.div 
              className="w-32 h-32 rounded-full bg-crimson/20 absolute"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut"
              }}
            />
            <motion.img 
              src="https://keypifghqlthxdelogxe.supabase.co/storage/v1/object/public/Media/gloved-hand.png" 
              alt="Empowerment" 
              className="h-36 object-contain relative z-10"
              whileHover={{ rotate: 5, scale: 1.05 }}
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Your Domain, Your Rules.</h3>
          <p className="text-white/70">Complete control in a platform engineered for dominance.</p>
          <motion.p 
            className="text-crimson mt-3 text-sm opacity-0 absolute"
            whileHover={{ opacity: 1 }}
          >
            Power is taken, never given.
          </motion.p>
        </motion.div>
        
        {/* Security Section */}
        <motion.div 
          className="glass-panel p-6 rounded-xl relative overflow-hidden"
          whileHover={{ 
            y: -10,
            boxShadow: "0 10px 30px -10px rgba(220, 20, 60, 0.3)"
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-48 mb-4 flex items-center justify-center relative">
            <motion.div 
              className="w-32 h-32 rounded-full bg-gunmetal/20 absolute"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <motion.img 
              src="https://keypifghqlthxdelogxe.supabase.co/storage/v1/object/public/Media/digital-vault.png" 
              alt="Security" 
              className="h-36 object-contain relative z-10"
              whileHover={{ 
                rotateY: 15,
                transition: { duration: 0.5 }
              }}
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Privacy Is Power.</h3>
          <p className="text-white/70">Advanced encryption and discretion by design.</p>
        </motion.div>
        
        {/* Innovation Section */}
        <motion.div 
          className="glass-panel p-6 rounded-xl relative overflow-hidden"
          whileHover={{ 
            y: -10,
            boxShadow: "0 10px 30px -10px rgba(220, 20, 60, 0.3)"
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-48 mb-4 flex items-center justify-center relative">
            <motion.div 
              className="w-32 h-32 rounded-full bg-crimson/10 absolute"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.img 
              src="https://keypifghqlthxdelogxe.supabase.co/storage/v1/object/public/Media/holographic-contract.png" 
              alt="Innovation" 
              className="h-36 object-contain relative z-10"
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.5 }
              }}
            />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">The Future of Findom.</h3>
          <p className="text-white/70">Blockchain-secured transactions and smart contracts.</p>
        </motion.div>
      </motion.section>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.3
            }}
            animate={{ 
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: Math.random() * 10 + 10,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Glitch overlay for transitions */}
      <AnimatePresence>
        {showGlitch && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/90 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 glitch-scanlines"></div>
            <div className="absolute inset-0 glitch-noise"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Index;
