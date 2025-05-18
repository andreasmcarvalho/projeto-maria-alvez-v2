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

const initialExameState = {
  nome: "",
  descricao: "",
  tipo: "",
  especie: "",
  preco: "",
  equipamento: "",
  duracao: "",
  recomendacoes_pre: "",
  data_registro: formatDateToInput(new Date().toISOString())
};

const Exames = () => {
  const { toast } = useToast();
  const [exames, setExames] = useState(() => {
    const savedData = localStorage.getItem("exames_data");
    return savedData ? JSON.parse(savedData) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExame, setCurrentExame] = useState(initialExameState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("exames_data", JSON.stringify(exames));
  }, [exames]);

  const filteredExames = exames.filter(e =>
    e.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.especie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const required = ["nome", "tipo", "especie", "preco", "data_registro"];
    const errors = validateRequiredFields(currentExame, required);
    if (currentExame.preco && isNaN(parseFloat(currentExame.preco))) {
      errors.preco = "Preço deve ser um número.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({ title: "Erro de Validação", description: "Corrija os campos.", variant: "destructive" });
      return;
    }
    let updatedExames;
    if (isEditing) {
      updatedExames = exames.map(e => e.id_exame === currentExame.id_exame ? currentExame : e);
      toast({ title: "Exame atualizado", description: `${currentExame.nome} atualizado.` });
    } else {
      const newExame = { ...currentExame, id_exame: generateId() };
      updatedExames = [...exames, newExame];
      toast({ title: "Exame adicionado", description: `${newExame.nome} adicionado.` });
    }
    setExames(updatedExames);
    setIsDialogOpen(false);
    setCurrentExame(initialExameState);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEdit = (exame) => {
    setCurrentExame({
      ...exame,
      data_registro: formatDateToInput(exame.data_registro)
    });
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id_exame) => {
    const toDelete = exames.find(e => e.id_exame === id_exame);
    setExames(exames.filter(e => e.id_exame !== id_exame));
    toast({ title: "Exame removido", description: `${toDelete.nome} removido.` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentExame(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setCurrentExame(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar exames..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-[300px]" />
        </div>
        <Button onClick={() => { setCurrentExame({...initialExameState, data_registro: formatDateToInput(new Date().toISOString())}); setIsEditing(false); setIsDialogOpen(true); setFormErrors({}); }}>
          <Plus className="h-4 w-4 mr-2" /> Novo Exame
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="hidden md:table-cell">Espécie</TableHead>
              <TableHead className="hidden lg:table-cell">Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExames.length > 0 ? (
              filteredExames.map((exame) => (
                <TableRow key={exame.id_exame}>
                  <TableCell className="font-medium">{exame.nome}</TableCell>
                  <TableCell>{exame.tipo}</TableCell>
                  <TableCell className="hidden md:table-cell">{exame.especie}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatCurrency(exame.preco)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(exame)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(exame.id_exame)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Nenhum exame encontrado</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Exame" : "Adicionar Novo Exame"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1">
              <Label htmlFor="nome">Nome*</Label>
              <Input id="nome" name="nome" value={currentExame.nome} onChange={handleInputChange} className={formErrors.nome ? "border-red-500" : ""} />
              {formErrors.nome && <p className="text-xs text-red-500">{formErrors.nome}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" name="descricao" value={currentExame.descricao} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="tipo">Tipo de Exame*</Label>
                <Input id="tipo" name="tipo" value={currentExame.tipo} onChange={handleInputChange} placeholder="Ex: Sangue, Urina, Imagem" className={formErrors.tipo ? "border-red-500" : ""} />
                {formErrors.tipo && <p className="text-xs text-red-500">{formErrors.tipo}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="especie">Espécie Alvo*</Label>
                 <Select value={currentExame.especie} onValueChange={(value) => handleSelectChange("especie", value)}>
                  <SelectTrigger id="especie" className={formErrors.especie ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Canina">Canina</SelectItem>
                    <SelectItem value="Felina">Felina</SelectItem>
                    <SelectItem value="Equina">Equina</SelectItem>
                    <SelectItem value="Bovina">Bovina</SelectItem>
                    <SelectItem value="Aves">Aves</SelectItem>
                    <SelectItem value="Outra">Outra</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.especie && <p className="text-xs text-red-500">{formErrors.especie}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="preco">Preço (R$)*</Label>
                <Input id="preco" name="preco" type="number" step="0.01" min="0" value={currentExame.preco} onChange={handleInputChange} className={formErrors.preco ? "border-red-500" : ""} />
                {formErrors.preco && <p className="text-xs text-red-500">{formErrors.preco}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="equipamento">Equipamento Utilizado</Label>
                <Input id="equipamento" name="equipamento" value={currentExame.equipamento} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="duracao">Duração Estimada (minutos)</Label>
              <Input id="duracao" name="duracao" type="number" min="0" value={currentExame.duracao} onChange={handleInputChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="recomendacoes_pre">Recomendações Pré-Exame</Label>
              <Textarea id="recomendacoes_pre" name="recomendacoes_pre" value={currentExame.recomendacoes_pre} onChange={handleInputChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="data_registro">Data de Registro*</Label>
              <Input id="data_registro" name="data_registro" type="date" value={currentExame.data_registro} onChange={handleInputChange} className={formErrors.data_registro ? "border-red-500" : ""} />
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

export default Exames;