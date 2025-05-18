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
import { generateId, validateRequiredFields, formatDateToInput, formatDateToDisplay, formatCurrency, handlePrint } from "@/lib/utils";

const initialConsultaClinicaState = {
  motivo_atendimento: "",
  valor_consulta: "",
  valor_medicamentos: "",
  observacoes: "",
  tutor: "",
  data_hora: formatDateToInput(new Date().toISOString()), 
  hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
};

const ConsultaClinica = () => {
  const { toast } = useToast();
  const [consultas, setConsultas] = useState(() => {
    const savedData = localStorage.getItem("consultas_clinicas_data");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [tutores, setTutores] = useState(() => {
    const savedTutores = localStorage.getItem("tutores_v2");
    return savedTutores ? JSON.parse(savedTutores) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentConsulta, setCurrentConsulta] = useState(initialConsultaClinicaState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("consultas_clinicas_data", JSON.stringify(consultas));
  }, [consultas]);

  const filteredConsultas = consultas.filter(c =>
    c.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.motivo_atendimento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const required = ["motivo_atendimento", "valor_consulta", "tutor", "data_hora", "hora"];
    const errors = validateRequiredFields(currentConsulta, required);
    if (currentConsulta.valor_consulta && isNaN(parseFloat(currentConsulta.valor_consulta))) {
      errors.valor_consulta = "Valor da consulta deve ser um número.";
    }
     if (currentConsulta.valor_medicamentos && currentConsulta.valor_medicamentos !== "" && isNaN(parseFloat(currentConsulta.valor_medicamentos))) {
      errors.valor_medicamentos = "Valor dos medicamentos deve ser um número ou vazio.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({ title: "Erro de Validação", description: "Corrija os campos.", variant: "destructive" });
      return;
    }
    let updatedConsultas;
    if (isEditing) {
      updatedConsultas = consultas.map(c => c.id_consulta === currentConsulta.id_consulta ? currentConsulta : c);
      toast({ title: "Consulta Clínica atualizada", description: `Consulta de ${currentConsulta.tutor} atualizada.` });
    } else {
      const newConsulta = { ...currentConsulta, id_consulta: generateId() };
      updatedConsultas = [...consultas, newConsulta];
      toast({ title: "Consulta Clínica registrada", description: `Consulta para ${newConsulta.tutor} registrada.` });
    }
    setConsultas(updatedConsultas);
    setIsDialogOpen(false);
    setCurrentConsulta(initialConsultaClinicaState);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEdit = (consulta) => {
    setCurrentConsulta({
      ...consulta,
      data_hora: formatDateToInput(consulta.data_hora)
    });
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id_consulta) => {
    const toDelete = consultas.find(c => c.id_consulta === id_consulta);
    setConsultas(consultas.filter(c => c.id_consulta !== id_consulta));
    toast({ title: "Consulta Clínica removida", description: `Consulta de ${toDelete.tutor} removida.` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentConsulta(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setCurrentConsulta(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por tutor ou motivo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-[350px]" />
        </div>
        <Button onClick={() => { setCurrentConsulta({...initialConsultaClinicaState, data_hora: formatDateToInput(new Date().toISOString()), hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }); setIsEditing(false); setIsDialogOpen(true); setFormErrors({}); }}>
          <Plus className="h-4 w-4 mr-2" /> Nova Consulta Clínica
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tutor</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead className="hidden md:table-cell">Data/Hora</TableHead>
              <TableHead className="hidden lg:table-cell">Valor Total</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConsultas.length > 0 ? (
              filteredConsultas.map((consulta) => (
                <TableRow key={consulta.id_consulta}>
                  <TableCell className="font-medium">{consulta.tutor}</TableCell>
                  <TableCell className="truncate max-w-xs">{consulta.motivo_atendimento}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDateToDisplay(consulta.data_hora)} {consulta.hora}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatCurrency(parseFloat(consulta.valor_consulta) + parseFloat(consulta.valor_medicamentos || 0))}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handlePrint()}><Printer className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(consulta)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(consulta.id_consulta)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Nenhuma consulta clínica registrada</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Consulta Clínica" : "Registrar Nova Consulta Clínica"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1">
                <Label htmlFor="tutor">Tutor*</Label>
                 <Select value={currentConsulta.tutor} onValueChange={(value) => handleSelectChange("tutor", value)}>
                  <SelectTrigger id="tutor" className={formErrors.tutor ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione o tutor" />
                  </SelectTrigger>
                  <SelectContent>
                    {tutores.map(tutor => <SelectItem key={tutor.id_tutor} value={`${tutor.nome} ${tutor.sobrenome}`}>{`${tutor.nome} ${tutor.sobrenome}`}</SelectItem>)}
                  </SelectContent>
                </Select>
                {formErrors.tutor && <p className="text-xs text-red-500">{formErrors.tutor}</p>}
              </div>
            <div className="space-y-1">
              <Label htmlFor="motivo_atendimento">Motivo do Atendimento*</Label>
              <Textarea id="motivo_atendimento" name="motivo_atendimento" value={currentConsulta.motivo_atendimento} onChange={handleInputChange} className={formErrors.motivo_atendimento ? "border-red-500" : ""} />
              {formErrors.motivo_atendimento && <p className="text-xs text-red-500">{formErrors.motivo_atendimento}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="valor_consulta">Valor da Consulta (R$)*</Label>
                <Input id="valor_consulta" name="valor_consulta" type="number" step="0.01" min="0" value={currentConsulta.valor_consulta} onChange={handleInputChange} className={formErrors.valor_consulta ? "border-red-500" : ""} />
                {formErrors.valor_consulta && <p className="text-xs text-red-500">{formErrors.valor_consulta}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="valor_medicamentos">Valor dos Medicamentos (R$)</Label>
                <Input id="valor_medicamentos" name="valor_medicamentos" type="number" step="0.01" min="0" value={currentConsulta.valor_medicamentos} onChange={handleInputChange} className={formErrors.valor_medicamentos ? "border-red-500" : ""} />
                 {formErrors.valor_medicamentos && <p className="text-xs text-red-500">{formErrors.valor_medicamentos}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="data_hora">Data*</Label>
                <Input id="data_hora" name="data_hora" type="date" value={currentConsulta.data_hora} onChange={handleInputChange} className={formErrors.data_hora ? "border-red-500" : ""} />
                {formErrors.data_hora && <p className="text-xs text-red-500">{formErrors.data_hora}</p>}
              </div>
               <div className="space-y-1">
                <Label htmlFor="hora">Hora*</Label>
                <Input id="hora" name="hora" type="time" value={currentConsulta.hora} onChange={handleInputChange} className={formErrors.hora ? "border-red-500" : ""} />
                {formErrors.hora && <p className="text-xs text-red-500">{formErrors.hora}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" name="observacoes" value={currentConsulta.observacoes} onChange={handleInputChange} />
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

export default ConsultaClinica;