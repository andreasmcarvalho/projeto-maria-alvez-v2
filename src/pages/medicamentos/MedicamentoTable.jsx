import React from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

const MedicamentoTable = ({ medicamentos, onEdit, onDelete, formatDate, formatCurrency }) => {
  const getEstoqueStatus = (quantidade) => {
    if (quantidade <= 10) return "bg-red-100 text-red-800 border-red-200";
    if (quantidade <= 20) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Princípio Ativo</TableHead>
            <TableHead className="hidden md:table-cell">Estoque</TableHead>
            <TableHead className="hidden lg:table-cell">Preço</TableHead>
            <TableHead className="hidden lg:table-cell">Validade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medicamentos.length > 0 ? (
            medicamentos.map((medicamento) => (
              <TableRow key={medicamento.id_medicamento}>
                <TableCell className="font-medium">{medicamento.nome}</TableCell>
                <TableCell>{medicamento.principio_ativo}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${getEstoqueStatus(medicamento.estoque)}`}>
                    {medicamento.estoque} unid.
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{formatCurrency(medicamento.preco)}</TableCell>
                <TableCell className="hidden lg:table-cell">{formatDate(medicamento.validade)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(medicamento)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(medicamento.id_medicamento)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Nenhum medicamento encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MedicamentoTable;