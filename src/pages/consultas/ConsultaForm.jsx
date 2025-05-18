import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ConsultaForm = ({ 
  isOpen, 
  onOpenChange, 
  isEditing, 
  consultaData, 
  pets,
  onInputChange, 
  onSelectChange,
  onSave,
  formErrors
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Consulta" : "Agendar Nova Consulta"}</DialogTitle>
          <DialogDescription>Preencha os campos abaixo para {isEditing ? "editar a" : "agendar uma nova"} consulta.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <Label htmlFor="pet">Pet*</Label>
              <Select
                value={consultaData.pet}
                onValueChange={(value) => onSelectChange("pet", value)}
              >
                <SelectTrigger id="pet" className={formErrors.pet ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione um pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.nome}>
                      {pet.nome} ({pet.tutor})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.pet && <p className="text-xs text-red-500">{formErrors.pet}</p>}
            </div>

            {consultaData.pet && (
              <div className="space-y-1">
                <Label htmlFor="tutor">Tutor (Automático)</Label>
                <Input id="tutor" name="tutor" value={consultaData.tutor} readOnly disabled />
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="data">Data*</Label>
                <Input
                  id="data"
                  name="data"
                  type="date"
                  value={consultaData.data}
                  onChange={onInputChange}
                  className={formErrors.data ? "border-red-500" : ""}
                />
                {formErrors.data && <p className="text-xs text-red-500">{formErrors.data}</p>}
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="hora">Hora*</Label>
                <Input
                  id="hora"
                  name="hora"
                  type="time"
                  value={consultaData.hora}
                  onChange={onInputChange}
                  className={formErrors.hora ? "border-red-500" : ""}
                />
                {formErrors.hora && <p className="text-xs text-red-500">{formErrors.hora}</p>}
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="tipo">Tipo de Consulta*</Label>
              <Select
                value={consultaData.tipo}
                onValueChange={(value) => onSelectChange("tipo", value)}
              >
                <SelectTrigger id="tipo" className={formErrors.tipo ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consulta de rotina">Consulta de rotina</SelectItem>
                  <SelectItem value="Vacinação">Vacinação</SelectItem>
                  <SelectItem value="Exame de sangue">Exame de sangue</SelectItem>
                  <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                  <SelectItem value="Emergência">Emergência</SelectItem>
                  <SelectItem value="Retorno">Retorno</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.tipo && <p className="text-xs text-red-500">{formErrors.tipo}</p>}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="veterinario">Veterinário*</Label>
                <Select
                  value={consultaData.veterinario}
                  onValueChange={(value) => onSelectChange("veterinario", value)}
                >
                  <SelectTrigger id="veterinario" className={formErrors.veterinario ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Carlos Mendes">Dr. Carlos Mendes</SelectItem>
                    <SelectItem value="Dra. Ana Sousa">Dra. Ana Sousa</SelectItem>
                    <SelectItem value="Dr. Ricardo Lima">Dr. Ricardo Lima</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.veterinario && <p className="text-xs text-red-500">{formErrors.veterinario}</p>}
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="status">Status*</Label>
                <Select
                  value={consultaData.status}
                  onValueChange={(value) => onSelectChange("status", value)}
                >
                  <SelectTrigger id="status" className={formErrors.status ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.status && <p className="text-xs text-red-500">{formErrors.status}</p>}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSave}>{isEditing ? "Atualizar" : "Agendar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultaForm;