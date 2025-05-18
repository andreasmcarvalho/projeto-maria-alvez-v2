import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Printer, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { generateId, validateRequiredFields, handlePrint } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialListaState = {
  nome_lista: "",
  animais_ids: [] 
};

const ListaCastracao = () => {
  const { toast } = useToast();
  const [listas, setListas] = useState(() => {
    const savedData = localStorage.getItem("listas_castracao_data");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [animaisCastracao, setAnimaisCastracao] = useState(() => {
    const savedData = localStorage.getItem("animal_castracao_data");
    return savedData ? JSON.parse(savedData) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLista, setCurrentLista] = useState(initialListaState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedAnimalsForModal, setSelectedAnimalsForModal] = useState([]);

  useEffect(() => {
    localStorage.setItem("listas_castracao_data", JSON.stringify(listas));
  }, [listas]);

  const filteredListas = listas.filter(l =>
    l.nome_lista.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const required = ["nome_lista"];
    let errors = validateRequiredFields(currentLista, required);
     if (selectedAnimalsForModal.length === 0) {
      errors.animais = "Selecione ao menos um animal para a lista.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({ title: "Erro de Validação", description: "Corrija os campos.", variant: "destructive" });
      return;
    }
    let updatedListas;
    const listaDataToSave = { ...currentLista, animais_ids: selectedAnimalsForModal };

    if (isEditing) {
      updatedListas = listas.map(l => l.id_lista === listaDataToSave.id_lista ? listaDataToSave : l);
      toast({ title: "Lista atualizada", description: `Lista ${listaDataToSave.nome_lista} atualizada.` });
    } else {
      const newLista = { ...listaDataToSave, id_lista: generateId() };
      updatedListas = [...listas, newLista];
      toast({ title: "Lista criada", description: `Lista ${newLista.nome_lista} criada.` });
    }
    setListas(updatedListas);
    setIsDialogOpen(false);
    setCurrentLista(initialListaState);
    setSelectedAnimalsForModal([]);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEdit = (lista) => {
    setCurrentLista(lista);
    setSelectedAnimalsForModal(lista.animais_ids || []);
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id_lista) => {
    const toDelete = listas.find(l => l.id_lista === id_lista);
    setListas(listas.filter(l => l.id_lista !== id_lista));
    toast({ title: "Lista removida", description: `Lista ${toDelete.nome_lista} removida.` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLista(prev => ({ ...prev, [name]: value }));
  };

  const handleAnimalSelection = (animalId) => {
    setSelectedAnimalsForModal(prevSelected =>
      prevSelected.includes(animalId)
        ? prevSelected.filter(id => id !== animalId)
        : [...prevSelected, animalId]
    );
  };
  
  const getAnimalNameById = (id) => {
    const animal = animaisCastracao.find(a => a.id_castracao === id);
    return animal ? animal.nome_animal : "Animal não encontrado";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome da lista..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-[350px]" />
        </div>
        <Button onClick={() => { setCurrentLista(initialListaState); setSelectedAnimalsForModal([]); setIsEditing(false); setIsDialogOpen(true); setFormErrors({}); }}>
          <Plus className="h-4 w-4 mr-2" /> Nova Lista de Castração
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Lista</TableHead>
              <TableHead>Nº de Animais</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListas.length > 0 ? (
              filteredListas.map((lista) => (
                <TableRow key={lista.id_lista}>
                  <TableCell className="font-medium">{lista.nome_lista}</TableCell>
                  <TableCell>{lista.animais_ids.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handlePrint()}><Printer className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(lista)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(lista.id_lista)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">Nenhuma lista de castração encontrada</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Lista de Castração" : "Criar Nova Lista de Castração"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1">
              <Label htmlFor="nome_lista">Nome da Lista*</Label>
              <Input id="nome_lista" name="nome_lista" value={currentLista.nome_lista} onChange={handleInputChange} className={formErrors.nome_lista ? "border-red-500" : ""} />
              {formErrors.nome_lista && <p className="text-xs text-red-500">{formErrors.nome_lista}</p>}
            </div>
            <div className="space-y-1">
                <Label>Animais na Fila de Castração*</Label>
                <ScrollArea className="h-40 rounded-md border p-2">
                    {animaisCastracao.length > 0 ? animaisCastracao.map(animal => (
                        <div key={animal.id_castracao} className="flex items-center space-x-2 py-1">
                            <Checkbox
                                id={`animal-${animal.id_castracao}`}
                                checked={selectedAnimalsForModal.includes(animal.id_castracao)}
                                onCheckedChange={() => handleAnimalSelection(animal.id_castracao)}
                            />
                            <Label htmlFor={`animal-${animal.id_castracao}`} className="font-normal">
                                {animal.nome_animal} ({animal.tutor}) - Status: {animal.status_castracao}
                            </Label>
                        </div>
                    )) : <p className="text-sm text-muted-foreground p-2">Nenhum animal na fila de castração.</p>}
                </ScrollArea>
                 {formErrors.animais && <p className="text-xs text-red-500">{formErrors.animais}</p>}
            </div>
             {selectedAnimalsForModal.length > 0 && (
                <div className="space-y-1">
                    <Label>Animais Selecionados ({selectedAnimalsForModal.length})</Label>
                    <div className="rounded-md border p-2 text-sm text-muted-foreground">
                        {selectedAnimalsForModal.map(id => getAnimalNameById(id)).join(", ")}
                    </div>
                </div>
            )}

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsDialogOpen(false); setSelectedAnimalsForModal([]);}}>Cancelar</Button>
            <Button onClick={handleSave}>{isEditing ? "Atualizar Lista" : "Criar Lista"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListaCastracao;