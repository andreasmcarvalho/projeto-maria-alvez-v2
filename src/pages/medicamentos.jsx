
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
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

const Medicamentos = () => {
  const { toast } = useToast();
  const [medicamentos, setMedicamentos] = useState(() => {
    const savedMedicamentos = localStorage.getItem("medicamentos");
    return savedMedicamentos ? JSON.parse(savedMedicamentos) : [
      { id: 1, nome: "Amoxicilina", tipo: "Antibiótico", dosagem: "250mg", estoque: 45, fornecedor: "PharmaVet" },
      { id: 2, nome: "Dipirona", tipo: "Analgésico", dosagem: "500mg", estoque: 30, fornecedor: "MediPet" },
      { id: 3, nome: "Dexametasona", tipo: "Anti-inflamatório", dosagem: "2mg", estoque: 20, fornecedor: "PharmaVet" },
      { id: 4, nome: "Vermífugo", tipo: "Antiparasitário", dosagem: "10ml", estoque: 15, fornecedor: "VetSupply" },
    ];
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMedicamento, setCurrentMedicamento] = useState({ 
    nome: "", 
    tipo: "", 
    dosagem: "", 
    estoque: "", 
    fornecedor: "" 
  });
  const [isEditing, setIsEditing] = useState(false);

  const filteredMedicamentos = medicamentos.filter(medicamento => 
    medicamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicamento.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicamento.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveMedicamento = () => {
    if (!currentMedicamento.nome || !currentMedicamento.tipo) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    let updatedMedicamentos;
    
    if (isEditing) {
      updatedMedicamentos = medicamentos.map(medicamento => 
        medicamento.id === currentMedicamento.id ? currentMedicamento : medicamento
      );
      toast({
        title: "Medicamento atualizado",
        description: `${currentMedicamento.nome} foi atualizado com sucesso.`
      });
    } else {
      const newMedicamento = {
        ...currentMedicamento,
        id: Date.now(),
        estoque: currentMedicamento.estoque || 0
      };
      updatedMedicamentos = [...medicamentos, newMedicamento];
      toast({
        title: "Medicamento adicionado",
        description: `${newMedicamento.nome} foi adicionado com sucesso.`
      });
    }
    
    setMedicamentos(updatedMedicamentos);
    localStorage.setItem("medicamentos", JSON.stringify(updatedMedicamentos));
    setIsDialogOpen(false);
    setCurrentMedicamento({ nome: "", tipo: "", dosagem: "", estoque: "", fornecedor: "" });
    setIsEditing(false);
  };

  const handleEditMedicamento = (medicamento) => {
    setCurrentMedicamento(medicamento);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteMedicamento = (id) => {
    const medicamentoToDelete = medicamentos.find(medicamento => medicamento.id === id);
    const updatedMedicamentos = medicamentos.filter(medicamento => medicamento.id !== id);
    setMedicamentos(updatedMedicamentos);
    localStorage.setItem("medicamentos", JSON.stringify(updatedMedicamentos));
    
    toast({
      title: "Medicamento removido",
      description: `${medicamentoToDelete.nome} foi removido com sucesso.`
    });
  };

  const getEstoqueStatus = (quantidade) => {
    if (quantidade <= 10) return "bg-red-100 text-red-800 border-red-200";
    if (quantidade <= 20) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
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
            setCurrentMedicamento({ nome: "", tipo: "", dosagem: "", estoque: "", fornecedor: "" });
            setIsEditing(false);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Novo Medicamento
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-lg border shadow-sm overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="hidden md:table-cell">Dosagem</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="hidden lg:table-cell">Fornecedor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicamentos.length > 0 ? (
              filteredMedicamentos.map((medicamento) => (
                <TableRow key={medicamento.id}>
                  <TableCell className="font-medium">{medicamento.nome}</TableCell>
                  <TableCell>{medicamento.tipo}</TableCell>
                  <TableCell className="hidden md:table-cell">{medicamento.dosagem}</TableCell>
                  <TableCell>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${getEstoqueStatus(medicamento.estoque)}`}>
                      {medicamento.estoque} unid.
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{medicamento.fornecedor}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditMedicamento(medicamento)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteMedicamento(medicamento.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhum medicamento encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Medicamento" : "Adicionar Novo Medicamento"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome*</Label>
                <Input
                  id="nome"
                  value={currentMedicamento.nome}
                  onChange={(e) => setCurrentMedicamento({ ...currentMedicamento, nome: e.target.value })}
                  placeholder="Nome do medicamento"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo*</Label>
                  <Select
                    value={currentMedicamento.tipo}
                    onValueChange={(value) => setCurrentMedicamento({ ...currentMedicamento, tipo: value })}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Antibiótico">Antibiótico</SelectItem>
                      <SelectItem value="Analgésico">Analgésico</SelectItem>
                      <SelectItem value="Anti-inflamatório">Anti-inflamatório</SelectItem>
                      <SelectItem value="Antiparasitário">Antiparasitário</SelectItem>
                      <SelectItem value="Vacina">Vacina</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dosagem">Dosagem</Label>
                  <Input
                    id="dosagem"
                    value={currentMedicamento.dosagem}
                    onChange={(e) => setCurrentMedicamento({ ...currentMedicamento, dosagem: e.target.value })}
                    placeholder="Ex: 250mg, 10ml"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estoque">Estoque</Label>
                  <Input
                    id="estoque"
                    type="number"
                    min="0"
                    value={currentMedicamento.estoque}
                    onChange={(e) => setCurrentMedicamento({ ...currentMedicamento, estoque: e.target.value })}
                    placeholder="Quantidade em estoque"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fornecedor">Fornecedor</Label>
                  <Input
                    id="fornecedor"
                    value={currentMedicamento.fornecedor}
                    onChange={(e) => setCurrentMedicamento({ ...currentMedicamento, fornecedor: e.target.value })}
                    placeholder="Nome do fornecedor"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveMedicamento}>{isEditing ? "Atualizar" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Medicamentos;
