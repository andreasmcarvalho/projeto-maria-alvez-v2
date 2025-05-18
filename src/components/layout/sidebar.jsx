import React from "react";
import { motion } from "framer-motion";
import { 
  Home, Users, Calendar, Stethoscope, Pill, DollarSign, Settings, PawPrint, Menu, X,
  Syringe, Microscope, Heart, ListChecks, Package, Warehouse, Scissors, BedDouble, FileText, ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Sidebar = ({ activePage, setActivePage }) => {
  const [expanded, setExpanded] = React.useState(true);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "tutores", label: "Tutores", icon: Users },
    { id: "pets", label: "Pets", icon: PawPrint },
    { id: "consultas", label: "Consultas", icon: Stethoscope },
    { id: "vacinas", label: "Vacinas", icon: Syringe },
    { id: "medicamentos", label: "Medicamentos", icon: Pill },
    { id: "exames", label: "Exames", icon: Microscope },
    { id: "vacinaVermifugos", label: "Vacinas/Vermífugos Pet", icon: Syringe },
    { id: "animalCastracao", label: "Castração", icon: Heart },
    { id: "listaCastracao", label: "Lista de Castração", icon: ListChecks },
    { id: "exameVeterinario", label: "Exames Veterinários", icon: Microscope },
    { id: "listaExames", label: "Lista de Exames", icon: ClipboardList },
    { id: "produtos", label: "Produtos", icon: Package },
    { id: "estoque", label: "Estoque", icon: Warehouse },
    { id: "cirurgias", label: "Cirurgias", icon: Scissors },
    { id: "internacoes", label: "Internações", icon: BedDouble },
    { id: "consultaClinica", label: "Consulta Clínica", icon: Stethoscope },
    { id: "relatorioAtendimento", label: "Relatório Atendimento", icon: FileText },
    { id: "financeiro", label: "Financeiro", icon: DollarSign },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ];

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="rounded-full bg-background/80 backdrop-blur-sm"
        >
          {expanded ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      <motion.div
        className={cn(
          "fixed top-0 left-0 h-full bg-background border-r z-40 shadow-sm overflow-y-auto",
          expanded ? "w-64" : "w-20",
          "md:relative md:block",
          !expanded && "md:w-20",
          !expanded && !expanded && "hidden md:block" 
        )}
        animate={{ width: expanded ? 256 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <motion.div
              className="flex items-center gap-3"
              animate={{ justifyContent: expanded ? "flex-start" : "center" }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                <PawPrint className="h-6 w-6 text-primary" />
              </div>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-lg"
                >
                  VetClinic
                </motion.div>
              )}
            </motion.div>
          </div>

          <div className="flex-1 py-6 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  className={cn(
                    "sidebar-item w-full",
                    activePage === item.id && "active"
                  )}
                  onClick={() => setActivePage(item.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{ justifyContent: expanded ? "flex-start" : "center" }}
                  title={!expanded ? item.label : ""}
                >
                  <Icon className="h-5 w-5" />
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="p-4 border-t mt-auto">
            <motion.div
              className="flex items-center gap-3"
              animate={{ justifyContent: expanded ? "flex-start" : "center" }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                <span className="text-sm font-medium">AV</span>
              </div>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm"
                >
                  Administrador
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;