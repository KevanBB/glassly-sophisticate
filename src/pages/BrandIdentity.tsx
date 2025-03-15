
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Palette, Target, Flag, Award, Zap, Users, MessageCircle, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BrandIdentity = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
          <div className="text-crimson font-bold text-xl">SubSpace</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Palette className="h-8 w-8 text-crimson" />
            <h1 className="text-4xl font-bold">Brand Identity</h1>
          </div>
          
          <p className="text-white/70 text-lg mb-12">
            The official brand guidelines for SubSpace - where playful power dynamics meet cutting-edge technology.
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* Mission & Vision */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-glass border border-white/10 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#007BFF]/20 to-transparent pb-2">
                    <div className="flex items-center gap-2">
                      <Flag className="h-5 w-5 text-[#007BFF]" />
                      <CardTitle>Mission Statement</CardTitle>
                    </div>
                    <CardDescription className="text-white/60">Our purpose</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-white/80">
                      To create a thrilling digital playground where consensual power play meets cutting-edge tech, 
                      fostering exciting connections and dynamic financial experiences.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-glass border border-white/10 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#FF69B4]/20 to-transparent pb-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-[#FF69B4]" />
                      <CardTitle>Vision</CardTitle>
                    </div>
                    <CardDescription className="text-white/60">Where we're headed</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-white/80">
                      To be the go-to destination for the next generation of findom enthusiasts, 
                      where innovation and playful dynamics collide.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
          
          {/* Core Values */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-[#C0C0C0]" />
                Core Values
              </h2>
              <p className="text-white/70 mb-6">The principles that guide everything we do</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Playful Power",
                  description: "We celebrate the joy of consensual dominance and submission.",
                  icon: Zap,
                  color: "#007BFF",
                  delay: 0.5
                },
                {
                  title: "Digital Sanctuary",
                  description: "We provide a safe and secure space for exploration.",
                  icon: Shield,
                  color: "#FF69B4",
                  delay: 0.6
                },
                {
                  title: "Tech Playground",
                  description: "We embrace innovation to enhance the fun.",
                  icon: Target,
                  color: "#C0C0C0",
                  delay: 0.7
                },
                {
                  title: "Vibrant Community",
                  description: "We foster connections and shared experiences.",
                  icon: Users,
                  color: "#007BFF",
                  delay: 0.8
                },
                {
                  title: "Expressive Freedom",
                  description: "We encourage authentic and uninhibited expression.",
                  icon: MessageCircle,
                  color: "#FF69B4",
                  delay: 0.9
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: value.delay }}
                >
                  <Card className="bg-glass border border-white/10 h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <value.icon className="h-5 w-5" style={{ color: value.color }} />
                        <CardTitle className="text-lg">{value.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-white/80">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Target Audience */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-[#FF69B4]" />
                Target Audience
              </h2>
              <p className="text-white/70 mb-6">Who we're designed for</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <Card className="bg-glass border border-white/10 h-full">
                  <CardHeader className="bg-gradient-to-r from-[#007BFF]/20 to-transparent pb-2">
                    <CardTitle>Dynamic Dommes/Doms</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-white/80">
                      Tech-savvy individuals who enjoy playful control and financial empowerment.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <Card className="bg-glass border border-white/10 h-full">
                  <CardHeader className="bg-gradient-to-r from-[#FF69B4]/20 to-transparent pb-2">
                    <CardTitle>Enthusiastic Subs</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-white/80">
                      Open-minded individuals who seek exciting experiences and consensual submission.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
          
          {/* Value Propositions */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-[#C0C0C0]" />
                Value Propositions
              </h2>
              <p className="text-white/70 mb-6">What sets us apart</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Free-Spirited Zone",
                  description: "A platform where creativity and expression thrive.",
                  delay: 1.4
                },
                {
                  title: "Fortress of Fun",
                  description: "Top-tier security ensures a worry-free experience.",
                  delay: 1.5
                },
                {
                  title: "Interactive Arsenal",
                  description: "A suite of tools designed for seamless and engaging interactions.",
                  delay: 1.6
                },
                {
                  title: "Matchmaking Magic",
                  description: "Advanced algorithms for finding compatible partners.",
                  delay: 1.7
                },
                {
                  title: "Achievement Badges",
                  description: "A fun, gamified system to celebrate milestones and achievements.",
                  delay: 1.8
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: value.delay }}
                >
                  <Card className="bg-glass border border-white/10 h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-white/80">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Brand Personality */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.9 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-[#FF69B4]" />
                Brand Personality
              </h2>
              <p className="text-white/70 mb-6">How we present ourselves</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Energetic & Playful",
                  description: "Vibrant, enthusiastic, and ready for fun.",
                  delay: 2.0
                },
                {
                  title: "Confident & Cool",
                  description: "Assertive but approachable, with a modern vibe.",
                  delay: 2.1
                },
                {
                  title: "Sleek & Stylish",
                  description: "High-quality design with a contemporary edge.",
                  delay: 2.2
                },
                {
                  title: "Tech-Forward & Trendy",
                  description: "Embracing the latest digital innovations.",
                  delay: 2.3
                }
              ].map((trait, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: trait.delay }}
                >
                  <Card className="bg-glass border border-white/10 h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{trait.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-white/80">{trait.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Tone of Voice */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5 text-[#007BFF]" />
                Tone of Voice
              </h2>
              <p className="text-white/70 mb-6">How we communicate</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 2.5 }}
                className="md:col-span-2"
              >
                <Card className="bg-glass border border-white/10">
                  <CardContent className="pt-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-[#007BFF] mb-3">Voice Characteristics</h3>
                        <ul className="space-y-2 text-white/80">
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-[#FF69B4] mt-0.5">•</div>
                            <p><span className="font-medium">Enthusiastic & Engaging:</span> Conversational and inviting.</p>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-[#FF69B4] mt-0.5">•</div>
                            <p><span className="font-medium">Confident & Playful:</span> Assertive with a wink.</p>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-[#FF69B4] mt-0.5">•</div>
                            <p><span className="font-medium">Exciting & Intriguing:</span> Sparking curiosity and anticipation.</p>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-[#FF69B4] mt-0.5">•</div>
                            <p><span className="font-medium">Secure & Supportive:</span> Reassuring and trustworthy.</p>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-[#007BFF] mb-3">Key Phrases</h3>
                        <ul className="space-y-2 text-white/80">
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-[#FF69B4]">→</div>
                            <p>"Let's Play"</p>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-[#FF69B4]">→</div>
                            <p>"Level Up"</p>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-[#FF69B4]">→</div>
                            <p>"Unlock Your Potential"</p>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-[#FF69B4]">→</div>
                            <p>"Join the Fun"</p>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-[#FF69B4]">→</div>
                            <p>"Safe Space, Exciting Times"</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
          
          {/* Visual Identity */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.6 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5 text-[#C0C0C0]" />
                Visual Identity
              </h2>
              <p className="text-white/70 mb-6">How we look and feel</p>
            </motion.div>
            
            <div className="space-y-8">
              {/* Color Palette */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.7 }}
              >
                <h3 className="text-xl font-semibold mb-4">Color Palette</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg overflow-hidden border border-white/10">
                    <div className="h-24 bg-[#007BFF]"></div>
                    <div className="p-4 bg-glass">
                      <p className="font-medium">Electric Blue</p>
                      <p className="text-white/60 text-sm">#007BFF</p>
                      <p className="text-white/70 text-sm mt-2">Energy, innovation, and excitement</p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden border border-white/10">
                    <div className="h-24 bg-[#FF69B4]"></div>
                    <div className="p-4 bg-glass">
                      <p className="font-medium">Neon Pink</p>
                      <p className="text-white/60 text-sm">#FF69B4</p>
                      <p className="text-white/70 text-sm mt-2">Playfulness, passion, and vibrancy</p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden border border-white/10">
                    <div className="h-24 bg-[#C0C0C0]"></div>
                    <div className="p-4 bg-glass">
                      <p className="font-medium">Metallic Silver</p>
                      <p className="text-white/60 text-sm">#C0C0C0</p>
                      <p className="text-white/70 text-sm mt-2">Modern tech and sleekness</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Typography */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.8 }}
              >
                <h3 className="text-xl font-semibold mb-4">Typography</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg overflow-hidden border border-white/10 p-6 bg-glass">
                    <h4 className="font-medium mb-2">Primary Font</h4>
                    <p className="text-white/70 mb-4">A bold, rounded sans-serif font like "Poppins" or "Circular Std" for a friendly and modern feel.</p>
                    <p className="font-bold text-3xl" style={{fontFamily: 'Poppins, sans-serif'}}>Poppins Bold</p>
                    <p className="text-xl mt-2" style={{fontFamily: 'Poppins, sans-serif'}}>Poppins Regular</p>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden border border-white/10 p-6 bg-glass">
                    <h4 className="font-medium mb-2">Secondary Font</h4>
                    <p className="text-white/70 mb-4">A clean, legible sans-serif font like "Inter" or "Nunito" for a youthful touch.</p>
                    <p className="font-bold text-3xl" style={{fontFamily: 'Inter, sans-serif'}}>Inter Bold</p>
                    <p className="text-xl mt-2" style={{fontFamily: 'Inter, sans-serif'}}>Inter Regular</p>
                  </div>
                </div>
              </motion.div>
              
              {/* UI/UX */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.9 }}
              >
                <h3 className="text-xl font-semibold mb-4">UI/UX Guidelines</h3>
                <Card className="bg-glass border border-white/10">
                  <CardContent className="pt-6 pb-6">
                    <ul className="space-y-3 text-white/80">
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 flex-shrink-0 text-[#007BFF] mt-0.5">•</div>
                        <p>A vibrant, intuitive interface with a focus on user engagement.</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 flex-shrink-0 text-[#007BFF] mt-0.5">•</div>
                        <p>Light mode as the default, with an optional dark mode.</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 flex-shrink-0 text-[#007BFF] mt-0.5">•</div>
                        <p>Interactive tutorials and onboarding experiences.</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 flex-shrink-0 text-[#007BFF] mt-0.5">•</div>
                        <p>Emphasis on community features and social interaction.</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 flex-shrink-0 text-[#007BFF] mt-0.5">•</div>
                        <p>The UI should feel like a dynamic and exciting digital playground.</p>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full py-6 bg-black/90 border-t border-white/5 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-white/40 text-sm text-center">
            © {new Date().getFullYear()} SubSpace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BrandIdentity;
