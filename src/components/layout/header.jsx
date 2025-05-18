
import React from "react";
import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = ({ title }) => {
  return (
    <motion.div 
      className="flex items-center justify-between py-4 px-6 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold">{title}</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar..." 
            className="pl-9 w-[200px] lg:w-[300px] bg-background"
          />
        </div>
        
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] flex items-center justify-center text-white">
            3
          </span>
        </Button>
      </div>
    </motion.div>
  );
};

export default Header;
