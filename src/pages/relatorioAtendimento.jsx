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

const initialRelatorioState = {
  data_atendimento: formatDateToInput(new Date().toISOString()),
  hora_atendimento: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  tipo_atendimento: "",
  vet_responsavel: "",
  diagnostico_inicial: "",
  observacoes: "",
  animal: "",
  especie: "",
  raca: "",
  idade: "",
  sexo: "",
  peso: "",
  tutor: "",
  telefone_contato: "",
  procedimento: "",
  medicamentos: "",
  dosagem: "",
  frequencia: "",
  orientacoes_tutor: "",
  data_retorno: ""
};

const RelatorioAtendimento = () => {
  const { toast } = useToast();
  const [relatorios, setRelatorios] = useState(() => {
    const savedData = localStorage.getItem("relatorios_atendimento_data");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [pets, setPets] = useState(() => {
    const savedPets = localStorage.getItem("pets");
    return savedPets ? JSON.parse(savedPets) : [];
  });
   const [tutores, setTutoresData] = useState(() => {
    const savedTutores = localStorage.getItem("tutores_v2");
    return savedTutores ? JSON.parse(savedTutores) : [];
  });


  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRelatorio, setCurrentRelatorio] = useState(initialRelatorioState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("relatorios_atendimento_data", JSON.stringify(relatorios));
  }, [relatorios]);

  const filteredRelatorios = relatorios.filter(r =>
    r.animal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.tipo_atendimento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const required = [
      "data_atendimento", "hora_atendimento", "tipo_atendimento", "vet_responsavel", 
      "animal", "especie", "raca", "idade", "sexo", "peso", "tutor", "telefone_contato",
      "procedimento"
    ];
    const errors = validateRequiredFields(currentRelatorio, required);
    if (currentRelatorio.idade && isNaN(parseInt(currentRelatorio.idade))) {
      errors.idade = "Idade deve ser um número.";
    }
    if (currentRelatorio.peso && isNaN(parseFloat(currentRelatorio.peso))) {
      errors.peso = "Peso deve ser um número.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({ title: "Erro de Validação", description: "Corrija os campos.", variant: "destructive" });
      return;
    }
    let updatedRelatorios;
    if (isEditing) {
      updatedRelatorios = relatorios.map(r => r.id_relatorio === currentRelatorio.id_relatorio ? currentRelatorio : r);
      toast({ title: "Relatório atualizado", description: `Relatório de ${currentRelatorio.animal} atualizado.` });
    } else {
      const newRelatorio = { ...currentRelatorio, id_relatorio: generateId() };
      updatedRelatorios = [...relatorios, newRelatorio];
      toast({ title: "Relatório criado", description: `Relatório para ${newRelatorio.animal} criado.` });
    }
    setRelatorios(updatedRelatorios);
    setIsDialogOpen(false);
    setCurrentRelatorio(initialRelatorioState);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEdit = (relatorio) => {
    setCurrentRelatorio({
      ...relatorio,
      data_atendimento: formatDateToInput(relatorio.data_atendimento),
      data_retorno: relatorio.data_retorno ? formatDateToInput(relatorio.data_retorno) : ""
    });
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id_relatorio) => {
    const toDelete = relatorios.find(r => r.id_relatorio === id_relatorio);
    setRelatorios(relatorios.filter(r => r.id_relatorio !== id_relatorio));
    toast({ title: "Relatório removido", description: `Relatório de ${toDelete.animal} removido.` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRelatorio(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setCurrentRelatorio(prev => ({ ...prev, [name]: value }));
     if (name === "animal") {
      const selectedPet = pets.find(p => p.nome === value);
      if (selectedPet) {
        const tutorPet = tutores.find(t => t.nome === selectedPet.tutor || `${t.nome} ${t.sobrenome}` === selectedPet.tutor);
        setCurrentRelatorio(prev => ({ 
          ...prev, 
          especie: selectedPet.especie, 
          raca: selectedPet.raca,
          idade: selectedPet.idade.toString(),
          sexo: selectedPet.sexo,
          tutor: selectedPet.tutor,
          telefone_contato: tutorPet ? tutorPet.telefone : ""
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por animal, tutor ou tipo de atendimento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-[400px]" />
        </div>
        <Button onClick={() => { setCurrentRelatorio({...initialRelatorioState, data_atendimento: formatDateToInput(new Date().toISOString()), hora_atendimento: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }); setIsEditing(false); setIsDialogOpen(true); setFormErrors({}); }}>
          <Plus className="h-4 w-4 mr-2" /> Novo Relatório
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Animal</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead className="hidden md:table-cell">Tipo Atendimento</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRelatorios.length > 0 ? (
              filteredRelatorios.map((relatorio) => (
                <TableRow key={relatorio.id_relatorio}>
                  <TableCell className="font-medium">{relatorio.animal}</TableCell>
                  <TableCell>{relatorio.tutor}</TableCell>
                  <TableCell className="hidden md:table-cell">{relatorio.tipo_atendimento}</TableCell>
                  <TableCell>{formatDateToDisplay(relatorio.data_atendimento)} {relatorio.hora_atendimento}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handlePrint()}><Printer className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(relatorio)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(relatorio.id_relatorio)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Nenhum relatório encontrado</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Relatório de Atendimento" : "Criar Novo Relatório de Atendimento"}</DialogTitle>
            <DialogDescription>Preencha todos os campos obrigatórios (*).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="data_atendimento">Data Atendimento*</Label>
                <Input id="data_atendimento" name="data_atendimento" type="date" value={currentRelatorio.data_atendimento} onChange={handleInputChange} className={formErrors.data_atendimento ? "border-red-500" : ""} />
                {formErrors.data_atendimento && <p className="text-xs text-red-500">{formErrors.data_atendimento}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="hora_atendimento">Hora Atendimento*</Label>
                <Input id="hora_atendimento" name="hora_atendimento" type="time" value={currentRelatorio.hora_atendimento} onChange={handleInputChange} className={formErrors.hora_atendimento ? "border-red-500" : ""} />
                {formErrors.hora_atendimento && <p className="text-xs text-red-500">{formErrors.hora_atendimento}</p>}
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label htmlFor="tipo_atendimento">Tipo Atendimento*</Label>
                    <Input id="tipo_atendimento" name="tipo_atendimento" value={currentRelatorio.tipo_atendimento} onChange={handleInputChange} placeholder="Ex: Consulta, Vacinação, Emergência" className={formErrors.tipo_atendimento ? "border-red-500" : ""} />
                    {formErrors.tipo_atendimento && <p className="text-xs text-red-500">{formErrors.tipo_atendimento}</p>}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="vet_responsavel">Veterinário Responsável*</Label>
                    <Input id="vet_responsavel" name="vet_responsavel" value={currentRelatorio.vet_responsavel} onChange={handleInputChange} className={formErrors.vet_responsavel ? "border-red-500" : ""} />
                    {formErrors.vet_responsavel && <p className="text-xs text-red-500">{formErrors.vet_responsavel}</p>}
                </div>
            </div>
            <div className="space-y-1">
                <Label htmlFor="animal">Animal*</Label>
                 <Select value={currentRelatorio.animal} onValueChange={(value) => handleSelectChange("animal", value)}>
                  <SelectTrigger id="animal" className={formErrors.animal ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map(pet => <SelectItem key={pet.id} value={pet.nome}>{pet.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formErrors.animal && <p className="text-xs text-red-500">{formErrors.animal}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                 <div className="space-y-1">
                    <Label htmlFor="especie">Espécie*</Label>
                    <Input id="especie" name="especie" value={currentRelatorio.especie} readOnly disabled className={formErrors.especie ? "border-red-500" : ""} />
                    {formErrors.especie && <p className="text-xs text-red-500">{formErrors.especie}</p>}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="raca">Raça*</Label>
                    <Input id="raca" name="raca" value={currentRelatorio.raca} readOnly disabled className={formErrors.raca ? "border-red-500" : ""} />
                    {formErrors.raca && <p className="text-xs text-red-500">{formErrors.raca}</p>}
                </div>
                <div className="space-y-1">
                    <Label htmlFor="sexo">Sexo*</Label>
                    <Input id="sexo" name="sexo" value={currentRelatorio.sexo} readOnly disabled className={formErrors.sexo ? "border-red-500" : ""} />
                    {formErrors.sexo && <p className="text-xs text-red-500">{formErrors.sexo}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label htmlFor="idade">Idade (anos)*</Label>
                    <Input id="idade" name="idade" type="number" min="0" value={currentRelatorio.idade} readOnly disabled className={formErrors.idade ? "border-red-500" : ""} />
                    {formErrors.idade && <p className="text-xs text-red-500">{formErrors.idade}</p>}
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="peso">Peso (kg)*</Label>
                    <Input id="peso" name="peso" type="number" step="0.01" min="0" value={currentRelatorio.peso} onChange={handleInputChange} className={formErrors.peso ? "border-red-500" : ""} />
                    {formErrors.peso && <p className="text-xs text-red-500">{formErrors.peso}</p>}
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <Label htmlFor="tutor">Tutor*</Label>
                    <Input id="tutor" name="tutor" value={currentRelatorio.tutor} readOnly disabled className={formErrors.tutor ? "border-red-500" : ""} />
                    {formErrors.tutor && <p className="text-xs text-red-500">{formErrors.tutor}</p>}
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="telefone_contato">Telefone Contato*</Label>
                    <Input id="telefone_contato" name="telefone_contato" value={currentRelatorio.telefone_contato} readOnly disabled className={formErrors.telefone_contato ? "border-red-500" : ""} />
                    {formErrors.telefone_contato && <p className="text-xs text-red-500">{formErrors.telefone_contato}</p>}
                </div>
            </div>
            <div className="space-y-1">
                <Label htmlFor="diagnostico_inicial">Diagnóstico Inicial</Label>
                <Textarea id="diagnostico_inicial" name="diagnostico_inicial" value={currentRelatorio.diagnostico_inicial} onChange={handleInputChange} />
            </div>
             <div className="space-y-1">
                <Label htmlFor="procedimento">Procedimento Realizado*</Label>
                <Textarea id="procedimento" name="procedimento" value={currentRelatorio.procedimento} onChange={handleInputChange} className={formErrors.procedimento ? "border-red-500" : ""} />
                 {formErrors.procedimento && <p className="text-xs text-red-500">{formErrors.procedimento}</p>}
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                    <Label htmlFor="medicamentos">Medicamentos</Label>
                    <Input id="medicamentos" name="medicamentos" value={currentRelatorio.medicamentos} onChange={handleInputChange} placeholder="Nome do medicamento" />
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="dosagem">Dosagem</Label>
                    <Input id="dosagem" name="dosagem" value={currentRelatorio.dosagem} onChange={handleInputChange} placeholder="Ex: 1ml, 1cp" />
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="frequencia">Frequência</Label>
                    <Input id="frequencia" name="frequencia" value={currentRelatorio.frequencia} onChange={handleInputChange} placeholder="Ex: SID, BID" />
                </div>
            </div>
             <div className="space-y-1">
                <Label htmlFor="orientacoes_tutor">Orientações ao Tutor</Label>
                <Textarea id="orientacoes_tutor" name="orientacoes_tutor" value={currentRelatorio.orientacoes_tutor} onChange={handleInputChange} />
            </div>
             <div className="space-y-1">
                <Label htmlFor="data_retorno">Data de Retorno</Label>
                <Input id="data_retorno" name="data_retorno" type="date" value={currentRelatorio.data_retorno} onChange={handleInputChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="observacoes">Observações Gerais</Label>
              <Textarea id="observacoes" name="observacoes" value={currentRelatorio.observacoes} onChange={handleInputChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{isEditing ? "Atualizar" : "Criar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RelatorioAtendimento;