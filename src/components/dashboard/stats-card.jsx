
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const StatsCard = ({ title, value, icon: Icon, trend, className }) => {
  const isPositive = trend > 0;
  
  return (
    <motion.div
      className={cn("dashboard-card", className)}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="dashboard-card-header">
        <span className="dashboard-card-title">{title}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="dashboard-card-content">{value}</div>
      {trend !== undefined && (
        <p className="text-xs text-muted-foreground mt-2 flex items-center">
          <span
            className={cn(
              "inline-block mr-1",
              isPositive ? "text-green-500" : "text-red-500"
            )}
          >
            {isPositive ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
          desde o mês passado
        </p>
      )}
    </motion.div>
  );
};

export default StatsCard;
