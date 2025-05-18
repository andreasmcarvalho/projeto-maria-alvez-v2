import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { generateId, validateRequiredFields, formatDateToInput, formatDateToDisplay, handlePrint } from "@/lib/utils";

const initialInternacaoState = {
  animal: "",
  especie: "",
  raca: "",
  motivo_internacao: "",
  data_entrada: formatDateToInput(new Date().toISOString()),
  data_saida: "",
  status_recuperacao: "Em tratamento",
  observacoes: ""
};

const Internacoes = () => {
  const { toast } = useToast();
  const [internacoes, setInternacoes] = useState(() => {
    const savedData = localStorage.getItem("internacoes_data");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [pets, setPets] = useState(() => {
    const savedPets = localStorage.getItem("pets");
    return savedPets ? JSON.parse(savedPets) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentInternacao, setCurrentInternacao] = useState(initialInternacaoState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("internacoes_data", JSON.stringify(internacoes));
  }, [internacoes]);

  const filteredInternacoes = internacoes.filter(i =>
    i.animal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.motivo_internacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.status_recuperacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const required = ["animal", "especie", "raca", "motivo_internacao", "data_entrada", "status_recuperacao"];
    const errors = validateRequiredFields(currentInternacao, required);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({ title: "Erro de Validação", description: "Corrija os campos.", variant: "destructive" });
      return;
    }
    let updatedInternacoes;
    if (isEditing) {
      updatedInternacoes = internacoes.map(i => i.id_internacao === currentInternacao.id_internacao ? currentInternacao : i);
      toast({ title: "Internação atualizada", description: `Internação de ${currentInternacao.animal} atualizada.` });
    } else {
      const newInternacao = { ...currentInternacao, id_internacao: generateId() };
      updatedInternacoes = [...internacoes, newInternacao];
      toast({ title: "Internação registrada", description: `Internação de ${newInternacao.animal} registrada.` });
    }
    setInternacoes(updatedInternacoes);
    setIsDialogOpen(false);
    setCurrentInternacao(initialInternacaoState);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEdit = (internacao) => {
    setCurrentInternacao({
      ...internacao,
      data_entrada: formatDateToInput(internacao.data_entrada),
      data_saida: internacao.data_saida ? formatDateToInput(internacao.data_saida) : ""
    });
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id_internacao) => {
    const toDelete = internacoes.find(i => i.id_internacao === id_internacao);
    setInternacoes(internacoes.filter(i => i.id_internacao !== id_internacao));
    toast({ title: "Internação removida", description: `Internação de ${toDelete.animal} removida.` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentInternacao(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setCurrentInternacao(prev => ({ ...prev, [name]: value }));
     if (name === "animal") {
      const selectedPet = pets.find(p => p.nome === value);
      if (selectedPet) {
        setCurrentInternacao(prev => ({ 
          ...prev, 
          especie: selectedPet.especie, 
          raca: selectedPet.raca,
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por animal, motivo ou status..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-[400px]" />
        </div>
        <Button onClick={() => { setCurrentInternacao({...initialInternacaoState, data_entrada: formatDateToInput(new Date().toISOString())}); setIsEditing(false); setIsDialogOpen(true); setFormErrors({}); }}>
          <Plus className="h-4 w-4 mr-2" /> Nova Internação
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Animal</TableHead>
              <TableHead className="hidden md:table-cell">Motivo</TableHead>
              <TableHead>Data Entrada</TableHead>
              <TableHead className="hidden lg:table-cell">Data Saída</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInternacoes.length > 0 ? (
              filteredInternacoes.map((internacao) => (
                <TableRow key={internacao.id_internacao}>
                  <TableCell className="font-medium">{internacao.animal}</TableCell>
                  <TableCell className="hidden md:table-cell truncate max-w-xs">{internacao.motivo_internacao}</TableCell>
                  <TableCell>{formatDateToDisplay(internacao.data_entrada)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{internacao.data_saida ? formatDateToDisplay(internacao.data_saida) : "N/A"}</TableCell>
                  <TableCell>{internacao.status_recuperacao}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handlePrint()}><Printer className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(internacao)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(internacao.id_internacao)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Nenhuma internação registrada</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Internação" : "Registrar Nova Internação"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
             <div className="space-y-1">
                <Label htmlFor="animal">Animal*</Label>
                <Select value={currentInternacao.animal} onValueChange={(value) => handleSelectChange("animal", value)}>
                  <SelectTrigger id="animal" className={formErrors.animal ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map(pet => <SelectItem key={pet.id} value={pet.nome}>{pet.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formErrors.animal && <p className="text-xs text-red-500">{formErrors.animal}</p>}
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="especie">Espécie*</Label>
                <Input id="especie" name="especie" value={currentInternacao.especie} readOnly disabled className={formErrors.especie ? "border-red-500" : ""} />
                {formErrors.especie && <p className="text-xs text-red-500">{formErrors.especie}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="raca">Raça*</Label>
                <Input id="raca" name="raca" value={currentInternacao.raca} readOnly disabled className={formErrors.raca ? "border-red-500" : ""} />
                {formErrors.raca && <p className="text-xs text-red-500">{formErrors.raca}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="motivo_internacao">Motivo da Internação*</Label>
              <Textarea id="motivo_internacao" name="motivo_internacao" value={currentInternacao.motivo_internacao} onChange={handleInputChange} className={formErrors.motivo_internacao ? "border-red-500" : ""} />
              {formErrors.motivo_internacao && <p className="text-xs text-red-500">{formErrors.motivo_internacao}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="data_entrada">Data de Entrada*</Label>
                <Input id="data_entrada" name="data_entrada" type="date" value={currentInternacao.data_entrada} onChange={handleInputChange} className={formErrors.data_entrada ? "border-red-500" : ""} />
                {formErrors.data_entrada && <p className="text-xs text-red-500">{formErrors.data_entrada}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="data_saida">Data de Saída</Label>
                <Input id="data_saida" name="data_saida" type="date" value={currentInternacao.data_saida} onChange={handleInputChange} />
              </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="status_recuperacao">Status da Recuperação*</Label>
                <Select value={currentInternacao.status_recuperacao} onValueChange={(value) => handleSelectChange("status_recuperacao", value)}>
                  <SelectTrigger id="status_recuperacao" className={formErrors.status_recuperacao ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Em tratamento">Em tratamento</SelectItem>
                    <SelectItem value="Estável">Estável</SelectItem>
                    <SelectItem value="Melhora progressiva">Melhora progressiva</SelectItem>
                    <SelectItem value="Crítico">Crítico</SelectItem>
                    <SelectItem value="Alta médica">Alta médica</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.status_recuperacao && <p className="text-xs text-red-500">{formErrors.status_recuperacao}</p>}
              </div>
            <div className="space-y-1">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" name="observacoes" value={currentInternacao.observacoes} onChange={handleInputChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{isEditing ? "Atualizar" : "Registrar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Internacoes;