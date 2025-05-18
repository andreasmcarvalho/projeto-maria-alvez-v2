
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Consultas = () => {
  const { toast } = useToast();
  const [consultas, setConsultas] = useState(() => {
    const savedConsultas = localStorage.getItem("consultas");
    return savedConsultas ? JSON.parse(savedConsultas) : [
      { 
        id: 1, 
        pet: "Max", 
        tutor: "João Silva", 
        data: "2025-05-16", 
        hora: "09:30", 
        tipo: "Consulta de rotina", 
        status: "confirmado",
        veterinario: "Dr. Carlos Mendes"
      },
      { 
        id: 2, 
        pet: "Luna", 
        tutor: "Maria Oliveira", 
        data: "2025-05-16", 
        hora: "11:00", 
        tipo: "Vacinação", 
        status: "pendente",
        veterinario: "Dra. Ana Sousa"
      },
      { 
        id: 3, 
        pet: "Thor", 
        tutor: "Pedro Santos", 
        data: "2025-05-16", 
        hora: "14:30", 
        tipo: "Exame de sangue", 
        status: "confirmado",
        veterinario: "Dr. Carlos Mendes"
      },
      { 
        id: 4, 
        pet: "Bella", 
        tutor: "João Silva", 
        data: "2025-05-17", 
        hora: "10:15", 
        tipo: "Consulta de rotina", 
        status: "confirmado",
        veterinario: "Dra. Ana Sousa"
      },
    ];
  });
  
  const [pets] = useState(() => {
    const savedPets = localStorage.getItem("pets");
    return savedPets ? JSON.parse(savedPets) : [
      { id: 1, nome: "Max", tutor: "João Silva" },
      { id: 2, nome: "Luna", tutor: "Maria Oliveira" },
      { id: 3, nome: "Thor", tutor: "Pedro Santos" },
      { id: 4, nome: "Bella", tutor: "João Silva" },
    ];
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentConsulta, setCurrentConsulta] = useState({ 
    pet: "", 
    tutor: "", 
    data: "", 
    hora: "", 
    tipo: "", 
    status: "pendente",
    veterinario: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("todas");

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const filteredConsultas = consultas
    .filter(consulta => 
      (consulta.pet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consulta.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consulta.tipo.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeTab === "todas" || 
       (activeTab === "hoje" && consulta.data === new Date().toISOString().split('T')[0]) ||
       (activeTab === "pendentes" && consulta.status === "pendente") ||
       (activeTab === "confirmadas" && consulta.status === "confirmado"))
    )
    .sort((a, b) => {
      // Ordenar por data e hora
      const dateA = new Date(`${a.data}T${a.hora}`);
      const dateB = new Date(`${b.data}T${b.hora}`);
      return dateA - dateB;
    });

  const handleSaveConsulta = () => {
    if (!currentConsulta.pet || !currentConsulta.data || !currentConsulta.hora || !currentConsulta.tipo) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Encontrar o tutor do pet selecionado
    const selectedPet = pets.find(pet => pet.nome === currentConsulta.pet);
    const tutorName = selectedPet ? selectedPet.tutor : "";

    let updatedConsultas;
    
    if (isEditing) {
      updatedConsultas = consultas.map(consulta => 
        consulta.id === currentConsulta.id ? {...currentConsulta, tutor: tutorName} : consulta
      );
      toast({
        title: "Consulta atualizada",
        description: `Consulta para ${currentConsulta.pet} foi atualizada com sucesso.`
      });
    } else {
      const newConsulta = {
        ...currentConsulta,
        id: Date.now(),
        tutor: tutorName
      };
      updatedConsultas = [...consultas, newConsulta];
      toast({
        title: "Consulta agendada",
        description: `Consulta para ${newConsulta.pet} foi agendada com sucesso.`
      });
    }
    
    setConsultas(updatedConsultas);
    localStorage.setItem("consultas", JSON.stringify(updatedConsultas));
    setIsDialogOpen(false);
    setCurrentConsulta({ 
      pet: "", 
      tutor: "", 
      data: "", 
      hora: "", 
      tipo: "", 
      status: "pendente",
      veterinario: ""
    });
    setIsEditing(false);
  };

  const handleEditConsulta = (consulta) => {
    setCurrentConsulta(consulta);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteConsulta = (id) => {
    const consultaToDelete = consultas.find(consulta => consulta.id === id);
    const updatedConsultas = consultas.filter(consulta => consulta.id !== id);
    setConsultas(updatedConsultas);
    localStorage.setItem("consultas", JSON.stringify(updatedConsultas));
    
    toast({
      title: "Consulta removida",
      description: `Consulta para ${consultaToDelete.pet} foi removida com sucesso.`
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmado": return "bg-green-100 text-green-800 border-green-200";
      case "pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelado": return "bg-red-100 text-red-800 border-red-200";
      case "concluido": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
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
            setCurrentConsulta({ 
              pet: "", 
              tutor: "", 
              data: "", 
              hora: "", 
              tipo: "", 
              status: "pendente",
              veterinario: ""
            });
            setIsEditing(false);
            setIsDialogOpen(true);
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
        className="bg-card rounded-lg border shadow-sm overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pet</TableHead>
              <TableHead className="hidden md:table-cell">Tutor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead className="hidden lg:table-cell">Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConsultas.length > 0 ? (
              filteredConsultas.map((consulta) => (
                <TableRow key={consulta.id}>
                  <TableCell className="font-medium">{consulta.pet}</TableCell>
                  <TableCell className="hidden md:table-cell">{consulta.tutor}</TableCell>
                  <TableCell>{formatDate(consulta.data)}</TableCell>
                  <TableCell>{consulta.hora}</TableCell>
                  <TableCell className="hidden lg:table-cell">{consulta.tipo}</TableCell>
                  <TableCell>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consulta.status)}`}>
                      {consulta.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditConsulta(consulta)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteConsulta(consulta.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Nenhuma consulta encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Consulta" : "Agendar Nova Consulta"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pet">Pet*</Label>
                <Select
                  value={currentConsulta.pet}
                  onValueChange={(value) => setCurrentConsulta({ ...currentConsulta, pet: value })}
                >
                  <SelectTrigger id="pet">
                    <SelectValue placeholder="Selecione um pet" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.nome}>
                        {pet.nome} ({pet.tutor})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data*</Label>
                  <Input
                    id="data"
                    type="date"
                    value={currentConsulta.data}
                    onChange={(e) => setCurrentConsulta({ ...currentConsulta, data: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hora">Hora*</Label>
                  <Input
                    id="hora"
                    type="time"
                    value={currentConsulta.hora}
                    onChange={(e) => setCurrentConsulta({ ...currentConsulta, hora: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Consulta*</Label>
                <Select
                  value={currentConsulta.tipo}
                  onValueChange={(value) => setCurrentConsulta({ ...currentConsulta, tipo: value })}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consulta de rotina">Consulta de rotina</SelectItem>
                    <SelectItem value="Vacinação">Vacinação</SelectItem>
                    <SelectItem value="Exame de sangue">Exame de sangue</SelectItem>
                    <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                    <SelectItem value="Emergência">Emergência</SelectItem>
                    <SelectItem value="Retorno">Retorno</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="veterinario">Veterinário</Label>
                  <Select
                    value={currentConsulta.veterinario}
                    onValueChange={(value) => setCurrentConsulta({ ...currentConsulta, veterinario: value })}
                  >
                    <SelectTrigger id="veterinario">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Carlos Mendes">Dr. Carlos Mendes</SelectItem>
                      <SelectItem value="Dra. Ana Sousa">Dra. Ana Sousa</SelectItem>
                      <SelectItem value="Dr. Ricardo Lima">Dr. Ricardo Lima</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={currentConsulta.status}
                    onValueChange={(value) => setCurrentConsulta({ ...currentConsulta, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveConsulta}>{isEditing ? "Atualizar" : "Agendar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Consultas;
