import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { generateId, validateRequiredFields, formatDateToInput, formatDateToDisplay, formatCurrency } from "@/lib/utils";
import MedicamentoForm from "@/pages/medicamentos/MedicamentoForm";
import MedicamentoTable from "@/pages/medicamentos/MedicamentoTable";

const initialMedicamentoState = { 
  nome: "", 
  quantidade: "", 
  descricao: "", 
  principio_ativo: "", 
  indicacao: "", 
  contraindicacoes: "", 
  dose: "", 
  administracao: "", 
  fabricante: "", 
  estoque: "", 
  preco: "", 
  validade: "",
  data_registro: formatDateToInput(new Date().toISOString()) 
};

const Medicamentos = () => {
  const { toast } = useToast();
  const [medicamentos, setMedicamentos] = useState(() => {
    const savedMedicamentos = localStorage.getItem("medicamentos_v2");
    return savedMedicamentos ? JSON.parse(savedMedicamentos) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMedicamento, setCurrentMedicamento] = useState(initialMedicamentoState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("medicamentos_v2", JSON.stringify(medicamentos));
  }, [medicamentos]);

  const filteredMedicamentos = medicamentos.filter(m => 
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.principio_ativo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.fabricante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const requiredFields = ["nome", "quantidade", "principio_ativo", "indicacao", "dose", "administracao", "fabricante", "estoque", "preco", "validade", "data_registro"];
    const errors = validateRequiredFields(currentMedicamento, requiredFields);
    if (currentMedicamento.estoque && isNaN(parseInt(currentMedicamento.estoque))) {
      errors.estoque = "Estoque deve ser um número.";
    }
    if (currentMedicamento.preco && isNaN(parseFloat(currentMedicamento.preco))) {
      errors.preco = "Preço deve ser um número.";
    }
    if (currentMedicamento.quantidade && isNaN(parseInt(currentMedicamento.quantidade))) {
      errors.quantidade = "Quantidade deve ser um número.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveMedicamento = () => {
    if (!validateForm()) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive"
      });
      return;
    }

    let updatedMedicamentos;
    
    if (isEditing) {
      updatedMedicamentos = medicamentos.map(m => 
        m.id_medicamento === currentMedicamento.id_medicamento ? currentMedicamento : m
      );
      toast({
        title: "Medicamento atualizado",
        description: `${currentMedicamento.nome} foi atualizado com sucesso.`
      });
    } else {
      const newMedicamento = {
        ...currentMedicamento,
        id_medicamento: generateId(),
      };
      updatedMedicamentos = [...medicamentos, newMedicamento];
      toast({
        title: "Medicamento adicionado",
        description: `${newMedicamento.nome} foi adicionado com sucesso.`
      });
    }
    
    setMedicamentos(updatedMedicamentos);
    setIsDialogOpen(false);
    setCurrentMedicamento(initialMedicamentoState);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEditMedicamento = (medicamento) => {
    setCurrentMedicamento({...medicamento, validade: formatDateToInput(medicamento.validade), data_registro: formatDateToInput(medicamento.data_registro)});
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDeleteMedicamento = (id_medicamento) => {
    const medicamentoToDelete = medicamentos.find(m => m.id_medicamento === id_medicamento);
    const updatedMedicamentos = medicamentos.filter(m => m.id_medicamento !== id_medicamento);
    setMedicamentos(updatedMedicamentos);
    
    toast({
      title: "Medicamento removido",
      description: `${medicamentoToDelete.nome} foi removido com sucesso.`
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMedicamento(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar medicamentos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full sm:w-[300px]"
          />
        </div>
        
        <Button 
          onClick={() => {
            setCurrentMedicamento({...initialMedicamentoState, data_registro: formatDateToInput(new Date().toISOString())});
            setIsEditing(false);
            setIsDialogOpen(true);
            setFormErrors({});
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Novo Medicamento
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <MedicamentoTable
          medicamentos={filteredMedicamentos}
          onEdit={handleEditMedicamento}
          onDelete={handleDeleteMedicamento}
          formatDate={formatDateToDisplay}
          formatCurrency={formatCurrency}
        />
      </motion.div>

      <MedicamentoForm
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditing={isEditing}
        medicamentoData={currentMedicamento}
        onInputChange={handleInputChange}
        onSave={handleSaveMedicamento}
        formErrors={formErrors}
      />
    </div>
  );
};

export default Medicamentos;