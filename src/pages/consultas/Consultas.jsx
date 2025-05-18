import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { generateId, validateRequiredFields, formatDateToInput, formatDateToDisplay } from "@/lib/utils";
import ConsultaForm from "@/pages/consultas/ConsultaForm";
import ConsultaTable from "@/pages/consultas/ConsultaTable";

const initialConsultaState = { 
  pet: "", 
  tutor: "", 
  data: "", 
  hora: "", 
  tipo: "", 
  status: "pendente",
  veterinario: ""
};

const Consultas = () => {
  const { toast } = useToast();
  const [consultas, setConsultas] = useState(() => {
    const savedConsultas = localStorage.getItem("consultas_v2");
    return savedConsultas ? JSON.parse(savedConsultas) : [];
  });
  
  const [pets, setPets] = useState(() => {
    const savedPets = localStorage.getItem("pets");
    return savedPets ? JSON.parse(savedPets) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentConsulta, setCurrentConsulta] = useState(initialConsultaState);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("todas");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("consultas_v2", JSON.stringify(consultas));
  }, [consultas]);

  const filteredConsultas = consultas
    .filter(consulta => 
      (consulta.pet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consulta.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consulta.tipo.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeTab === "todas" || 
       (activeTab === "hoje" && consulta.data === formatDateToInput(new Date().toISOString())) ||
       (activeTab === "pendentes" && consulta.status === "pendente") ||
       (activeTab === "confirmadas" && consulta.status === "confirmado"))
    )
    .sort((a, b) => {
      const dateA = new Date(`${a.data}T${a.hora}`);
      const dateB = new Date(`${b.data}T${b.hora}`);
      return dateA - dateB;
    });

  const validateForm = () => {
    const requiredFields = ["pet", "data", "hora", "tipo", "status", "veterinario"];
    const errors = validateRequiredFields(currentConsulta, requiredFields);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveConsulta = () => {
    if (!validateForm()) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive"
      });
      return;
    }

    const selectedPet = pets.find(p => p.nome === currentConsulta.pet);
    const tutorName = selectedPet ? selectedPet.tutor : "";

    let updatedConsultas;
    
    if (isEditing) {
      updatedConsultas = consultas.map(c => 
        c.id_consulta === currentConsulta.id_consulta ? {...currentConsulta, tutor: tutorName} : c
      );
      toast({
        title: "Consulta atualizada",
        description: `Consulta para ${currentConsulta.pet} foi atualizada.`
      });
    } else {
      const newConsulta = {
        ...currentConsulta,
        id_consulta: generateId(),
        tutor: tutorName
      };
      updatedConsultas = [...consultas, newConsulta];
      toast({
        title: "Consulta agendada",
        description: `Consulta para ${newConsulta.pet} foi agendada.`
      });
    }
    
    setConsultas(updatedConsultas);
    setIsDialogOpen(false);
    setCurrentConsulta(initialConsultaState);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEditConsulta = (consulta) => {
    setCurrentConsulta({...consulta, data: formatDateToInput(consulta.data) });
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDeleteConsulta = (id_consulta) => {
    const consultaToDelete = consultas.find(c => c.id_consulta === id_consulta);
    const updatedConsultas = consultas.filter(c => c.id_consulta !== id_consulta);
    setConsultas(updatedConsultas);
    
    toast({
      title: "Consulta removida",
      description: `Consulta para ${consultaToDelete.pet} foi removida.`
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentConsulta(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setCurrentConsulta(prev => ({ ...prev, [name]: value }));
     if (name === "pet") {
      const selectedPetData = pets.find(p => p.nome === value);
      if (selectedPetData) {
        setCurrentConsulta(prev => ({ ...prev, tutor: selectedPetData.tutor }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar consultas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full sm:w-[300px]"
          />
        </div>
        
        <Button 
          onClick={() => {
            setCurrentConsulta(initialConsultaState);
            setIsEditing(false);
            setIsDialogOpen(true);
            setFormErrors({});
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Nova Consulta
        </Button>
      </div>
      
      <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="hoje">Hoje</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="confirmadas">Confirmadas</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ConsultaTable 
          consultas={filteredConsultas}
          onEdit={handleEditConsulta}
          onDelete={handleDeleteConsulta}
          formatDate={formatDateToDisplay}
        />
      </motion.div>

      <ConsultaForm
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditing={isEditing}
        consultaData={currentConsulta}
        pets={pets}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSave={handleSaveConsulta}
        formErrors={formErrors}
      />
    </div>
  );
};

export default Consultas;