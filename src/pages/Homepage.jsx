import MapView from '@/components/MapView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  Droplets,
  Facebook,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Phone,
  Shield,
  Twitter,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Droplets,
      title: 'Automated HMPI Calculation',
      description:
        'Real-time calculation of Heavy Metal Pollution Index using advanced algorithms for accurate water quality assessment.'
    },
    {
      icon: MapPin,
      title: 'Map-based Visualization',
      description:
        'Interactive maps showing pollution levels across different locations with color-coded indicators for quick assessment.'
    },
    {
      icon: Shield,
      title: 'Reliable & Error-Free Results',
      description:
        'State-of-the-art sensors and validation systems ensure accurate, consistent, and error-free monitoring results.'
    },
    {
      icon: BarChart3,
      title: 'Policy-Oriented Insights',
      description:
        'Comprehensive reports and analytics designed specifically for policymakers and regulatory decision-making.'
    }
  ];

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Map View', href: '#mapview' },
    { name: 'Features', href: '#features' },
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-500 hover:scale-110' },
    { icon: Twitter, href: '#', color: 'hover:text-sky-400 hover:scale-110' },
    { icon: Github, href: '#', color: 'hover:text-gray-900 hover:scale-110' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-600 hover:scale-110' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-background/70 backdrop-blur-lg shadow-md border-b border-[#e12454]'
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md">
                <Droplets className="w-5 h-5 text-[#e12454] icon-accent" />
              </div>
              <span className="text-xl font-bold text-[#223a66]">HMPI Monitor</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    // Smooth scroll behavior for internal anchors
                    if (item.href.startsWith('#')) {
                      e.preventDefault();
                      const el = document.querySelector(item.href);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      setIsMenuOpen(false);
                    }
                  }}
                  className="relative font-medium text-muted-foreground hover:text-[#e12454] transition-colors 
                       after:absolute after:w-0 after:h-0.5 after:bg-[#e12454] after:left-0 after:-bottom-1 
                       hover:after:w-full after:transition-all"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')} className="hover:bg-primary hover:text-primary-foreground transition-all" > Login </Button>
              <Button onClick={() => navigate('/')} className="btn-primary text-primary-foreground hover:shadow-lg hover:scale-105 transition-all" > Get Started </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-[#e12454]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-background/95 backdrop-blur-lg border-t border-[#e12454] shadow-lg"
            >
              <div className="px-4 py-4 space-y-2">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-muted-foreground hover:text-[#e12454] hover:bg-[#f4f9fc]/30 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="flex flex-col space-y-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="rounded-full hover:bg-[#e12454] hover:text-white transition-all"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    className="btn-primary text-[#223a66] hover:bg-[#e12454] hover:shadow-lg hover:scale-105 transition-all rounded-full"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        {/* Background image layer (blurred) */}
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden"
        >
          <img
            src="https://e0.pxfuel.com/wallpapers/205/764/desktop-wallpaper-drink-water-every-day-its-healthy-drinking-water.jpg"
            alt="Drinking water background"
            className="w-full h-full object-cover transform scale-105 filter blur-sm brightness-75"
          />
          {/* Color tint overlay to improve text contrast */}
          <div className="absolute inset-0 bg-[rgba(244,249,252,0.45)] backdrop-blur-sm"></div>
        </div>

        <div className="relative text-center max-w-4xl px-6 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
          >
            Automated Heavy Metal
            <span className="block text-primary drop-shadow-md">
              Pollution Monitoring
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-8"
          >
            Ensuring safe drinking water through accurate, real-time analysis of heavy metal contamination levels
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/')}
              className="btn-primary hover:shadow-lg hover:scale-105 transition-all px-8 py-3 text-lg"
            >
              Get Started <ArrowRight className="w-5 h-5 ml-2 icon-accent" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-lg hover:bg-muted hover:scale-105 transition-all"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
      {/* Map View (new section) */}
      <section id="mapview" className="py-24" style={{ backgroundColor: '#f4f9fc' }}>
        <MapView />
      </section>
      {/* Features */}
      <section id="features" className="py-24" style={{ backgroundColor: '#f4f9fc' }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-primary border-b-4 border-[#e12454] inline-block pb-2">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Technology-driven insights for environmental monitoring
            </p>

          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="hover:scale-105 transition-all"
                >
                  <Card className="rounded-2xl shadow-lg border border-border/40 bg-gradient-to-br from-background to-muted/30 hover:shadow-xl transition-all h-full">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                        <Icon className="w-8 h-8 text-primary-foreground icon-accent" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24" style={{ backgroundColor: '#f4f9fc' }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
            <div className="w-full h-96 rounded-2xl overflow-hidden shadow-inner">
              <img
                src="https://i.pinimg.com/736x/09/3d/3a/093d3a4d1bbe1202491ebd06214a1f9e.jpg"
                alt="Clean water flowing"
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>

          {/* Right */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
            <h2 className="text-4xl font-bold mb-6 text-primary">Why Groundwater Pollution Monitoring Matters</h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                Heavy metal pollution in groundwater poses a significant threat to public health and environmental
                sustainability...
              </p>
              <p>
                The Heavy Metal Pollution Index (HMPI) provides a comprehensive assessment of water quality...
              </p>
              <p>
                Our automated monitoring system ensures continuous, accurate data collection and analysis...
              </p>
            </div>
            <Button className="mt-8 btn-primary hover:scale-105 transition-all">
              Learn More <ChevronRight className="w-5 h-5 ml-2 icon-accent" />
            </Button>
          </motion.div>
        </div>
      </section>



      {/* Footer */}
      <footer className="border-t border-border mt-12" style={{ backgroundColor: '#f4f9fc' }}>
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md mr-2">
                <Droplets className="w-5 h-5 text-primary-foreground icon-accent" />
              </div>
              <span className="text-lg font-bold">HMPI Monitor</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Advanced environmental monitoring system for heavy metal pollution detection and water quality assessment.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center bg-muted text-muted-foreground transition-all ${social.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#home" className="hover:text-primary transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary transition">
                  About
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-primary transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-muted-foreground">
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2" /> info@hmpi.gov
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2" /> +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border py-6 text-center text-muted-foreground text-sm">
          © 2025 HMPI Monitoring System. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
