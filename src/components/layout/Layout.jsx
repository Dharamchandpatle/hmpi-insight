import { motion } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar />
      <Header />
      
      <motion.main
        className="ml-64 pt-16 min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-6">
          {children}
        </div>
      </motion.main>
    </div>
  );
};