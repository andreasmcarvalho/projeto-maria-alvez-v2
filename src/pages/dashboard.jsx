
import React from "react";
import { motion } from "framer-motion";
import { Users, PawPrint, Calendar, DollarSign } from "lucide-react";
import StatsCard from "@/components/dashboard/stats-card";
import RecentAppointments from "@/components/dashboard/recent-appointments";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total de Tutores" 
          value="124" 
          icon={Users} 
          trend={5.2} 
        />
        <StatsCard 
          title="Total de Pets" 
          value="256" 
          icon={PawPrint} 
          trend={8.1} 
        />
        <StatsCard 
          title="Consultas do Mês" 
          value="78" 
          icon={Calendar} 
          trend={-2.3} 
        />
        <StatsCard 
          title="Faturamento Mensal" 
          value="R$ 15.480" 
          icon={DollarSign} 
          trend={12.5} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentAppointments />
        </div>
        <div>
          <motion.div 
            className="dashboard-card h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-lg font-medium mb-4">Próximos Vencimentos</h3>
            <div className="space-y-4">
              {[
                { name: "Vacina V10", pet: "Max", date: "18/05/2025" },
                { name: "Antiparasitário", pet: "Luna", date: "20/05/2025" },
                { name: "Consulta de Retorno", pet: "Thor", date: "25/05/2025" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Pet: {item.pet}</p>
                  </div>
                  <div className="text-sm font-medium">{item.date}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
