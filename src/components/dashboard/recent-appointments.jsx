
import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RecentAppointments = () => {
  const appointments = [
    {
      id: 1,
      petName: "Max",
      ownerName: "João Silva",
      date: "16/05/2025",
      time: "09:30",
      status: "confirmado",
      type: "Consulta de rotina"
    },
    {
      id: 2,
      petName: "Luna",
      ownerName: "Maria Oliveira",
      date: "16/05/2025",
      time: "11:00",
      status: "pendente",
      type: "Vacinação"
    },
    {
      id: 3,
      petName: "Thor",
      ownerName: "Pedro Santos",
      date: "16/05/2025",
      time: "14:30",
      status: "confirmado",
      type: "Exame de sangue"
    },
    {
      id: 4,
      petName: "Bella",
      ownerName: "Ana Costa",
      date: "17/05/2025",
      time: "10:15",
      status: "confirmado",
      type: "Consulta de rotina"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmado": return "bg-green-100 text-green-800 border-green-200";
      case "pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelado": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Consultas Recentes</CardTitle>
        <Button variant="ghost" size="sm">Ver todas</Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {appointments.map((appointment, index) => (
            <motion.div 
              key={appointment.id}
              className="flex items-center justify-between p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {appointment.petName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{appointment.petName}</p>
                  <p className="text-sm text-muted-foreground">{appointment.ownerName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right mr-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {appointment.date}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {appointment.time}
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </div>
                
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAppointments;
