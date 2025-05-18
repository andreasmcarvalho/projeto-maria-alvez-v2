import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { generateId, validateRequiredFields, formatDateToInput, formatDateToDisplay } from "@/lib/utils";

const initialAnimalCastracaoState = {
  nome_animal: "",
  posicao_fila: "",
  especie: "",
  raca: "",
  sexo: "",
  idade: "",
  tutor: "",
  status_castracao: "Aguardando",
  data_prevista_castracao: ""
};

const AnimalCastracao = () => {
  const { toast } = useToast();
  const [animais, setAnimais] = useState(() => {
    const savedData = localStorage.getItem("animal_castracao_data");
    return savedData ? JSON.parse(savedData) : [];
  });
   const [pets, setPetsData] = useState(() => { // Renomeado para evitar conflito
    const savedPets = localStorage.getItem("pets");
    return savedPets ? JSON.parse(savedPets) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState(initialAnimalCastracaoState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("animal_castracao_data", JSON.stringify(animais));
  }, [animais]);

  const filteredAnimais = animais.filter(a =>
    a.nome_animal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.status_castracao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const required = ["nome_animal", "especie", "raca", "sexo", "idade", "tutor", "status_castracao"];
    const errors = validateRequiredFields(currentAnimal, required);
    if (currentAnimal.idade && isNaN(parseInt(currentAnimal.idade))) {
        errors.idade = "Idade deve ser um número."
    }
    if (currentAnimal.posicao_fila && isNaN(parseInt(currentAnimal.posicao_fila))) {
        errors.posicao_fila = "Posição na fila deve ser um número."
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({ title: "Erro de Validação", description: "Corrija os campos.", variant: "destructive" });
      return;
    }
    let updatedAnimais;
    if (isEditing) {
      updatedAnimais = animais.map(a => a.id_castracao === currentAnimal.id_castracao ? currentAnimal : a);
      toast({ title: "Registro atualizado", description: `Registro de ${currentAnimal.nome_animal} atualizado.` });
    } else {
      const newAnimal = { ...currentAnimal, id_castracao: generateId() };
      updatedAnimais = [...animais, newAnimal];
      toast({ title: "Animal adicionado à fila", description: `${newAnimal.nome_animal} adicionado.` });
    }
    setAnimais(updatedAnimais);
    setIsDialogOpen(false);
    setCurrentAnimal(initialAnimalCastracaoState);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEdit = (animal) => {
    setCurrentAnimal({
        ...animal,
        data_prevista_castracao: animal.data_prevista_castracao ? formatDateToInput(animal.data_prevista_castracao) : ""
    });
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id_castracao) => {
    const toDelete = animais.find(a => a.id_castracao === id_castracao);
    setAnimais(animais.filter(a => a.id_castracao !== id_castracao));
    toast({ title: "Registro removido", description: `Registro de ${toDelete.nome_animal} removido da fila.` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAnimal(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setCurrentAnimal(prev => ({ ...prev, [name]: value }));
     if (name === "nome_animal") {
      const selectedPet = pets.find(p => p.nome === value);
      if (selectedPet) {
        setCurrentAnimal(prev => ({ 
          ...prev, 
          especie: selectedPet.especie, 
          raca: selectedPet.raca,
          sexo: selectedPet.sexo,
          idade: selectedPet.idade.toString(),
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
          <Input placeholder="Buscar por animal, tutor ou status..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-[350px]" />
        </div>
        <Button onClick={() => { setCurrentAnimal(initialAnimalCastracaoState); setIsEditing(false); setIsDialogOpen(true); setFormErrors({}); }}>
          <Plus className="h-4 w-4 mr-2" /> Adicionar Animal à Fila
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Animal</TableHead>
              <TableHead className="hidden md:table-cell">Tutor</TableHead>
              <TableHead>Posição na Fila</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Data Prevista</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnimais.length > 0 ? (
              filteredAnimais.map((animal) => (
                <TableRow key={animal.id_castracao}>
                  <TableCell className="font-medium">{animal.nome_animal}</TableCell>
                  <TableCell className="hidden md:table-cell">{animal.tutor}</TableCell>
                  <TableCell>{animal.posicao_fila || "N/A"}</TableCell>
                  <TableCell>{animal.status_castracao}</TableCell>
                  <TableCell className="hidden lg:table-cell">{animal.data_prevista_castracao ? formatDateToDisplay(animal.data_prevista_castracao) : "A definir"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(animal)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(animal.id_castracao)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Nenhum animal na fila de castração</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Registro de Castração" : "Adicionar Animal à Fila de Castração"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <Label htmlFor="nome_animal">Nome do Animal*</Label>
                     <Select value={currentAnimal.nome_animal} onValueChange={(value) => handleSelectChange("nome_animal", value)}>
                        <SelectTrigger id="nome_animal" className={formErrors.nome_animal ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione o animal" />
                        </SelectTrigger>
                        <SelectContent>
                            {pets.map(pet => <SelectItem key={pet.id} value={pet.nome}>{pet.nome}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {formErrors.nome_animal && <p className="text-xs text-red-500">{formErrors.nome_animal}</p>}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="posicao_fila">Posição na Fila</Label>
                    <Input id="posicao_fila" name="posicao_fila" type="number" min="1" value={currentAnimal.posicao_fila} onChange={handleInputChange} className={formErrors.posicao_fila ? "border-red-500" : ""} />
                    {formErrors.posicao_fila && <p className="text-xs text-red-500">{formErrors.posicao_fila}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label htmlFor="especie">Espécie*</Label>
                    <Input id="especie" name="especie" value={currentAnimal.especie} onChange={handleInputChange} readOnly disabled className={formErrors.especie ? "border-red-500" : ""} />
                    {formErrors.especie && <p className="text-xs text-red-500">{formErrors.especie}</p>}
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="raca">Raça*</Label>
                    <Input id="raca" name="raca" value={currentAnimal.raca} onChange={handleInputChange} readOnly disabled className={formErrors.raca ? "border-red-500" : ""} />
                    {formErrors.raca && <p className="text-xs text-red-500">{formErrors.raca}</p>}
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label htmlFor="sexo">Sexo*</Label>
                    <Input id="sexo" name="sexo" value={currentAnimal.sexo} onChange={handleInputChange} readOnly disabled className={formErrors.sexo ? "border-red-500" : ""} />
                    {formErrors.sexo && <p className="text-xs text-red-500">{formErrors.sexo}</p>}
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="idade">Idade (anos)*</Label>
                    <Input id="idade" name="idade" type="number" min="0" value={currentAnimal.idade} onChange={handleInputChange} readOnly disabled className={formErrors.idade ? "border-red-500" : ""} />
                    {formErrors.idade && <p className="text-xs text-red-500">{formErrors.idade}</p>}
                </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="tutor">Tutor*</Label>
                <Input id="tutor" name="tutor" value={currentAnimal.tutor} onChange={handleInputChange} readOnly disabled className={formErrors.tutor ? "border-red-500" : ""} />
                {formErrors.tutor && <p className="text-xs text-red-500">{formErrors.tutor}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <Label htmlFor="status_castracao">Status da Castração*</Label>
                    <Select value={currentAnimal.status_castracao} onValueChange={(value) => handleSelectChange("status_castracao", value)}>
                        <SelectTrigger id="status_castracao" className={formErrors.status_castracao ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Aguardando">Aguardando</SelectItem>
                            <SelectItem value="Agendado">Agendado</SelectItem>
                            <SelectItem value="Realizado">Realizado</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                    </Select>
                    {formErrors.status_castracao && <p className="text-xs text-red-500">{formErrors.status_castracao}</p>}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="data_prevista_castracao">Data Prevista</Label>
                    <Input id="data_prevista_castracao" name="data_prevista_castracao" type="date" value={currentAnimal.data_prevista_castracao} onChange={handleInputChange} />
                </div>
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

export default AnimalCastracao;