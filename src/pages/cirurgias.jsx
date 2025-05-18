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

const initialCirurgiaState = {
  animal: "",
  especie: "",
  raca: "",
  tutor: "",
  tipo_cirurgia: "",
  veterinario_responsavel: "", 
  data_cirurgia: formatDateToInput(new Date().toISOString()),
  observacoes: "",
  pos_cirurgicas: ""
};

const Cirurgias = () => {
  const { toast } = useToast();
  const [cirurgias, setCirurgias] = useState(() => {
    const savedData = localStorage.getItem("cirurgias_data");
    return savedData ? JSON.parse(savedData) : [];
  });
   const [pets, setPets] = useState(() => {
    const savedPets = localStorage.getItem("pets");
    return savedPets ? JSON.parse(savedPets) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCirurgia, setCurrentCirurgia] = useState(initialCirurgiaState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("cirurgias_data", JSON.stringify(cirurgias));
  }, [cirurgias]);

  const filteredCirurgias = cirurgias.filter(c =>
    c.animal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tipo_cirurgia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const required = ["animal", "especie", "raca", "tutor", "tipo_cirurgia", "veterinario_responsavel", "data_cirurgia"];
    const errors = validateRequiredFields(currentCirurgia, required);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({ title: "Erro de Validação", description: "Corrija os campos.", variant: "destructive" });
      return;
    }
    let updatedCirurgias;
    if (isEditing) {
      updatedCirurgias = cirurgias.map(c => c.id_cirurgia === currentCirurgia.id_cirurgia ? currentCirurgia : c);
      toast({ title: "Cirurgia atualizada", description: `Cirurgia de ${currentCirurgia.animal} atualizada.` });
    } else {
      const newCirurgia = { ...currentCirurgia, id_cirurgia: generateId() };
      updatedCirurgias = [...cirurgias, newCirurgia];
      toast({ title: "Cirurgia agendada", description: `Cirurgia para ${newCirurgia.animal} agendada.` });
    }
    setCirurgias(updatedCirurgias);
    setIsDialogOpen(false);
    setCurrentCirurgia(initialCirurgiaState);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEdit = (cirurgia) => {
    setCurrentCirurgia({
      ...cirurgia,
      data_cirurgia: formatDateToInput(cirurgia.data_cirurgia)
    });
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id_cirurgia) => {
    const toDelete = cirurgias.find(c => c.id_cirurgia === id_cirurgia);
    setCirurgias(cirurgias.filter(c => c.id_cirurgia !== id_cirurgia));
    toast({ title: "Cirurgia removida", description: `Cirurgia de ${toDelete.animal} removida.` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCirurgia(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setCurrentCirurgia(prev => ({ ...prev, [name]: value }));
    if (name === "animal") {
      const selectedPet = pets.find(p => p.nome === value);
      if (selectedPet) {
        setCurrentCirurgia(prev => ({ 
          ...prev, 
          especie: selectedPet.especie, 
          raca: selectedPet.raca,
          tutor: selectedPet.tutor 
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por animal, tutor ou tipo de cirurgia..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-[400px]" />
        </div>
        <Button onClick={() => { setCurrentCirurgia({...initialCirurgiaState, data_cirurgia: formatDateToInput(new Date().toISOString())}); setIsEditing(false); setIsDialogOpen(true); setFormErrors({}); }}>
          <Plus className="h-4 w-4 mr-2" /> Nova Cirurgia
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Animal</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead className="hidden md:table-cell">Tipo de Cirurgia</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCirurgias.length > 0 ? (
              filteredCirurgias.map((cirurgia) => (
                <TableRow key={cirurgia.id_cirurgia}>
                  <TableCell className="font-medium">{cirurgia.animal}</TableCell>
                  <TableCell>{cirurgia.tutor}</TableCell>
                  <TableCell className="hidden md:table-cell">{cirurgia.tipo_cirurgia}</TableCell>
                  <TableCell>{formatDateToDisplay(cirurgia.data_cirurgia)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handlePrint()}><Printer className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(cirurgia)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cirurgia.id_cirurgia)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Nenhuma cirurgia agendada</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Cirurgia" : "Agendar Nova Cirurgia"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
             <div className="space-y-1">
                <Label htmlFor="animal">Animal*</Label>
                <Select value={currentCirurgia.animal} onValueChange={(value) => handleSelectChange("animal", value)}>
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
                <Input id="especie" name="especie" value={currentCirurgia.especie} readOnly disabled className={formErrors.especie ? "border-red-500" : ""} />
                 {formErrors.especie && <p className="text-xs text-red-500">{formErrors.especie}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="raca">Raça*</Label>
                <Input id="raca" name="raca" value={currentCirurgia.raca} readOnly disabled className={formErrors.raca ? "border-red-500" : ""} />
                 {formErrors.raca && <p className="text-xs text-red-500">{formErrors.raca}</p>}
              </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="tutor">Tutor*</Label>
                <Input id="tutor" name="tutor" value={currentCirurgia.tutor} readOnly disabled className={formErrors.tutor ? "border-red-500" : ""} />
                 {formErrors.tutor && <p className="text-xs text-red-500">{formErrors.tutor}</p>}
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="tipo_cirurgia">Tipo de Cirurgia*</Label>
                <Input id="tipo_cirurgia" name="tipo_cirurgia" value={currentCirurgia.tipo_cirurgia} onChange={handleInputChange} className={formErrors.tipo_cirurgia ? "border-red-500" : ""} />
                {formErrors.tipo_cirurgia && <p className="text-xs text-red-500">{formErrors.tipo_cirurgia}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="veterinario_responsavel">Veterinário Responsável*</Label>
                <Input id="veterinario_responsavel" name="veterinario_responsavel" value={currentCirurgia.veterinario_responsavel} onChange={handleInputChange} className={formErrors.veterinario_responsavel ? "border-red-500" : ""} />
                {formErrors.veterinario_responsavel && <p className="text-xs text-red-500">{formErrors.veterinario_responsavel}</p>}
              </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="data_cirurgia">Data da Cirurgia*</Label>
                <Input id="data_cirurgia" name="data_cirurgia" type="date" value={currentCirurgia.data_cirurgia} onChange={handleInputChange} className={formErrors.data_cirurgia ? "border-red-500" : ""} />
                {formErrors.data_cirurgia && <p className="text-xs text-red-500">{formErrors.data_cirurgia}</p>}
              </div>
            <div className="space-y-1">
              <Label htmlFor="observacoes">Observações Pré-Cirúrgicas</Label>
              <Textarea id="observacoes" name="observacoes" value={currentCirurgia.observacoes} onChange={handleInputChange} />
            </div>
             <div className="space-y-1">
              <Label htmlFor="pos_cirurgicas">Recomendações Pós-Cirúrgicas</Label>
              <Textarea id="pos_cirurgicas" name="pos_cirurgicas" value={currentCirurgia.pos_cirurgicas} onChange={handleInputChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{isEditing ? "Atualizar" : "Agendar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cirurgias;