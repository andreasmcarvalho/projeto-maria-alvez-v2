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

const initialExameVetState = {
  animal: "",
  tutor: "",
  tipo_exame: "",
  data_exame: formatDateToInput(new Date().toISOString()),
  veterinario_solicitante: "",
  resultados: "",
  observacoes: ""
};

const ExameVeterinario = () => {
  const { toast } = useToast();
  const [examesVet, setExamesVet] = useState(() => {
    const savedData = localStorage.getItem("exames_veterinarios_data");
    return savedData ? JSON.parse(savedData) : [];
  });
   const [pets, setPets] = useState(() => {
    const savedPets = localStorage.getItem("pets");
    return savedPets ? JSON.parse(savedPets) : [];
  });
   const [examesBase, setExamesBase] = useState(() => {
    const savedData = localStorage.getItem("exames_data"); // cadastros de tipos de exame
    return savedData ? JSON.parse(savedData) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExameVet, setCurrentExameVet] = useState(initialExameVetState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("exames_veterinarios_data", JSON.stringify(examesVet));
  }, [examesVet]);

  const filteredExamesVet = examesVet.filter(ev =>
    ev.animal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.tipo_exame.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const required = ["animal", "tutor", "tipo_exame", "data_exame", "veterinario_solicitante", "resultados"];
    const errors = validateRequiredFields(currentExameVet, required);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({ title: "Erro de Validação", description: "Corrija os campos.", variant: "destructive" });
      return;
    }
    let updatedExamesVet;
    if (isEditing) {
      updatedExamesVet = examesVet.map(ev => ev.id_exame_vet === currentExameVet.id_exame_vet ? currentExameVet : ev);
      toast({ title: "Exame Veterinário atualizado", description: `Exame de ${currentExameVet.animal} atualizado.` });
    } else {
      const newExameVet = { ...currentExameVet, id_exame_vet: generateId() };
      updatedExamesVet = [...examesVet, newExameVet];
      toast({ title: "Exame Veterinário adicionado", description: `Exame de ${newExameVet.animal} adicionado.` });
    }
    setExamesVet(updatedExamesVet);
    setIsDialogOpen(false);
    setCurrentExameVet(initialExameVetState);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEdit = (exameVet) => {
    setCurrentExameVet({
      ...exameVet,
      data_exame: formatDateToInput(exameVet.data_exame)
    });
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id_exame_vet) => {
    const toDelete = examesVet.find(ev => ev.id_exame_vet === id_exame_vet);
    setExamesVet(examesVet.filter(ev => ev.id_exame_vet !== id_exame_vet));
    toast({ title: "Exame Veterinário removido", description: `Exame de ${toDelete.animal} removido.` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentExameVet(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setCurrentExameVet(prev => ({ ...prev, [name]: value }));
    if (name === "animal") {
      const selectedPet = pets.find(p => p.nome === value);
      if (selectedPet) {
        setCurrentExameVet(prev => ({ ...prev, tutor: selectedPet.tutor }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por animal, tutor ou tipo de exame..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-[400px]" />
        </div>
        <Button onClick={() => { setCurrentExameVet({...initialExameVetState, data_exame: formatDateToInput(new Date().toISOString())}); setIsEditing(false); setIsDialogOpen(true); setFormErrors({}); }}>
          <Plus className="h-4 w-4 mr-2" /> Novo Exame Veterinário
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Animal</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead className="hidden md:table-cell">Tipo de Exame</TableHead>
              <TableHead>Data do Exame</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExamesVet.length > 0 ? (
              filteredExamesVet.map((exameVet) => (
                <TableRow key={exameVet.id_exame_vet}>
                  <TableCell className="font-medium">{exameVet.animal}</TableCell>
                  <TableCell>{exameVet.tutor}</TableCell>
                  <TableCell className="hidden md:table-cell">{exameVet.tipo_exame}</TableCell>
                  <TableCell>{formatDateToDisplay(exameVet.data_exame)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handlePrint()}><Printer className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(exameVet)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(exameVet.id_exame_vet)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Nenhum exame veterinário encontrado</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Exame Veterinário" : "Adicionar Novo Exame Veterinário"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="animal">Animal*</Label>
                <Select value={currentExameVet.animal} onValueChange={(value) => handleSelectChange("animal", value)}>
                  <SelectTrigger id="animal" className={formErrors.animal ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map(pet => <SelectItem key={pet.id} value={pet.nome}>{pet.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formErrors.animal && <p className="text-xs text-red-500">{formErrors.animal}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="tutor">Tutor*</Label>
                <Input id="tutor" name="tutor" value={currentExameVet.tutor} onChange={handleInputChange} readOnly disabled className={formErrors.tutor ? "border-red-500" : ""} />
                 {formErrors.tutor && <p className="text-xs text-red-500">{formErrors.tutor}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="tipo_exame">Tipo de Exame*</Label>
                <Select value={currentExameVet.tipo_exame} onValueChange={(value) => handleSelectChange("tipo_exame", value)}>
                  <SelectTrigger id="tipo_exame" className={formErrors.tipo_exame ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o tipo de exame" />
                  </SelectTrigger>
                  <SelectContent>
                    {examesBase.map(exame => <SelectItem key={exame.id_exame} value={exame.nome}>{exame.nome}</SelectItem>)}
                     <SelectItem value="Outro">Outro (especificar)</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.tipo_exame && <p className="text-xs text-red-500">{formErrors.tipo_exame}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="data_exame">Data do Exame*</Label>
                <Input id="data_exame" name="data_exame" type="date" value={currentExameVet.data_exame} onChange={handleInputChange} className={formErrors.data_exame ? "border-red-500" : ""} />
                {formErrors.data_exame && <p className="text-xs text-red-500">{formErrors.data_exame}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="veterinario_solicitante">Veterinário Solicitante*</Label>
              <Input id="veterinario_solicitante" name="veterinario_solicitante" value={currentExameVet.veterinario_solicitante} onChange={handleInputChange} className={formErrors.veterinario_solicitante ? "border-red-500" : ""} />
              {formErrors.veterinario_solicitante && <p className="text-xs text-red-500">{formErrors.veterinario_solicitante}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="resultados">Resultados*</Label>
              <Textarea id="resultados" name="resultados" value={currentExameVet.resultados} onChange={handleInputChange} className={formErrors.resultados ? "border-red-500" : ""} />
              {formErrors.resultados && <p className="text-xs text-red-500">{formErrors.resultados}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" name="observacoes" value={currentExameVet.observacoes} onChange={handleInputChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{isEditing ? "Atualizar" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExameVeterinario;