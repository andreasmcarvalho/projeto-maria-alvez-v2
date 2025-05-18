import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IMaskInput } from "react-imask";
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
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  generateId, 
  validateCPF, 
  validateRequiredFields, 
  validateNoNumbers,
  formatDateToInput,
  formatDateToDisplay
} from "@/lib/utils";

const initialTutorState = { 
  nome: "", 
  sobrenome: "", 
  cpf: "", 
  dataNascimento: "", 
  telefone: "", 
  rua: "", 
  bairro: "", 
  numero: "", 
  complemento: "", 
  cidade: "", 
  estado: "", 
  cep: "", 
  email: "" 
};

const Tutores = () => {
  const { toast } = useToast();
  const [tutores, setTutores] = useState(() => {
    const savedTutores = localStorage.getItem("tutores_v2");
    return savedTutores ? JSON.parse(savedTutores) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTutor, setCurrentTutor] = useState(initialTutorState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("tutores_v2", JSON.stringify(tutores));
  }, [tutores]);

  const filteredTutores = tutores.filter(tutor => 
    `${tutor.nome} ${tutor.sobrenome}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.cpf.includes(searchTerm) ||
    tutor.telefone.includes(searchTerm)
  );
  
  const validateForm = async () => {
    const requiredFields = ["nome", "sobrenome", "cpf", "dataNascimento", "telefone", "rua", "bairro", "numero", "cidade", "estado", "cep", "email"];
    let errors = validateRequiredFields(currentTutor, requiredFields);

    if (currentTutor.nome && !validateNoNumbers(currentTutor.nome)) {
      errors.nome = "Nome não pode conter números.";
    }
    if (currentTutor.sobrenome && !validateNoNumbers(currentTutor.sobrenome)) {
      errors.sobrenome = "Sobrenome não pode conter números.";
    }
    if (currentTutor.cpf && !(await validateCPF(currentTutor.cpf))) {
       errors.cpf = "CPF inválido.";
    }
    if (currentTutor.telefone && currentTutor.telefone.replace(/\D/g, "").length < 10) {
      errors.telefone = "Telefone inválido.";
    }
    if (currentTutor.cep && currentTutor.cep.replace(/\D/g, "").length !== 8) {
      errors.cep = "CEP inválido.";
    }
    if (currentTutor.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentTutor.email)) {
      errors.email = "Email inválido.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveTutor = async () => {
    if (!(await validateForm())) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive"
      });
      return;
    }

    let updatedTutores;
    
    if (isEditing) {
      updatedTutores = tutores.map(tutor => 
        tutor.id_tutor === currentTutor.id_tutor ? currentTutor : tutor
      );
      toast({
        title: "Tutor atualizado",
        description: `${currentTutor.nome} ${currentTutor.sobrenome} foi atualizado com sucesso.`
      });
    } else {
      const newTutor = {
        ...currentTutor,
        id_tutor: generateId(),
      };
      updatedTutores = [...tutores, newTutor];
      toast({
        title: "Tutor adicionado",
        description: `${newTutor.nome} ${newTutor.sobrenome} foi adicionado com sucesso.`
      });
    }
    
    setTutores(updatedTutores);
    setIsDialogOpen(false);
    setCurrentTutor(initialTutorState);
    setIsEditing(false);
    setFormErrors({});
  };

  const handleEditTutor = (tutor) => {
    setCurrentTutor({...tutor, dataNascimento: formatDateToInput(tutor.dataNascimento)});
    setIsEditing(true);
    setIsDialogOpen(true);
    setFormErrors({});
  };

  const handleDeleteTutor = (id_tutor) => {
    const tutorToDelete = tutores.find(tutor => tutor.id_tutor === id_tutor);
    const updatedTutores = tutores.filter(tutor => tutor.id_tutor !== id_tutor);
    setTutores(updatedTutores);
    
    toast({
      title: "Tutor removido",
      description: `${tutorToDelete.nome} ${tutorToDelete.sobrenome} foi removido com sucesso.`
    });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTutor(prev => ({ ...prev, [name]: value }));
  };

  const handleMaskedInputChange = (value, name) => {
    setCurrentTutor(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar tutores..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full sm:w-[300px]"
          />
        </div>
        
        <Button 
          onClick={() => {
            setCurrentTutor(initialTutorState);
            setIsEditing(false);
            setIsDialogOpen(true);
            setFormErrors({});
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Novo Tutor
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-lg border shadow-sm overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Completo</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Cidade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTutores.length > 0 ? (
              filteredTutores.map((tutor) => (
                <TableRow key={tutor.id_tutor}>
                  <TableCell className="font-medium">{tutor.nome} {tutor.sobrenome}</TableCell>
                  <TableCell>{tutor.cpf}</TableCell>
                  <TableCell>{tutor.telefone}</TableCell>
                  <TableCell className="hidden md:table-cell">{tutor.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">{tutor.cidade}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditTutor(tutor)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTutor(tutor.id_tutor)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhum tutor encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Tutor" : "Adicionar Novo Tutor"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo para {isEditing ? "editar o" : "adicionar um novo"} tutor.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="nome">Nome*</Label>
                <Input id="nome" name="nome" value={currentTutor.nome} onChange={handleInputChange} placeholder="Nome" className={formErrors.nome ? "border-red-500" : ""} />
                {formErrors.nome && <p className="text-xs text-red-500">{formErrors.nome}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="sobrenome">Sobrenome*</Label>
                <Input id="sobrenome" name="sobrenome" value={currentTutor.sobrenome} onChange={handleInputChange} placeholder="Sobrenome" className={formErrors.sobrenome ? "border-red-500" : ""} />
                {formErrors.sobrenome && <p className="text-xs text-red-500">{formErrors.sobrenome}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="cpf">CPF*</Label>
                <IMaskInput
                  mask="000.000.000-00"
                  value={currentTutor.cpf}
                  onAccept={(value) => handleMaskedInputChange(value, "cpf")}
                  placeholder="000.000.000-00"
                  className={`form-input ${formErrors.cpf ? "border-red-500" : ""}`}
                  id="cpf"
                />
                {formErrors.cpf && <p className="text-xs text-red-500">{formErrors.cpf}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="dataNascimento">Data de Nascimento*</Label>
                <Input id="dataNascimento" name="dataNascimento" type="date" value={currentTutor.dataNascimento} onChange={handleInputChange} className={formErrors.dataNascimento ? "border-red-500" : ""} />
                {formErrors.dataNascimento && <p className="text-xs text-red-500">{formErrors.dataNascimento}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="telefone">Telefone*</Label>
                 <IMaskInput
                  mask={currentTutor.telefone.replace(/\D/g, "").length <= 10 ? '(00) 0000-0000' : '(00) 00000-0000'}
                  value={currentTutor.telefone}
                  onAccept={(value) => handleMaskedInputChange(value, "telefone")}
                  placeholder="(00) 00000-0000"
                  className={`form-input ${formErrors.telefone ? "border-red-500" : ""}`}
                  id="telefone"
                />
                {formErrors.telefone && <p className="text-xs text-red-500">{formErrors.telefone}</p>}
              </div>
               <div className="space-y-1">
                <Label htmlFor="email">Email*</Label>
                <Input id="email" name="email" type="email" value={currentTutor.email} onChange={handleInputChange} placeholder="email@exemplo.com" className={formErrors.email ? "border-red-500" : ""} />
                {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
              </div>
            </div>
            
            <p className="text-sm font-medium mt-4">Endereço</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="rua">Rua*</Label>
                <Input id="rua" name="rua" value={currentTutor.rua} onChange={handleInputChange} placeholder="Nome da Rua" className={formErrors.rua ? "border-red-500" : ""}/>
                {formErrors.rua && <p className="text-xs text-red-500">{formErrors.rua}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="numero">Número*</Label>
                <Input id="numero" name="numero" value={currentTutor.numero} onChange={handleInputChange} placeholder="Nº" className={formErrors.numero ? "border-red-500" : ""} />
                {formErrors.numero && <p className="text-xs text-red-500">{formErrors.numero}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="bairro">Bairro*</Label>
                <Input id="bairro" name="bairro" value={currentTutor.bairro} onChange={handleInputChange} placeholder="Bairro" className={formErrors.bairro ? "border-red-500" : ""}/>
                {formErrors.bairro && <p className="text-xs text-red-500">{formErrors.bairro}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="complemento">Complemento</Label>
                <Input id="complemento" name="complemento" value={currentTutor.complemento} onChange={handleInputChange} placeholder="Apto, Bloco, etc." />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="cidade">Cidade*</Label>
                <Input id="cidade" name="cidade" value={currentTutor.cidade} onChange={handleInputChange} placeholder="Cidade" className={formErrors.cidade ? "border-red-500" : ""}/>
                {formErrors.cidade && <p className="text-xs text-red-500">{formErrors.cidade}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="estado">Estado*</Label>
                <Input id="estado" name="estado" value={currentTutor.estado} onChange={handleInputChange} placeholder="UF" className={formErrors.estado ? "border-red-500" : ""}/>
                {formErrors.estado && <p className="text-xs text-red-500">{formErrors.estado}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="cep">CEP*</Label>
                <IMaskInput
                  mask="00000-000"
                  value={currentTutor.cep}
                  onAccept={(value) => handleMaskedInputChange(value, "cep")}
                  placeholder="00000-000"
                  className={`form-input ${formErrors.cep ? "border-red-500" : ""}`}
                  id="cep"
                />
                {formErrors.cep && <p className="text-xs text-red-500">{formErrors.cep}</p>}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveTutor}>{isEditing ? "Atualizar" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tutores;