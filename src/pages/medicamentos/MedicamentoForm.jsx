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
import { Textarea } from "@/components/ui/textarea"; 

const MedicamentoForm = ({ 
  isOpen, 
  onOpenChange, 
  isEditing, 
  medicamentoData, 
  onInputChange, 
  onSave,
  formErrors
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Medicamento" : "Adicionar Novo Medicamento"}</DialogTitle>
          <DialogDescription>Preencha os campos abaixo para {isEditing ? "editar o" : "adicionar um novo"} medicamento.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="nome">Nome*</Label>
              <Input id="nome" name="nome" value={medicamentoData.nome} onChange={onInputChange} placeholder="Nome do medicamento" className={formErrors.nome ? "border-red-500" : ""} />
              {formErrors.nome && <p className="text-xs text-red-500">{formErrors.nome}</p>}
            </div>
             <div className="space-y-1">
              <Label htmlFor="quantidade">Quantidade (embalagem)*</Label>
              <Input id="quantidade" name="quantidade" value={medicamentoData.quantidade} onChange={onInputChange} placeholder="Ex: 10 comprimidos, 100ml" className={formErrors.quantidade ? "border-red-500" : ""} />
              {formErrors.quantidade && <p className="text-xs text-red-500">{formErrors.quantidade}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" name="descricao" value={medicamentoData.descricao} onChange={onInputChange} placeholder="Descrição detalhada do medicamento" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="principio_ativo">Princípio Ativo*</Label>
              <Input id="principio_ativo" name="principio_ativo" value={medicamentoData.principio_ativo} onChange={onInputChange} placeholder="Princípio ativo" className={formErrors.principio_ativo ? "border-red-500" : ""} />
              {formErrors.principio_ativo && <p className="text-xs text-red-500">{formErrors.principio_ativo}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="indicacao">Indicação*</Label>
              <Input id="indicacao" name="indicacao" value={medicamentoData.indicacao} onChange={onInputChange} placeholder="Indicação de uso" className={formErrors.indicacao ? "border-red-500" : ""} />
              {formErrors.indicacao && <p className="text-xs text-red-500">{formErrors.indicacao}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="contraindicacoes">Contraindicações</Label>
            <Textarea id="contraindicacoes" name="contraindicacoes" value={medicamentoData.contraindicacoes} onChange={onInputChange} placeholder="Contraindicações" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="dose">Dose*</Label>
              <Input id="dose" name="dose" value={medicamentoData.dose} onChange={onInputChange} placeholder="Ex: 1 comprimido, 5ml" className={formErrors.dose ? "border-red-500" : ""} />
              {formErrors.dose && <p className="text-xs text-red-500">{formErrors.dose}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="administracao">Administração*</Label>
              <Input id="administracao" name="administracao" value={medicamentoData.administracao} onChange={onInputChange} placeholder="Ex: Oral, Injetável" className={formErrors.administracao ? "border-red-500" : ""} />
              {formErrors.administracao && <p className="text-xs text-red-500">{formErrors.administracao}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="fabricante">Fabricante*</Label>
              <Input id="fabricante" name="fabricante" value={medicamentoData.fabricante} onChange={onInputChange} placeholder="Nome do fabricante" className={formErrors.fabricante ? "border-red-500" : ""} />
              {formErrors.fabricante && <p className="text-xs text-red-500">{formErrors.fabricante}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="estoque">Estoque (unidades)*</Label>
              <Input id="estoque" name="estoque" type="number" min="0" value={medicamentoData.estoque} onChange={onInputChange} placeholder="Quantidade em estoque" className={formErrors.estoque ? "border-red-500" : ""} />
              {formErrors.estoque && <p className="text-xs text-red-500">{formErrors.estoque}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="preco">Preço (R$)*</Label>
              <Input id="preco" name="preco" type="number" step="0.01" min="0" value={medicamentoData.preco} onChange={onInputChange} placeholder="0.00" className={formErrors.preco ? "border-red-500" : ""} />
              {formErrors.preco && <p className="text-xs text-red-500">{formErrors.preco}</p>}
            </div>
             <div className="space-y-1">
              <Label htmlFor="validade">Validade*</Label>
              <Input id="validade" name="validade" type="date" value={medicamentoData.validade} onChange={onInputChange} className={formErrors.validade ? "border-red-500" : ""} />
              {formErrors.validade && <p className="text-xs text-red-500">{formErrors.validade}</p>}
            </div>
          </div>
           <div className="space-y-1">
              <Label htmlFor="data_registro">Data de Registro*</Label>
              <Input id="data_registro" name="data_registro" type="date" value={medicamentoData.data_registro} onChange={onInputChange} className={formErrors.data_registro ? "border-red-500" : ""} />
              {formErrors.data_registro && <p className="text-xs text-red-500">{formErrors.data_registro}</p>}
            </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSave}>{isEditing ? "Atualizar" : "Adicionar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicamentoForm;