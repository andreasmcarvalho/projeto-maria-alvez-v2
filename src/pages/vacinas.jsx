import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { generateId, validateRequiredFields, formatDateToInput, formatDateToDisplay, formatCurrency } from "@/lib/utils";

const initialVacinaState = {
  nome: "",
  descricao: "",
  especie: "",
  dose: "",
  intervalo: "",
  fabricante: "",
  lote: "",
  validade: "",
  custo: "",
  recomendacoes: "",
  data_registro: formatDateToInput(new Date().toISOString())
};

const Vacinas = () => {
  const { toast } = useToast();
  const [vacinas, setVacinas] = useState(() => {
    const savedData = localStorage.getItem("vacinas_data");
    return savedData ? JSON.parse(savedData) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentVacina, setCurrentVacina] = useState(initialVacinaState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("vacinas_data", JSON.stringify(vacinas));
  }, [vacinas]);

  const filteredVacinas = vacinas.filter(v =>
    v.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.fabricante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const required = ["nome", "especie", "dose", "fabricante", "lote", "validade", "custo", "data_registro"];
    const errors = validateRequiredFields(currentVacina, required);
    if (currentVacina.custo && isNaN(parseFloat(currentVacina.custo))) {
      errors.custo = "Custo deve ser um número.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({ title: "Erro de Validação", description: "Corrija os campos.", variant: "destructive" });
      return;
    }
    let updatedVacinas;
    if (isEditing) {
      updatedVacinas = vacinas.map(v => v.id_vacina === currentVacina.id_vacina ? currentVacina : v);
      toast({ title: "Vacina atualizada", description: `${currentVacina.nome} atualizada.` });
    } else {
      const newVacina = { ...currentVacina, id_vacina: generateId() };
      updatedVacinas = [...vacinas, newVacina];
      toast({ title: "Vacina adicionada", description: `${newVacina.nome} adicionada.` });
    }
    setVacinas(updatedVacinas);
    setIsDialogOpen(false);
    setCurrentVacina(initialVacinaState);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEdit = (vacina) => {
    setCurrentVacina({
      ...vacina, 
      validade: formatDateToInput(vacina.validade),
      data_registro: formatDateToInput(vacina.data_registro)
    });
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id_vacina) => {
    const toDelete = vacinas.find(v => v.id_vacina === id_vacina);
    setVacinas(vacinas.filter(v => v.id_vacina !== id_vacina));
    toast({ title: "Vacina removida", description: `${toDelete.nome} removida.` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVacina(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setCurrentVacina(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar vacinas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-[300px]" />
        </div>
        <Button onClick={() => { setCurrentVacina({...initialVacinaState, data_registro: formatDateToInput(new Date().toISOString())}); setIsEditing(false); setIsDialogOpen(true); setFormErrors({}); }}>
          <Plus className="h-4 w-4 mr-2" /> Nova Vacina
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Espécie</TableHead>
              <TableHead className="hidden md:table-cell">Fabricante</TableHead>
              <TableHead className="hidden lg:table-cell">Validade</TableHead>
              <TableHead className="hidden lg:table-cell">Custo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVacinas.length > 0 ? (
              filteredVacinas.map((vacina) => (
                <TableRow key={vacina.id_vacina}>
                  <TableCell className="font-medium">{vacina.nome}</TableCell>
                  <TableCell>{vacina.especie}</TableCell>
                  <TableCell className="hidden md:table-cell">{vacina.fabricante}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatDateToDisplay(vacina.validade)}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatCurrency(vacina.custo)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(vacina)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(vacina.id_vacina)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Nenhuma vacina encontrada</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Vacina" : "Adicionar Nova Vacina"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="nome">Nome*</Label>
                <Input id="nome" name="nome" value={currentVacina.nome} onChange={handleInputChange} className={formErrors.nome ? "border-red-500" : ""} />
                {formErrors.nome && <p className="text-xs text-red-500">{formErrors.nome}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="especie">Espécie Alvo*</Label>
                <Select value={currentVacina.especie} onValueChange={(value) => handleSelectChange("especie", value)}>
                  <SelectTrigger id="especie" className={formErrors.especie ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Canina">Canina</SelectItem>
                    <SelectItem value="Felina">Felina</SelectItem>
                    <SelectItem value="Equina">Equina</SelectItem>
                    <SelectItem value="Bovina">Bovina</SelectItem>
                    <SelectItem value="Outra">Outra</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.especie && <p className="text-xs text-red-500">{formErrors.especie}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" name="descricao" value={currentVacina.descricao} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="dose">Dose*</Label>
                <Input id="dose" name="dose" value={currentVacina.dose} onChange={handleInputChange} placeholder="Ex: 1ml, 1 comprimido" className={formErrors.dose ? "border-red-500" : ""} />
                {formErrors.dose && <p className="text-xs text-red-500">{formErrors.dose}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="intervalo">Intervalo (dias)</Label>
                <Input id="intervalo" name="intervalo" type="number" min="0" value={currentVacina.intervalo} onChange={handleInputChange} placeholder="Ex: 21" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="fabricante">Fabricante*</Label>
                <Input id="fabricante" name="fabricante" value={currentVacina.fabricante} onChange={handleInputChange} className={formErrors.fabricante ? "border-red-500" : ""} />
                {formErrors.fabricante && <p className="text-xs text-red-500">{formErrors.fabricante}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="lote">Lote*</Label>
                <Input id="lote" name="lote" value={currentVacina.lote} onChange={handleInputChange} className={formErrors.lote ? "border-red-500" : ""} />
                {formErrors.lote && <p className="text-xs text-red-500">{formErrors.lote}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="validade">Validade*</Label>
                <Input id="validade" name="validade" type="date" value={currentVacina.validade} onChange={handleInputChange} className={formErrors.validade ? "border-red-500" : ""} />
                {formErrors.validade && <p className="text-xs text-red-500">{formErrors.validade}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="custo">Custo (R$)*</Label>
                <Input id="custo" name="custo" type="number" step="0.01" min="0" value={currentVacina.custo} onChange={handleInputChange} className={formErrors.custo ? "border-red-500" : ""} />
                {formErrors.custo && <p className="text-xs text-red-500">{formErrors.custo}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="recomendacoes">Recomendações</Label>
              <Textarea id="recomendacoes" name="recomendacoes" value={currentVacina.recomendacoes} onChange={handleInputChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="data_registro">Data de Registro*</Label>
              <Input id="data_registro" name="data_registro" type="date" value={currentVacina.data_registro} onChange={handleInputChange} className={formErrors.data_registro ? "border-red-500" : ""} />
              {formErrors.data_registro && <p className="text-xs text-red-500">{formErrors.data_registro}</p>}
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

export default Vacinas;