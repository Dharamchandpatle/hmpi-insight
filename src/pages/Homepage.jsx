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
    Home,
    Info,
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
      description: 'Real-time calculation of Heavy Metal Pollution Index using advanced algorithms for accurate water quality assessment.'
    },
    {
      icon: MapPin,
      title: 'Map-based Visualization',
      description: 'Interactive maps showing pollution levels across different locations with color-coded indicators for quick assessment.'
    },
    {
      icon: Shield,
      title: 'Reliable & Error-Free Results',
      description: 'State-of-the-art sensors and validation systems ensure accurate, consistent, and error-free monitoring results.'
    },
    {
      icon: BarChart3,
      title: 'Policy-Oriented Insights',
      description: 'Comprehensive reports and analytics designed specifically for policymakers and regulatory decision-making.'
    }
  ];

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { icon: Github, href: '#', color: 'hover:text-gray-900' },
    { icon: Linkedin, href: '#', color: 'hover:text-blue-700' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Droplets className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">HMPI Monitor</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Login/Register Button */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary transition-colors"
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
              className="md:hidden bg-background/95 backdrop-blur-md border-t border-border"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="flex flex-col space-y-2 px-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="w-full justify-start"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow"
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
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-green-900/20 to-teal-900/20">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              Automated Heavy Metal
              <span className="block text-transparent bg-clip-text bg-gradient-primary">
                Pollution Monitoring
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Ensuring safe drinking water through accurate, real-time analysis of heavy metal contamination levels
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate('/')}
                className="bg-gradient-primary text-primary-foreground hover:shadow-glow px-8 py-3 text-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 text-lg hover:bg-muted"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Features for Water Quality Monitoring
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced technology and intelligent analysis for comprehensive environmental monitoring
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
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-environmental transition-all duration-300 h-full">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Droplets className="w-24 h-24 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">Clean Water Illustration</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-16 h-16 text-primary-foreground" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Groundwater Pollution Monitoring Matters
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  Heavy metal pollution in groundwater poses a significant threat to public health and environmental sustainability.
                  Sources include industrial waste, agricultural runoff, and improper disposal of electronic waste.
                </p>
                <p>
                  The Heavy Metal Pollution Index (HMPI) provides a comprehensive assessment of water quality by measuring
                  concentrations of toxic metals like lead, arsenic, cadmium, and mercury.
                </p>
                <p>
                  Our automated monitoring system ensures continuous, accurate data collection and analysis,
                  enabling timely interventions and informed policy decisions to protect communities and ecosystems.
                </p>
              </div>
              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-gradient-primary text-primary-foreground hover:shadow-glow"
                >
                  Learn More About HMPI
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">HMPI Monitor</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Advanced environmental monitoring system for heavy metal pollution detection and water quality assessment.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground transition-colors ${social.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                    <Info className="w-4 h-4 mr-2" />
                    About
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#contact" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Contact</h3>
              <div className="space-y-2 text-muted-foreground">
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  info@hmpi.gov
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2025 HMPI Monitoring System. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;