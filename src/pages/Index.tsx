import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CreditCard, Wallet, Sparkles, Shield, ChevronDown, MoveRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [buttonHovered, setButtonHovered] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [scrolled, setScrolled] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const letterVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: { delay: i * 0.08 }
    })
  };

  const playHoverSound = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  };

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
    <div className="flex flex-col min-h-screen bg-black overflow-hidden">
      <audio ref={audioRef} className="hidden">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-tech-click-1140.mp3" type="audio/mpeg" />
      </audio>

      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"
          style={{ 
            backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
            transition: "background-position 0.5s ease-out"
          }}
        ></div>
        <motion.div 
          className="absolute inset-0 bg-crimson/5"
          animate={{ 
            opacity: [0.05, 0.1, 0.05],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: "easeInOut"
          }}
        ></motion.div>
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
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

      <div className="fixed inset-0 z-10 pointer-events-none">
        {[...Array(30)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-[1px] h-[1px] bg-white/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.3
            }}
            animate={{ 
              y: [null, Math.random() * -200 - 100],
              opacity: [null, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: Math.random() * 15 + 10,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center transition-colors duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}
      >
        <motion.div 
          className="text-2xl font-bold text-crimson flex items-center"
          whileHover={{ 
            textShadow: "0 0 8px rgba(220, 20, 60, 0.8)",
            transition: { duration: 0.2 }
          }}
          onMouseEnter={() => {
            setShowGlitch(true);
            setTimeout(() => setShowGlitch(false), 800);
            playHoverSound();
          }}
        >
          <span className="mr-1">Sub</span>
          <span className={`${showGlitch ? 'animate-glitch' : ''}`}>Space</span>
          <motion.span 
            className="ml-1 text-white/80"
            animate={{ 
              opacity: [0.7, 1, 0.7], 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2 
            }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.span>
        </motion.div>
        
        <div className="hidden md:flex space-x-8">
          {[
            { name: "About", icon: <Shield className="w-3 h-3 opacity-70" /> },
            { name: "Features", icon: <Sparkles className="w-3 h-3 opacity-70" /> },
            { name: "Pricing", icon: <CreditCard className="w-3 h-3 opacity-70" /> }
          ].map((item) => (
            <motion.a 
              key={item.name}
              href="#"
              className="text-white/70 hover:text-white relative group flex items-center gap-1.5"
              whileHover={{ 
                color: "#ffffff",
                textShadow: "0 0 5px rgba(255, 255, 255, 0.5)" 
              }}
              onMouseEnter={playHoverSound}
            >
              {item.icon}
              <span>{item.name}</span>
              <motion.span 
                className="absolute bottom-0 left-0 w-0 h-[1px] bg-crimson"
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
          ))}
        </div>
        
        <div className="flex md:hidden">
          <button className="text-white/80 hover:text-white">
            <MoveRight className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      <main className="relative flex flex-col items-center justify-center px-4 z-20 min-h-screen" onMouseMove={handleMouseMove}>
        <AnimatePresence>
          {isLoaded && (
            <div className="text-center space-y-12 max-w-4xl mx-auto z-10 pt-20">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
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
                      setShowGlitch(true);
                      setTimeout(() => {
                        navigate('/login');
                      }, 500);
                    }}
                    className="inline-flex items-center space-x-2 px-8 py-4 rounded-md text-white bg-gradient-to-r from-crimson/90 to-crimson/70 border border-white/5 shadow-lg shadow-crimson/20 hover:shadow-xl hover:shadow-crimson/30 transition-all duration-300 overflow-hidden relative"
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
                  
                  <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center">
                    <motion.button
                      whileHover={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        y: -3,
                        transition: { duration: 0.2 }
                      }}
                      className="flex items-center justify-center gap-2 px-5 py-2 rounded-md text-sm text-white/70 bg-white/5 border border-white/10 transition-all"
                      onMouseEnter={playHoverSound}
                    >
                      <Wallet className="w-4 h-4" />
                      <span>Sign up with Crypto</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        y: -3,
                        transition: { duration: 0.2 }
                      }}
                      className="flex items-center justify-center gap-2 px-5 py-2 rounded-md text-sm text-white/70 bg-white/5 border border-white/10 transition-all"
                      onMouseEnter={playHoverSound}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Sign up with Stripe</span>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center"
        >
          <motion.a
            href="#features"
            className="text-white/50 flex flex-col items-center hover:text-white/80 transition duration-300"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            onMouseEnter={playHoverSound}
          >
            <span className="text-sm mb-2">Discover More</span>
            <ChevronDown className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </main>

      <section
        id="features"
        className="relative w-full py-32 z-20 bg-gradient-to-b from-black/90 to-black/100"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Enter a World of <span className="text-crimson">Digital Dominion</span>
            </motion.h2>
            <motion.p
              className="text-white/60 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Experience the perfect balance of technology, power, and control in a platform designed for those who command and those who serve.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="glass-panel p-6 rounded-xl relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 10px 30px -10px rgba(220, 20, 60, 0.3)"
              }}
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
                className="text-crimson mt-3 text-sm absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Power is taken, never given.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="glass-panel p-6 rounded-xl relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 10px 30px -10px rgba(220, 20, 60, 0.3)"
              }}
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
              <motion.p 
                className="text-crimson mt-3 text-sm absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                What happens in SubSpace, stays in SubSpace.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="glass-panel p-6 rounded-xl relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ 
                y: -10,
                boxShadow: "0 10px 30px -10px rgba(220, 20, 60, 0.3)"
              }}
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
              <motion.p 
                className="text-crimson mt-3 text-sm absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Technology serves those who command it.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative w-full py-24 z-20 bg-gradient-to-b from-black to-dark-300/90">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to <span className="text-crimson">Take Control?</span>
          </motion.h2>
          <motion.p
            className="text-white/60 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join the elite world of SubSpace today and experience power dynamics redefined for the digital age.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              variant="crimson"
              size="lg"
              className="group" 
              onClick={() => navigate('/login')}
            >
              <span>Start Your Journey</span>
              <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="relative w-full py-6 z-20 bg-black/90 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-crimson font-bold text-xl mb-4 md:mb-0">
            SubSpace
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link to="/brand-identity" className="text-white/60 hover:text-white transition-colors text-sm">
              Brand Identity
            </Link>
            <div className="text-white/40 text-sm">
              © {new Date().getFullYear()} SubSpace. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

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
    </div>
  );
};

export default Index;
