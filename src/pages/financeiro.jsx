
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Financeiro = () => {
  const { toast } = useToast();
  const [transacoes, setTransacoes] = useState(() => {
    const savedTransacoes = localStorage.getItem("transacoes");
    return savedTransacoes ? JSON.parse(savedTransacoes) : [
      { 
        id: 1, 
        descricao: "Consulta - Max", 
        valor: 150.00, 
        data: "2025-05-15", 
        tipo: "receita", 
        categoria: "Consulta",
        status: "pago"
      },
      { 
        id: 2, 
        descricao: "Compra de medicamentos", 
        valor: 500.00, 
        data: "2025-05-14", 
        tipo: "despesa", 
        categoria: "Estoque",
        status: "pago"
      },
      { 
        id: 3, 
        descricao: "Vacinação - Luna", 
        valor: 120.00, 
        data: "2025-05-16", 
        tipo: "receita", 
        categoria: "Vacina",
        status: "pendente"
      },
      { 
        id: 4, 
        descricao: "Exame de sangue - Thor", 
        valor: 200.00, 
        data: "2025-05-16", 
        tipo: "receita", 
        categoria: "Exame",
        status: "pago"
      },
      { 
        id: 5, 
        descricao: "Conta de luz", 
        valor: 350.00, 
        data: "2025-05-10", 
        tipo: "despesa", 
        categoria: "Utilidades",
        status: "pago"
      },
    ];
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTransacao, setCurrentTransacao] = useState({ 
    descricao: "", 
    valor: "", 
    data: "", 
    tipo: "receita", 
    categoria: "", 
    status: "pendente"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("todas");

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredTransacoes = transacoes
    .filter(transacao => 
      (transacao.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transacao.categoria.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeTab === "todas" || activeTab === transacao.tipo)
    )
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  const totalReceitas = transacoes
    .filter(t => t.tipo === "receita")
    .reduce((acc, curr) => acc + parseFloat(curr.valor), 0);
    
  const totalDespesas = transacoes
    .filter(t => t.tipo === "despesa")
    .reduce((acc, curr) => acc + parseFloat(curr.valor), 0);
    
  const saldo = totalReceitas - totalDespesas;

  const handleSaveTransacao = () => {
    if (!currentTransacao.descricao || !currentTransacao.valor || !currentTransacao.data || !currentTransacao.categoria) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    let updatedTransacoes;
    
    if (isEditing) {
      updatedTransacoes = transacoes.map(transacao => 
        transacao.id === currentTransacao.id ? currentTransacao : transacao
      );
      toast({
        title: "Transação atualizada",
        description: `${currentTransacao.descricao} foi atualizada com sucesso.`
      });
    } else {
      const newTransacao = {
        ...currentTransacao,
        id: Date.now(),
        valor: parseFloat(currentTransacao.valor)
      };
      updatedTransacoes = [...transacoes, newTransacao];
      toast({
        title: "Transação adicionada",
        description: `${newTransacao.descricao} foi adicionada com sucesso.`
      });
    }
    
    setTransacoes(updatedTransacoes);
    localStorage.setItem("transacoes", JSON.stringify(updatedTransacoes));
    setIsDialogOpen(false);
    setCurrentTransacao({ 
      descricao: "", 
      valor: "", 
      data: "", 
      tipo: "receita", 
      categoria: "", 
      status: "pendente"
    });
    setIsEditing(false);
  };

  const handleEditTransacao = (transacao) => {
    setCurrentTransacao(transacao);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteTransacao = (id) => {
    const transacaoToDelete = transacoes.find(transacao => transacao.id === id);
    const updatedTransacoes = transacoes.filter(transacao => transacao.id !== id);
    setTransacoes(updatedTransacoes);
    localStorage.setItem("transacoes", JSON.stringify(updatedTransacoes));
    
    toast({
      title: "Transação removida",
      description: `${transacaoToDelete.descricao} foi removida com sucesso.`
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pago": return "bg-green-100 text-green-800 border-green-200";
      case "pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelado": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalReceitas)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDespesas)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(saldo)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar transações..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full sm:w-[300px]"
          />
        </div>
        
        <Button 
          onClick={() => {
            setCurrentTransacao({ 
              descricao: "", 
              valor: "", 
              data: "", 
              tipo: "receita", 
              categoria: "", 
              status: "pendente"
            });
            setIsEditing(false);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Nova Transação
        </Button>
      </div>
      
      <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="receita">Receitas</TabsTrigger>
          <TabsTrigger value="despesa">Despesas</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-lg border shadow-sm overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="hidden md:table-cell">Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransacoes.length > 0 ? (
              filteredTransacoes.map((transacao) => (
                <TableRow key={transacao.id}>
                  <TableCell className="font-medium">{transacao.descricao}</TableCell>
                  <TableCell className={transacao.tipo === "receita" ? "text-green-600" : "text-red-600"}>
                    {transacao.tipo === "receita" ? "+" : "-"}{formatCurrency(transacao.valor)}
                  </TableCell>
                  <TableCell>{formatDate(transacao.data)}</TableCell>
                  <TableCell className="hidden md:table-cell">{transacao.categoria}</TableCell>
                  <TableCell>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${getStatusColor(transacao.status)}`}>
                      {transacao.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditTransacao(transacao)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTransacao(transacao.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhuma transação encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Transação" : "Adicionar Nova Transação"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição*</Label>
                <Input
                  id="descricao"
                  value={currentTransacao.descricao}
                  onChange={(e) => setCurrentTransacao({ ...currentTransacao, descricao: e.target.value })}
                  placeholder="Descrição da transação"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor*</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentTransacao.valor}
                    onChange={(e) => setCurrentTransacao({ ...currentTransacao, valor: e.target.value })}
                    placeholder="0,00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data">Data*</Label>
                  <Input
                    id="data"
                    type="date"
                    value={currentTransacao.data}
                    onChange={(e) => setCurrentTransacao({ ...currentTransacao, data: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo*</Label>
                  <Select
                    value={currentTransacao.tipo}
                    onValueChange={(value) => setCurrentTransacao({ ...currentTransacao, tipo: value })}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria*</Label>
                  <Select
                    value={currentTransacao.categoria}
                    onValueChange={(value) => setCurrentTransacao({ ...currentTransacao, categoria: value })}
                  >
                    <SelectTrigger id="categoria">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentTransacao.tipo === "receita" ? (
                        <>
                          <SelectItem value="Consulta">Consulta</SelectItem>
                          <SelectItem value="Exame">Exame</SelectItem>
                          <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                          <SelectItem value="Vacina">Vacina</SelectItem>
                          <SelectItem value="Medicamento">Medicamento</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Estoque">Estoque</SelectItem>
                          <SelectItem value="Salários">Salários</SelectItem>
                          <SelectItem value="Aluguel">Aluguel</SelectItem>
                          <SelectItem value="Utilidades">Utilidades</SelectItem>
                          <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={currentTransacao.status}
                  onValueChange={(value) => setCurrentTransacao({ ...currentTransacao, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveTransacao}>{isEditing ? "Atualizar" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Financeiro;
