import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import Tutores from "@/pages/tutores";
import Pets from "@/pages/pets";
import Consultas from "@/pages/consultas/Consultas"; 
import Medicamentos from "@/pages/medicamentos/Medicamentos";
import Vacinas from "@/pages/vacinas";
import Exames from "@/pages/exames";
import VacinaVermifugos from "@/pages/vacinaVermifugos";
import AnimalCastracao from "@/pages/animalCastracao";
import ListaCastracao from "@/pages/listaCastracao";
import ExameVeterinario from "@/pages/exameVeterinario";
import ListaExames from "@/pages/listaExames";
import Produtos from "@/pages/produtos";
import Estoque from "@/pages/estoque";
import Cirurgias from "@/pages/cirurgias";
import Internacoes from "@/pages/internacoes";
import ConsultaClinica from "@/pages/consultaClinica";
import RelatorioAtendimento from "@/pages/relatorioAtendimento";
import Financeiro from "@/pages/financeiro";
import Configuracoes from "@/pages/configuracoes";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const getPageTitle = () => {
    switch (activePage) {
      case "dashboard": return "Dashboard";
      case "tutores": return "Gerenciar Tutores";
      case "pets": return "Gerenciar Pets";
      case "consultas": return "Agendamento de Consultas";
      case "vacinas": return "Gerenciar Vacinas";
      case "medicamentos": return "Gerenciar Medicamentos";
      case "exames": return "Gerenciar Exames";
      case "vacinaVermifugos": return "Vacinas/Vermífugos Pet";
      case "animalCastracao": return "Castração de Animais";
      case "listaCastracao": return "Lista de Castração";
      case "exameVeterinario": return "Exames Veterinários";
      case "listaExames": return "Lista de Exames";
      case "produtos": return "Gerenciar Produtos";
      case "estoque": return "Controle de Estoque";
      case "cirurgias": return "Agendamento de Cirurgias";
      case "internacoes": return "Controle de Internações";
      case "consultaClinica": return "Consultas Clínicas";
      case "relatorioAtendimento": return "Relatórios de Atendimento";
      case "financeiro": return "Controle Financeiro";
      case "configuracoes": return "Configurações";
      default: return "Dashboard";
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "tutores": return <Tutores />;
      case "pets": return <Pets />;
      case "consultas": return <Consultas />;
      case "vacinas": return <Vacinas />;
      case "medicamentos": return <Medicamentos />;
      case "exames": return <Exames />;
      case "vacinaVermifugos": return <VacinaVermifugos />;
      case "animalCastracao": return <AnimalCastracao />;
      case "listaCastracao": return <ListaCastracao />;
      case "exameVeterinario": return <ExameVeterinario />;
      case "listaExames": return <ListaExames />;
      case "produtos": return <Produtos />;
      case "estoque": return <Estoque />;
      case "cirurgias": return <Cirurgias />;
      case "internacoes": return <Internacoes />;
      case "consultaClinica": return <ConsultaClinica />;
      case "relatorioAtendimento": return <RelatorioAtendimento />;
      case "financeiro": return <Financeiro />;
      case "configuracoes": return <Configuracoes />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getPageTitle()} />
        
        <motion.main 
          className="flex-1 overflow-y-auto p-6"
          key={activePage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.main>
      </div>
      
      <Toaster />
    </div>
  );
};

export default App;