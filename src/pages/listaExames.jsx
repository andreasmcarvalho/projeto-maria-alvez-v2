import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { generateId, validateRequiredFields, handlePrint } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialListaExamesState = {
  nome_lista: "",
  exames_ids: [] 
};

const ListaExames = () => {
  const { toast } = useToast();
  const [listasExames, setListasExames] = useState(() => {
    const savedData = localStorage.getItem("listas_exames_data");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [examesVeterinarios, setExamesVeterinarios] = useState(() => {
    const savedData = localStorage.getItem("exames_veterinarios_data");
    return savedData ? JSON.parse(savedData) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentListaExames, setCurrentListaExames] = useState(initialListaExamesState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedExamesForModal, setSelectedExamesForModal] = useState([]);

  useEffect(() => {
    localStorage.setItem("listas_exames_data", JSON.stringify(listasExames));
  }, [listasExames]);

  const filteredListasExames = listasExames.filter(l =>
    l.nome_lista.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const required = ["nome_lista"];
    let errors = validateRequiredFields(currentListaExames, required);
     if (selectedExamesForModal.length === 0) {
      errors.exames = "Selecione ao menos um exame para a lista.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({ title: "Erro de Validação", description: "Corrija os campos.", variant: "destructive" });
      return;
    }
    let updatedListasExames;
    const listaDataToSave = { ...currentListaExames, exames_ids: selectedExamesForModal };

    if (isEditing) {
      updatedListasExames = listasExames.map(l => l.id_lista_exames === listaDataToSave.id_lista_exames ? listaDataToSave : l);
      toast({ title: "Lista de Exames atualizada", description: `Lista ${listaDataToSave.nome_lista} atualizada.` });
    } else {
      const newListaExames = { ...listaDataToSave, id_lista_exames: generateId() };
      updatedListasExames = [...listasExames, newListaExames];
      toast({ title: "Lista de Exames criada", description: `Lista ${newListaExames.nome_lista} criada.` });
    }
    setListasExames(updatedListasExames);
    setIsDialogOpen(false);
    setCurrentListaExames(initialListaExamesState);
    setSelectedExamesForModal([]);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEdit = (lista) => {
    setCurrentListaExames(lista);
    setSelectedExamesForModal(lista.exames_ids || []);
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id_lista_exames) => {
    const toDelete = listasExames.find(l => l.id_lista_exames === id_lista_exames);
    setListasExames(listasExames.filter(l => l.id_lista_exames !== id_lista_exames));
    toast({ title: "Lista de Exames removida", description: `Lista ${toDelete.nome_lista} removida.` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentListaExames(prev => ({ ...prev, [name]: value }));
  };

  const handleExameSelection = (exameId) => {
    setSelectedExamesForModal(prevSelected =>
      prevSelected.includes(exameId)
        ? prevSelected.filter(id => id !== exameId)
        : [...prevSelected, exameId]
    );
  };
  
  const getExameDescriptionById = (id) => {
    const exame = examesVeterinarios.find(e => e.id_exame_vet === id);
    return exame ? `${exame.animal} - ${exame.tipo_exame}` : "Exame não encontrado";
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome da lista..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-[350px]" />
        </div>
        <Button onClick={() => { setCurrentListaExames(initialListaExamesState); setSelectedExamesForModal([]); setIsEditing(false); setIsDialogOpen(true); setFormErrors({}); }}>
          <Plus className="h-4 w-4 mr-2" /> Nova Lista de Exames
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Lista</TableHead>
              <TableHead>Nº de Exames</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListasExames.length > 0 ? (
              filteredListasExames.map((lista) => (
                <TableRow key={lista.id_lista_exames}>
                  <TableCell className="font-medium">{lista.nome_lista}</TableCell>
                  <TableCell>{lista.exames_ids.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handlePrint()}><Printer className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(lista)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(lista.id_lista_exames)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">Nenhuma lista de exames encontrada</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Lista de Exames" : "Criar Nova Lista de Exames"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1">
              <Label htmlFor="nome_lista">Nome da Lista*</Label>
              <Input id="nome_lista" name="nome_lista" value={currentListaExames.nome_lista} onChange={handleInputChange} className={formErrors.nome_lista ? "border-red-500" : ""} />
              {formErrors.nome_lista && <p className="text-xs text-red-500">{formErrors.nome_lista}</p>}
            </div>
            <div className="space-y-1">
                <Label>Exames Veterinários Cadastrados*</Label>
                <ScrollArea className="h-40 rounded-md border p-2">
                    {examesVeterinarios.length > 0 ? examesVeterinarios.map(exame => (
                        <div key={exame.id_exame_vet} className="flex items-center space-x-2 py-1">
                            <Checkbox
                                id={`exame-${exame.id_exame_vet}`}
                                checked={selectedExamesForModal.includes(exame.id_exame_vet)}
                                onCheckedChange={() => handleExameSelection(exame.id_exame_vet)}
                            />
                            <Label htmlFor={`exame-${exame.id_exame_vet}`} className="font-normal">
                                {exame.animal} - {exame.tipo_exame} (Tutor: {exame.tutor})
                            </Label>
                        </div>
                    )) : <p className="text-sm text-muted-foreground p-2">Nenhum exame veterinário cadastrado.</p>}
                </ScrollArea>
                {formErrors.exames && <p className="text-xs text-red-500">{formErrors.exames}</p>}
            </div>
             {selectedExamesForModal.length > 0 && (
                <div className="space-y-1">
                    <Label>Exames Selecionados ({selectedExamesForModal.length})</Label>
                    <div className="rounded-md border p-2 text-sm text-muted-foreground">
                        {selectedExamesForModal.map(id => getExameDescriptionById(id)).join(", ")}
                    </div>
                </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsDialogOpen(false); setSelectedExamesForModal([]);}}>Cancelar</Button>
            <Button onClick={handleSave}>{isEditing ? "Atualizar Lista" : "Criar Lista"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListaExames;