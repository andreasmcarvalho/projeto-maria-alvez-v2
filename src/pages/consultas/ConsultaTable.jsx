import React from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

const ConsultaTable = ({ consultas, onEdit, onDelete, formatDate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmado": return "bg-green-100 text-green-800 border-green-200";
      case "pendente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelado": return "bg-red-100 text-red-800 border-red-200";
      case "concluido": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pet</TableHead>
            <TableHead className="hidden md:table-cell">Tutor</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead className="hidden lg:table-cell">Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultas.length > 0 ? (
            consultas.map((consulta) => (
              <TableRow key={consulta.id_consulta}>
                <TableCell className="font-medium">{consulta.pet}</TableCell>
                <TableCell className="hidden md:table-cell">{consulta.tutor}</TableCell>
                <TableCell>{formatDate(consulta.data)}</TableCell>
                <TableCell>{consulta.hora}</TableCell>
                <TableCell className="hidden lg:table-cell">{consulta.tipo}</TableCell>
                <TableCell>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${getStatusColor(consulta.status)}`}>
                    {consulta.status}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(consulta)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(consulta.id_consulta)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                Nenhuma consulta encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ConsultaTable;