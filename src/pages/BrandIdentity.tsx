
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Zap, Target, Flag, Award, Lock, Users, MessageCircle, Palette, Scroll, Code, LayoutGrid, Briefcase, FileText } from 'lucide-react';
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
            The official brand guidelines for SubSpace - the premier platform for the findom community.
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
                <Card className="bg-glass border border-white/10 overflow-hidden h-full">
                  <CardHeader className="bg-gradient-to-r from-crimson/20 to-transparent pb-2">
                    <div className="flex items-center gap-2">
                      <Flag className="h-5 w-5 text-crimson" />
                      <CardTitle>Mission Statement</CardTitle>
                    </div>
                    <CardDescription className="text-white/60">Our purpose</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-white/80">
                      To empower the findom community by providing a secure, unrestricted, and technologically advanced 
                      platform that facilitates authentic power exchanges, fosters connection, and maximizes financial dominance.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-glass border border-white/10 overflow-hidden h-full">
                  <CardHeader className="bg-gradient-to-r from-crimson/20 to-transparent pb-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-crimson" />
                      <CardTitle>Vision</CardTitle>
                    </div>
                    <CardDescription className="text-white/60">Where we're headed</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-white/80">
                      To be the undisputed leader in the findom digital space, setting the standard for innovation, 
                      security, and community engagement.
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
                <Award className="h-5 w-5 text-gunmetal" />
                Core Values
              </h2>
              <p className="text-white/70 mb-6">The principles that guide everything we do</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Empowerment",
                  description: "We believe in empowering both dominants and submissives to explore their desires and engage in consensual power dynamics.",
                  icon: Zap,
                  color: "#DC143C",
                  delay: 0.5
                },
                {
                  title: "Security",
                  description: "We prioritize the safety and privacy of our users through advanced encryption and robust security measures.",
                  icon: Shield,
                  color: "#DC143C",
                  delay: 0.6
                },
                {
                  title: "Innovation",
                  description: "We are committed to continuous innovation, leveraging cutting-edge technology to enhance the user experience.",
                  icon: Code,
                  color: "#DC143C",
                  delay: 0.7
                },
                {
                  title: "Exclusivity",
                  description: "We cultivate an exclusive environment for serious participants in the findom community.",
                  icon: Award,
                  color: "#DC143C",
                  delay: 0.8
                },
                {
                  title: "Uncompromising Freedom",
                  description: "We provide a platform free from censorship and restrictions, allowing for authentic expression.",
                  icon: Flag,
                  color: "#DC143C",
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
                <Target className="h-5 w-5 text-crimson" />
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
                  <CardHeader className="bg-gradient-to-r from-crimson/20 to-transparent pb-2">
                    <CardTitle>Financial Dominants (Dommes/Doms)</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-white/80">
                      Individuals seeking to exert control and receive financial tributes.
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
                  <CardHeader className="bg-gradient-to-r from-crimson/20 to-transparent pb-2">
                    <CardTitle>Submissives (Subs)</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-white/80">
                      Individuals seeking to submit to a dominant and provide financial tributes.
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
                <Award className="h-5 w-5 text-gunmetal" />
                Value Propositions
              </h2>
              <p className="text-white/70 mb-6">What sets us apart</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Unrestricted Environment",
                  description: "A platform free from censorship and payment processor restrictions.",
                  delay: 1.4,
                  icon: Flag
                },
                {
                  title: "Enhanced Security & Privacy",
                  description: "End-to-end encryption, self-destructing messages, and anonymity features.",
                  delay: 1.5,
                  icon: Lock
                },
                {
                  title: "Comprehensive Toolset",
                  description: "All-in-one platform for messaging, content hosting, payment processing, and community engagement.",
                  delay: 1.6,
                  icon: LayoutGrid
                },
                {
                  title: "Advanced Matching & Analytics",
                  description: "Precision-based matching and in-depth analytics for optimized power exchanges.",
                  delay: 1.7,
                  icon: Target
                },
                {
                  title: "Elite Ranking System",
                  description: "A system that recognizes and rewards top dominants.",
                  delay: 1.8,
                  icon: Award
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
                        <value.icon className="h-5 w-5 text-crimson" />
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
          
          {/* Brand Personality */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.9 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-crimson" />
                Brand Personality
              </h2>
              <p className="text-white/70 mb-6">How we present ourselves</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Edgy",
                  description: "Provocative, daring, and unconventional.",
                  delay: 2.0
                },
                {
                  title: "Authoritative",
                  description: "Confident, decisive, and commanding.",
                  delay: 2.1
                },
                {
                  title: "Sophisticated",
                  description: "Refined, high-quality, and exclusive.",
                  delay: 2.2
                },
                {
                  title: "Technologically Advanced",
                  description: "Cutting-edge, innovative, and secure.",
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
                <MessageCircle className="h-5 w-5 text-crimson" />
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
                        <h3 className="text-lg font-semibold text-crimson mb-3">Voice Characteristics</h3>
                        <ul className="space-y-2 text-white/80">
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                            <p><span className="font-medium">Direct and assertive:</span> Clear and commanding.</p>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                            <p><span className="font-medium">Confident and commanding:</span> Authoritative and powerful.</p>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                            <p><span className="font-medium">Intriguing and provocative:</span> Capturing attention and interest.</p>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                            <p><span className="font-medium">Professional and secure:</span> Trustworthy and reliable.</p>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-crimson mb-3">Key Phrases</h3>
                        <ul className="space-y-2 text-white/80">
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-crimson">→</div>
                            <p>"No compromise"</p>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-crimson">→</div>
                            <p>"Take control"</p>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-crimson">→</div>
                            <p>"Power exchange"</p>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-crimson">→</div>
                            <p>"Secure dominance"</p>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="h-5 w-5 flex-shrink-0 text-crimson">→</div>
                            <p>"Elite experience"</p>
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
                <Palette className="h-5 w-5 text-gunmetal" />
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
                    <div className="h-24 bg-black"></div>
                    <div className="p-4 bg-glass">
                      <p className="font-medium">Deep Onyx</p>
                      <p className="text-white/60 text-sm">#000000</p>
                      <p className="text-white/70 text-sm mt-2">Power, mystery, and exclusivity</p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden border border-white/10">
                    <div className="h-24 bg-crimson"></div>
                    <div className="p-4 bg-glass">
                      <p className="font-medium">Crimson Red</p>
                      <p className="text-white/60 text-sm">#DC143C</p>
                      <p className="text-white/70 text-sm mt-2">Passion, dominance, and intensity</p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden border border-white/10">
                    <div className="h-24 bg-gunmetal"></div>
                    <div className="p-4 bg-glass">
                      <p className="font-medium">Gunmetal</p>
                      <p className="text-white/60 text-sm">#808080</p>
                      <p className="text-white/70 text-sm mt-2">Technological advancement, strength</p>
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
                    <p className="text-white/70 mb-4">A bold, sans-serif font like "Bebas Neue" or "Montserrat Black" for headlines and impactful text.</p>
                    <p className="font-bold text-3xl" style={{fontFamily: 'Montserrat, sans-serif'}}>Montserrat Bold</p>
                    <p className="text-xl mt-2" style={{fontFamily: 'Montserrat, sans-serif'}}>Montserrat Regular</p>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden border border-white/10 p-6 bg-glass">
                    <h4 className="font-medium mb-2">Secondary Font</h4>
                    <p className="text-white/70 mb-4">A clean, modern sans-serif font like "Roboto" or "Open Sans" for body text and interface elements.</p>
                    <p className="font-bold text-3xl" style={{fontFamily: 'Roboto, sans-serif'}}>Roboto Bold</p>
                    <p className="text-xl mt-2" style={{fontFamily: 'Roboto, sans-serif'}}>Roboto Regular</p>
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
                        <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                        <p>Sleek, intuitive, and user-friendly interface.</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                        <p>Dark mode as the default setting.</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                        <p>Clear and concise navigation.</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                        <p>Emphasis on privacy and security features.</p>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                        <p>The UI must feel powerful, and in control.</p>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
          
          {/* Content Guidelines */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Scroll className="h-5 w-5 text-crimson" />
                Content Guidelines
              </h2>
              <p className="text-white/70 mb-6">Our approach to content</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.1 }}
            >
              <Card className="bg-glass border border-white/10">
                <CardContent className="pt-6 pb-6">
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                      <p>Content should be high-quality, engaging, and relevant to the findom community.</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                      <p>Emphasis on educational content related to safe and consensual power dynamics.</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                      <p>Content should reflect the brand's tone of voice and personality.</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                      <p>Content should focus on the benefits of the platform, and the empowerment it gives its users.</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </section>
          
          {/* Marketing and Communication */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-gunmetal" />
                Marketing and Communication
              </h2>
              <p className="text-white/70 mb-6">Our outreach strategy</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.3 }}
            >
              <Card className="bg-glass border border-white/10">
                <CardContent className="pt-6 pb-6">
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                      <p>Targeted digital marketing campaigns focusing on privacy-conscious platforms.</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                      <p>Strategic partnerships with influencers and thought leaders in the findom community.</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                      <p>Emphasis on the platform's security and privacy features in all communications.</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                      <p>Use of strong, direct language in marketing materials.</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </section>
          
          {/* Legal and Compliance */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-crimson" />
                Legal and Compliance
              </h2>
              <p className="text-white/70 mb-6">Our commitment to regulations</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.5 }}
            >
              <Card className="bg-glass border border-white/10">
                <CardContent className="pt-6 pb-6">
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                      <p>Adherence to all relevant laws and regulations regarding online content and financial transactions.</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                      <p>Clear and transparent terms of service and privacy policy.</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 flex-shrink-0 text-crimson mt-0.5">•</div>
                      <p>Robust measures to prevent illegal activities and protect users.</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
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
