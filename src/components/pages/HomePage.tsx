// HPI 1.7-V
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle2, LayoutGrid, Users, CalendarRange, CreditCard, BedDouble, Wrench, Sparkles, ShieldCheck } from 'lucide-react';

// --- Types & Interfaces ---
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}

interface StatProps {
  label: string;
  value: string;
}

// --- Components ---

const FeatureCard = ({ title, description, icon: Icon, color, delay }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={`group relative overflow-hidden rounded-3xl p-8 ${color} transition-all duration-500 hover:shadow-2xl hover:-translate-y-1`}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/10 mb-4 backdrop-blur-sm text-black">
            <Icon size={24} />
          </div>
          <h3 className="font-heading text-3xl text-black mb-2 uppercase tracking-tight">{title}</h3>
          <p className="font-paragraph text-black/80 text-lg leading-relaxed">{description}</p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-heading text-sm text-black uppercase tracking-widest">Manage</span>
          <ArrowRight size={16} className="text-black" />
        </div>
      </div>
      {/* Decorative background shape */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 ease-out" />
    </motion.div>
  );
};

const ParallaxText = ({ children, baseVelocity = 100 }: { children: string; baseVelocity: number }) => {
  const baseX = useRef(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useSpring(scrollY, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(scrollVelocity, [0, 1000], [0, 5], { clamp: false });
  const [x, setX] = useState(0);

  const xTransform = useTransform(scrollY, (v) => `${x}px`);

  useEffect(() => {
    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      let moveBy = baseVelocity * (delta / 1000);
      
      // Apply velocity factor from scroll
      // We can't easily get the exact numeric value from the motion value in the loop without get(), 
      // but for this effect, constant motion is fine, enhanced by scroll direction if needed.
      // For simplicity and crash safety, we'll stick to a constant flow that reacts slightly.
      
      baseX.current += moveBy;
      // Wrap logic would go here for infinite scroll, but for this design, a simple marquee is sufficient.
      // Resetting to avoid overflow issues in long sessions
      if (baseX.current > 0) baseX.current = -1000;
      if (baseX.current < -1000) baseX.current = 0;
      
      setX(baseX.current);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [baseVelocity]);

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div style={{ x: xTransform }} className="flex flex-nowrap gap-8">
        <span className="block text-[12vw] font-heading leading-none text-primary opacity-20 uppercase">{children}</span>
        <span className="block text-[12vw] font-heading leading-none text-primary opacity-20 uppercase">{children}</span>
        <span className="block text-[12vw] font-heading leading-none text-primary opacity-20 uppercase">{children}</span>
        <span className="block text-[12vw] font-heading leading-none text-primary opacity-20 uppercase">{children}</span>
      </motion.div>
    </div>
  );
};

export default function HomePage() {
  const { member, isAuthenticated, actions } = useMember();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  // Canonical Data Source for Features
  const features = [
    { title: 'Rooms', desc: 'Inventory & Status Control', icon: BedDouble, color: 'bg-cream' },
    { title: 'Reservations', desc: 'Booking Engine & Calendar', icon: CalendarRange, color: 'bg-lavenderspot' },
    { title: 'Guests', desc: 'CRM & Profiles', icon: Users, color: 'bg-secondary' },
    { title: 'Staff', desc: 'Shift Management', icon: ShieldCheck, color: 'bg-primary' },
    { title: 'Services', desc: 'Amenity Catalog', icon: Sparkles, color: 'bg-cream' },
    { title: 'Payments', desc: 'Transaction History', icon: CreditCard, color: 'bg-lavenderspot' },
    { title: 'Housekeeping', desc: 'Task Assignment', icon: LayoutGrid, color: 'bg-secondary' },
    { title: 'Maintenance', desc: 'Repair Tracking', icon: Wrench, color: 'bg-primary' },
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-cream overflow-clip" ref={containerRef}>
      <Header />

      {/* --- HERO SECTION --- */}
      {/* Replicating the layout of the inspiration image: Full bleed, corner anchors, massive center text */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Layer with Parallax */}
        <motion.div 
          style={{ y, scale }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src="https://static.wixstatic.com/media/e40e66_299192f2a959492f89aca1e539c52ef5~mv2.png?originWidth=1600&originHeight=896"
            alt="Grand Horizon Hotel Exterior"
            className="w-full h-full object-cover"
            width={2400}
          />
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
          {/* Atmospheric Gradients (The "Apex" Look) */}
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-lavenderspot/40 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-primary/40 blur-[150px] rounded-full mix-blend-screen" />
        </motion.div>

        {/* Content Layer - Z-Index 10 to sit above background */}
        <div className="relative z-10 w-full h-full max-w-[120rem] mx-auto px-6 md:px-12 flex flex-col justify-between py-12">
          
          {/* Top Row */}
          <div className="flex justify-between items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-cream/10 backdrop-blur-md px-6 py-2 rounded-full border border-cream/20"
            >
              <span className="font-heading text-cream text-sm tracking-widest">PALO ALTO, CA</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex gap-4"
            >
               {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button className="bg-cream text-black hover:bg-white rounded-full px-8 font-heading tracking-wide">
                    DASHBOARD
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={actions.login}
                  className="bg-primary text-cream hover:bg-primary/90 rounded-full px-8 font-heading tracking-wide border-none"
                >
                  LOGIN
                </Button>
              )}
            </motion.div>
          </div>

          {/* Center - Massive Typography */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-[12vw] md:text-[14vw] leading-[0.85] text-center text-cream mix-blend-overlay tracking-tighter"
            >
              GRAND<br />HORIZON
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-8 font-heading text-xl md:text-2xl text-cream tracking-[0.5em] uppercase"
            >
              Hotel Management System
            </motion.p>
          </div>

          {/* Bottom Row */}
          <div className="flex justify-between items-end">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-xs"
            >
              <h2 className="font-heading text-3xl text-cream mb-2">EST. 2024</h2>
              <p className="font-paragraph text-cream/80 text-sm">
                Redefining the intersection of luxury hospitality and digital efficiency.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-right"
            >
              <div className="bg-cream/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-cream/20">
                <span className="block font-heading text-4xl text-cream">v2.0</span>
                <span className="block font-paragraph text-xs text-cream/60 uppercase tracking-widest">System Status: Online</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- TICKER SECTION --- */}
      <div className="bg-black py-6 overflow-hidden border-y border-white/10">
        <ParallaxText baseVelocity={-5}>
          STREAMLINE • OPTIMIZE • ELEVATE • CONTROL • 
        </ParallaxText>
      </div>

      {/* --- STICKY NARRATIVE SECTION --- */}
      <section className="relative w-full max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
          {/* Sticky Left Panel */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-0 h-screen flex flex-col justify-center p-12 md:p-24 bg-primary text-cream">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="w-20 h-1 bg-cream mb-8" />
                <h2 className="font-heading text-6xl md:text-7xl leading-none mb-8">
                  THE NEW<br />STANDARD
                </h2>
                <p className="font-paragraph text-xl md:text-2xl text-cream/90 leading-relaxed max-w-md">
                  Forget clunky interfaces. Grand Horizon brings the soul of indie design to the logic of hotel management.
                </p>
                <div className="mt-12 flex gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-secondary" />
                    <span className="font-heading text-sm uppercase tracking-wider">Real-time Sync</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-secondary" />
                    <span className="font-heading text-sm uppercase tracking-wider">Secure Data</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scrollable Right Panel */}
          <div className="lg:col-span-7 bg-background p-8 md:p-24 flex flex-col justify-center">
            <div className="space-y-24">
              {[
                { head: "Intuitive Control", body: "Navigate your entire property from a single, beautifully designed dashboard. Every room, every guest, every request." },
                { head: "Data Driven", body: "Make decisions based on real-time analytics. Our system processes thousands of data points to give you clarity." },
                { head: "Guest Centric", body: "Create unforgettable experiences by anticipating guest needs before they even ask. The system remembers everything." }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <h3 className="font-heading text-4xl md:text-5xl text-black mb-6">{item.head}</h3>
                  <p className="font-paragraph text-xl text-black/70 leading-relaxed max-w-xl border-l-2 border-black/10 pl-6">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- MODULES GRID SECTION --- */}
      <section className="w-full bg-cream py-32 rounded-t-[3rem] -mt-12 relative z-20">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div>
              <h2 className="font-heading text-6xl md:text-8xl text-black leading-[0.9]">
                SYSTEM<br />MODULES
              </h2>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="font-paragraph text-xl text-black/60 max-w-md text-right">
                Eight powerful datasets working in harmony to power your property.
              </p>
            </div>
          </div>

          {/* Masonry-style Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard 
                key={feature.title}
                {...feature}
                delay={index * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- VISUAL BREATHER / PARALLAX --- */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://static.wixstatic.com/media/e40e66_7a5a2f456f7f4aa0958a1218e2743a9b~mv2.png?originWidth=1600&originHeight=896"
            alt="Interior Design Detail"
            className="w-full h-full object-cover grayscale contrast-125"
            width={2400}
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/80 backdrop-blur-xl p-12 md:p-20 max-w-4xl text-center rounded-[3rem]">
            <h2 className="font-heading text-5xl md:text-7xl text-cream mb-8">
              "Architecture is frozen music."
            </h2>
            <p className="font-paragraph text-xl text-cream/60">
              Manage your masterpiece with the precision it deserves.
            </p>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="w-full bg-black py-32 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-lavenderspot/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[100rem] mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-6xl md:text-9xl text-cream mb-12 tracking-tighter">
              READY TO<br />BEGIN?
            </h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {!isAuthenticated ? (
                <Button 
                  size="lg"
                  onClick={actions.login}
                  className="bg-primary text-cream hover:bg-primary/90 rounded-full px-16 py-10 text-2xl font-heading transition-transform hover:scale-105"
                >
                  ACCESS SYSTEM
                </Button>
              ) : (
                <Link to="/dashboard">
                  <Button 
                    size="lg"
                    className="bg-secondary text-black hover:bg-secondary/90 rounded-full px-16 py-10 text-2xl font-heading transition-transform hover:scale-105"
                  >
                    ENTER DASHBOARD
                  </Button>
                </Link>
              )}
              
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-cream/20 text-cream hover:bg-cream hover:text-black rounded-full px-12 py-10 text-xl font-heading bg-transparent"
              >
                VIEW DOCUMENTATION
              </Button>
            </div>

            <p className="mt-12 font-paragraph text-cream/40 text-sm uppercase tracking-widest">
              Secure • Scalable • Sophisticated
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}