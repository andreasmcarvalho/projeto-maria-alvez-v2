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

const initialVacinaVermifugoState = {
  nome_animal: "",
  especie: "",
  tutor: "",
  tipo: "Vacina", 
  data_aplicacao: formatDateToInput(new Date().toISOString()),
  data_proximo_reforco: "",
  observacoes: ""
};

const VacinaVermifugos = () => {
  const { toast } = useToast();
  const [registros, setRegistros] = useState(() => {
    const savedData = localStorage.getItem("vacina_vermifugos_data");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [pets, setPets] = useState(() => {
    const savedPets = localStorage.getItem("pets");
    return savedPets ? JSON.parse(savedPets) : [];
  });
   const [tutores, setTutores] = useState(() => {
    const savedTutores = localStorage.getItem("tutores_v2");
    return savedTutores ? JSON.parse(savedTutores) : [];
  });


  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRegistro, setCurrentRegistro] = useState(initialVacinaVermifugoState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("vacina_vermifugos_data", JSON.stringify(registros));
  }, [registros]);

  const filteredRegistros = registros.filter(r =>
    r.nome_animal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const required = ["nome_animal", "especie", "tutor", "tipo", "data_aplicacao"];
    const errors = validateRequiredFields(currentRegistro, required);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({ title: "Erro de Validação", description: "Corrija os campos.", variant: "destructive" });
      return;
    }
    let updatedRegistros;
    if (isEditing) {
      updatedRegistros = registros.map(r => r.id_vacina_vermifugo === currentRegistro.id_vacina_vermifugo ? currentRegistro : r);
      toast({ title: "Registro atualizado", description: `Registro para ${currentRegistro.nome_animal} atualizado.` });
    } else {
      const newRegistro = { ...currentRegistro, id_vacina_vermifugo: generateId() };
      updatedRegistros = [...registros, newRegistro];
      toast({ title: "Registro adicionado", description: `Registro para ${newRegistro.nome_animal} adicionado.` });
    }
    setRegistros(updatedRegistros);
    setIsDialogOpen(false);
    setCurrentRegistro(initialVacinaVermifugoState);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEdit = (registro) => {
    setCurrentRegistro({
      ...registro,
      data_aplicacao: formatDateToInput(registro.data_aplicacao),
      data_proximo_reforco: registro.data_proximo_reforco ? formatDateToInput(registro.data_proximo_reforco) : ""
    });
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id_vacina_vermifugo) => {
    const toDelete = registros.find(r => r.id_vacina_vermifugo === id_vacina_vermifugo);
    setRegistros(registros.filter(r => r.id_vacina_vermifugo !== id_vacina_vermifugo));
    toast({ title: "Registro removido", description: `Registro para ${toDelete.nome_animal} removido.` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRegistro(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setCurrentRegistro(prev => ({ ...prev, [name]: value }));
    if (name === "nome_animal") {
      const selectedPet = pets.find(p => p.nome === value);
      if (selectedPet) {
        setCurrentRegistro(prev => ({ ...prev, especie: selectedPet.especie, tutor: selectedPet.tutor }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por animal, tutor ou tipo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-[350px]" />
        </div>
        <Button onClick={() => { setCurrentRegistro({...initialVacinaVermifugoState, data_aplicacao: formatDateToInput(new Date().toISOString())}); setIsEditing(false); setIsDialogOpen(true); setFormErrors({}); }}>
          <Plus className="h-4 w-4 mr-2" /> Novo Registro
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Animal</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead className="hidden md:table-cell">Tipo</TableHead>
              <TableHead>Data Aplicação</TableHead>
              <TableHead className="hidden lg:table-cell">Próximo Reforço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistros.length > 0 ? (
              filteredRegistros.map((registro) => (
                <TableRow key={registro.id_vacina_vermifugo}>
                  <TableCell className="font-medium">{registro.nome_animal}</TableCell>
                  <TableCell>{registro.tutor}</TableCell>
                  <TableCell className="hidden md:table-cell">{registro.tipo}</TableCell>
                  <TableCell>{formatDateToDisplay(registro.data_aplicacao)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{registro.data_proximo_reforco ? formatDateToDisplay(registro.data_proximo_reforco) : "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handlePrint()}><Printer className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(registro)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(registro.id_vacina_vermifugo)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Nenhum registro encontrado</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Registro" : "Adicionar Novo Registro"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="nome_animal">Nome do Animal*</Label>
                <Select value={currentRegistro.nome_animal} onValueChange={(value) => handleSelectChange("nome_animal", value)}>
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
                <Label htmlFor="especie">Espécie*</Label>
                <Input id="especie" name="especie" value={currentRegistro.especie} onChange={handleInputChange} readOnly disabled className={formErrors.especie ? "border-red-500" : ""} />
                 {formErrors.especie && <p className="text-xs text-red-500">{formErrors.especie}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="tutor">Tutor*</Label>
              <Input id="tutor" name="tutor" value={currentRegistro.tutor} onChange={handleInputChange} readOnly disabled className={formErrors.tutor ? "border-red-500" : ""} />
              {formErrors.tutor && <p className="text-xs text-red-500">{formErrors.tutor}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="tipo">Tipo*</Label>
                <Select value={currentRegistro.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                  <SelectTrigger id="tipo" className={formErrors.tipo ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vacina">Vacina</SelectItem>
                    <SelectItem value="Vermífugo">Vermífugo</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.tipo && <p className="text-xs text-red-500">{formErrors.tipo}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="data_aplicacao">Data de Aplicação*</Label>
                <Input id="data_aplicacao" name="data_aplicacao" type="date" value={currentRegistro.data_aplicacao} onChange={handleInputChange} className={formErrors.data_aplicacao ? "border-red-500" : ""} />
                {formErrors.data_aplicacao && <p className="text-xs text-red-500">{formErrors.data_aplicacao}</p>}
              </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="data_proximo_reforco">Data Próximo Reforço</Label>
                <Input id="data_proximo_reforco" name="data_proximo_reforco" type="date" value={currentRegistro.data_proximo_reforco} onChange={handleInputChange} />
              </div>
            <div className="space-y-1">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" name="observacoes" value={currentRegistro.observacoes} onChange={handleInputChange} />
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

export default VacinaVermifugos;