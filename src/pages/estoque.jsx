import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { generateId, validateRequiredFields } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";


const initialEstoqueState = {
  nome_estoque: "",
  produtos_ids: [] 
};

const Estoque = () => {
  const { toast } = useToast();
  const [estoques, setEstoques] = useState(() => {
    const savedData = localStorage.getItem("estoques_data");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [produtosCadastrados, setProdutosCadastrados] = useState(() => {
    const savedData = localStorage.getItem("produtos_data"); // Vem da página de Produtos
    return savedData ? JSON.parse(savedData) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEstoque, setCurrentEstoque] = useState(initialEstoqueState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [selectedProdutosForModal, setSelectedProdutosForModal] = useState([]);


  useEffect(() => {
    localStorage.setItem("estoques_data", JSON.stringify(estoques));
  }, [estoques]);

  const filteredEstoques = estoques.filter(e =>
    e.nome_estoque.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const required = ["nome_estoque"];
    let errors = validateRequiredFields(currentEstoque, required);
     if (selectedProdutosForModal.length === 0) { // Validação para produtos
      errors.produtos = "Selecione ao menos um produto para o estoque.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({ title: "Erro de Validação", description: "Corrija os campos.", variant: "destructive" });
      return;
    }
    let updatedEstoques;
    const estoqueDataToSave = { ...currentEstoque, produtos_ids: selectedProdutosForModal };


    if (isEditing) {
      updatedEstoques = estoques.map(e => e.id_estoque === estoqueDataToSave.id_estoque ? estoqueDataToSave : e);
      toast({ title: "Estoque atualizado", description: `Estoque ${estoqueDataToSave.nome_estoque} atualizado.` });
    } else {
      const newEstoque = { ...estoqueDataToSave, id_estoque: generateId() };
      updatedEstoques = [...estoques, newEstoque];
      toast({ title: "Estoque criado", description: `Estoque ${newEstoque.nome_estoque} criado.` });
    }
    setEstoques(updatedEstoques);
    setIsDialogOpen(false);
    setCurrentEstoque(initialEstoqueState);
    setSelectedProdutosForModal([]);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEdit = (estoque) => {
    setCurrentEstoque(estoque);
    setSelectedProdutosForModal(estoque.produtos_ids || []);
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id_estoque) => {
    const toDelete = estoques.find(e => e.id_estoque === id_estoque);
    setEstoques(estoques.filter(e => e.id_estoque !== id_estoque));
    toast({ title: "Estoque removido", description: `Estoque ${toDelete.nome_estoque} removido.` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEstoque(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProdutoSelection = (produtoId) => {
    setSelectedProdutosForModal(prevSelected =>
      prevSelected.includes(produtoId)
        ? prevSelected.filter(id => id !== produtoId)
        : [...prevSelected, produtoId]
    );
  };

  const getProdutoNameById = (id) => {
    const produto = produtosCadastrados.find(p => p.id_produto === id);
    return produto ? produto.nome : "Produto não encontrado";
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome do estoque..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-[350px]" />
        </div>
        <Button onClick={() => { setCurrentEstoque(initialEstoqueState); setSelectedProdutosForModal([]); setIsEditing(false); setIsDialogOpen(true); setFormErrors({}); }}>
          <Plus className="h-4 w-4 mr-2" /> Novo Estoque
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Estoque</TableHead>
              <TableHead>Nº de Produtos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEstoques.length > 0 ? (
              filteredEstoques.map((estoque) => (
                <TableRow key={estoque.id_estoque}>
                  <TableCell className="font-medium">{estoque.nome_estoque}</TableCell>
                  <TableCell>{estoque.produtos_ids.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(estoque)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(estoque.id_estoque)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">Nenhum estoque encontrado</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Estoque" : "Criar Novo Estoque"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="space-y-1">
              <Label htmlFor="nome_estoque">Nome do Estoque*</Label>
              <Input id="nome_estoque" name="nome_estoque" value={currentEstoque.nome_estoque} onChange={handleInputChange} className={formErrors.nome_estoque ? "border-red-500" : ""} />
              {formErrors.nome_estoque && <p className="text-xs text-red-500">{formErrors.nome_estoque}</p>}
            </div>
             <div className="space-y-1">
                <Label>Produtos Cadastrados*</Label>
                <ScrollArea className="h-40 rounded-md border p-2">
                    {produtosCadastrados.length > 0 ? produtosCadastrados.map(produto => (
                        <div key={produto.id_produto} className="flex items-center space-x-2 py-1">
                            <Checkbox
                                id={`produto-${produto.id_produto}`}
                                checked={selectedProdutosForModal.includes(produto.id_produto)}
                                onCheckedChange={() => handleProdutoSelection(produto.id_produto)}
                            />
                            <Label htmlFor={`produto-${produto.id_produto}`} className="font-normal">
                                {produto.nome} (Fornecedor: {produto.fornecedor})
                            </Label>
                        </div>
                    )) : <p className="text-sm text-muted-foreground p-2">Nenhum produto cadastrado.</p>}
                </ScrollArea>
                {formErrors.produtos && <p className="text-xs text-red-500">{formErrors.produtos}</p>}
            </div>
             {selectedProdutosForModal.length > 0 && (
                <div className="space-y-1">
                    <Label>Produtos Selecionados ({selectedProdutosForModal.length})</Label>
                    <div className="rounded-md border p-2 text-sm text-muted-foreground">
                        {selectedProdutosForModal.map(id => getProdutoNameById(id)).join(", ")}
                    </div>
                </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsDialogOpen(false); setSelectedProdutosForModal([]);}}>Cancelar</Button>
            <Button onClick={handleSave}>{isEditing ? "Atualizar Estoque" : "Criar Estoque"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Estoque;