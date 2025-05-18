import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { generateId, validateRequiredFields, formatDateToInput, formatDateToDisplay } from "@/lib/utils";

const initialProdutoState = {
  nome: "",
  quantidade: "",
  validade: "",
  fornecedor: "",
  quantidade_minima: "",
  data_ultima_reposicao: formatDateToInput(new Date().toISOString())
};

const Produtos = () => {
  const { toast } = useToast();
  const [produtos, setProdutos] = useState(() => {
    const savedData = localStorage.getItem("produtos_data");
    return savedData ? JSON.parse(savedData) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduto, setCurrentProduto] = useState(initialProdutoState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("produtos_data", JSON.stringify(produtos));
  }, [produtos]);

  const filteredProdutos = produtos.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const required = ["nome", "quantidade", "validade", "fornecedor", "quantidade_minima", "data_ultima_reposicao"];
    const errors = validateRequiredFields(currentProduto, required);
    if (currentProduto.quantidade && isNaN(parseInt(currentProduto.quantidade))) {
      errors.quantidade = "Quantidade deve ser um número.";
    }
    if (currentProduto.quantidade_minima && isNaN(parseInt(currentProduto.quantidade_minima))) {
      errors.quantidade_minima = "Quantidade mínima deve ser um número.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({ title: "Erro de Validação", description: "Corrija os campos.", variant: "destructive" });
      return;
    }
    let updatedProdutos;
    if (isEditing) {
      updatedProdutos = produtos.map(p => p.id_produto === currentProduto.id_produto ? currentProduto : p);
      toast({ title: "Produto atualizado", description: `${currentProduto.nome} atualizado.` });
    } else {
      const newProduto = { ...currentProduto, id_produto: generateId() };
      updatedProdutos = [...produtos, newProduto];
      toast({ title: "Produto adicionado", description: `${newProduto.nome} adicionado.` });
    }
    setProdutos(updatedProdutos);
    setIsDialogOpen(false);
    setCurrentProduto(initialProdutoState);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEdit = (produto) => {
    setCurrentProduto({
      ...produto,
      validade: formatDateToInput(produto.validade),
      data_ultima_reposicao: formatDateToInput(produto.data_ultima_reposicao)
    });
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDelete = (id_produto) => {
    const toDelete = produtos.find(p => p.id_produto === id_produto);
    setProdutos(produtos.filter(p => p.id_produto !== id_produto));
    toast({ title: "Produto removido", description: `${toDelete.nome} removido.` });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduto(prev => ({ ...prev, [name]: value }));
  };
  
  const getEstoqueStatus = (quantidade, quantidade_minima) => {
    if (parseInt(quantidade) <= parseInt(quantidade_minima)) return "bg-red-100 text-red-800 border-red-200";
    if (parseInt(quantidade) <= parseInt(quantidade_minima) * 1.5) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou fornecedor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-full sm:w-[350px]" />
        </div>
        <Button onClick={() => { setCurrentProduto({...initialProdutoState, data_ultima_reposicao: formatDateToInput(new Date().toISOString())}); setIsEditing(false); setIsDialogOpen(true); setFormErrors({}); }}>
          <Plus className="h-4 w-4 mr-2" /> Novo Produto
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead className="hidden md:table-cell">Fornecedor</TableHead>
              <TableHead className="hidden lg:table-cell">Validade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProdutos.length > 0 ? (
              filteredProdutos.map((produto) => (
                <TableRow key={produto.id_produto}>
                  <TableCell className="font-medium">{produto.nome}</TableCell>
                  <TableCell>
                     <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${getEstoqueStatus(produto.quantidade, produto.quantidade_minima)}`}>
                      {produto.quantidade} unid.
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{produto.fornecedor}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatDateToDisplay(produto.validade)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(produto)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(produto.id_produto)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Nenhum produto encontrado</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Produto" : "Adicionar Novo Produto"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div className="space-y-1">
                <Label htmlFor="nome">Nome*</Label>
                <Input id="nome" name="nome" value={currentProduto.nome} onChange={handleInputChange} className={formErrors.nome ? "border-red-500" : ""} />
                {formErrors.nome && <p className="text-xs text-red-500">{formErrors.nome}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="quantidade">Quantidade*</Label>
                <Input id="quantidade" name="quantidade" type="number" min="0" value={currentProduto.quantidade} onChange={handleInputChange} className={formErrors.quantidade ? "border-red-500" : ""} />
                {formErrors.quantidade && <p className="text-xs text-red-500">{formErrors.quantidade}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="validade">Validade*</Label>
                <Input id="validade" name="validade" type="date" value={currentProduto.validade} onChange={handleInputChange} className={formErrors.validade ? "border-red-500" : ""} />
                {formErrors.validade && <p className="text-xs text-red-500">{formErrors.validade}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="fornecedor">Fornecedor*</Label>
                <Input id="fornecedor" name="fornecedor" value={currentProduto.fornecedor} onChange={handleInputChange} className={formErrors.fornecedor ? "border-red-500" : ""} />
                {formErrors.fornecedor && <p className="text-xs text-red-500">{formErrors.fornecedor}</p>}
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="quantidade_minima">Quantidade Mínima em Estoque*</Label>
                <Input id="quantidade_minima" name="quantidade_minima" type="number" min="0" value={currentProduto.quantidade_minima} onChange={handleInputChange} className={formErrors.quantidade_minima ? "border-red-500" : ""} />
                {formErrors.quantidade_minima && <p className="text-xs text-red-500">{formErrors.quantidade_minima}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="data_ultima_reposicao">Data da Última Reposição*</Label>
                <Input id="data_ultima_reposicao" name="data_ultima_reposicao" type="date" value={currentProduto.data_ultima_reposicao} onChange={handleInputChange} className={formErrors.data_ultima_reposicao ? "border-red-500" : ""} />
                {formErrors.data_ultima_reposicao && <p className="text-xs text-red-500">{formErrors.data_ultima_reposicao}</p>}
              </div>
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

export default Produtos;