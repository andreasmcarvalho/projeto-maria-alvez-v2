
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react";
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

const Pets = () => {
  const { toast } = useToast();
  const [pets, setPets] = useState(() => {
    const savedPets = localStorage.getItem("pets");
    return savedPets ? JSON.parse(savedPets) : [
      { id: 1, nome: "Max", especie: "Cachorro", raca: "Golden Retriever", idade: 3, sexo: "Macho", tutor: "João Silva" },
      { id: 2, nome: "Luna", especie: "Gato", raca: "Siamês", idade: 2, sexo: "Fêmea", tutor: "Maria Oliveira" },
      { id: 3, nome: "Thor", especie: "Cachorro", raca: "Bulldog", idade: 5, sexo: "Macho", tutor: "Pedro Santos" },
      { id: 4, nome: "Bella", especie: "Cachorro", raca: "Poodle", idade: 4, sexo: "Fêmea", tutor: "João Silva" },
    ];
  });
  
  const [tutores] = useState(() => {
    const savedTutores = localStorage.getItem("tutores");
    return savedTutores ? JSON.parse(savedTutores) : [
      { id: 1, nome: "João Silva" },
      { id: 2, nome: "Maria Oliveira" },
      { id: 3, nome: "Pedro Santos" },
    ];
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState({ 
    nome: "", 
    especie: "", 
    raca: "", 
    idade: "", 
    sexo: "", 
    tutor: "" 
  });
  const [isEditing, setIsEditing] = useState(false);

  const filteredPets = pets.filter(pet => 
    pet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.raca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.tutor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSavePet = () => {
    if (!currentPet.nome || !currentPet.especie || !currentPet.tutor) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    let updatedPets;
    
    if (isEditing) {
      updatedPets = pets.map(pet => 
        pet.id === currentPet.id ? currentPet : pet
      );
      toast({
        title: "Pet atualizado",
        description: `${currentPet.nome} foi atualizado com sucesso.`
      });
    } else {
      const newPet = {
        ...currentPet,
        id: Date.now()
      };
      updatedPets = [...pets, newPet];
      toast({
        title: "Pet adicionado",
        description: `${newPet.nome} foi adicionado com sucesso.`
      });
    }
    
    setPets(updatedPets);
    localStorage.setItem("pets", JSON.stringify(updatedPets));
    setIsDialogOpen(false);
    setCurrentPet({ nome: "", especie: "", raca: "", idade: "", sexo: "", tutor: "" });
    setIsEditing(false);
  };

  const handleEditPet = (pet) => {
    setCurrentPet(pet);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeletePet = (id) => {
    const petToDelete = pets.find(pet => pet.id === id);
    const updatedPets = pets.filter(pet => pet.id !== id);
    setPets(updatedPets);
    localStorage.setItem("pets", JSON.stringify(updatedPets));
    
    toast({
      title: "Pet removido",
      description: `${petToDelete.nome} foi removido com sucesso.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar pets..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full sm:w-[300px]"
          />
        </div>
        
        <Button 
          onClick={() => {
            setCurrentPet({ nome: "", especie: "", raca: "", idade: "", sexo: "", tutor: "" });
            setIsEditing(false);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Novo Pet
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
              <TableHead>Nome</TableHead>
              <TableHead>Espécie</TableHead>
              <TableHead className="hidden md:table-cell">Raça</TableHead>
              <TableHead className="hidden md:table-cell">Idade</TableHead>
              <TableHead className="hidden lg:table-cell">Sexo</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell className="font-medium">{pet.nome}</TableCell>
                  <TableCell>
                    <Badge variant={pet.especie === "Cachorro" ? "default" : "secondary"}>
                      {pet.especie}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{pet.raca}</TableCell>
                  <TableCell className="hidden md:table-cell">{pet.idade} {pet.idade === 1 ? "ano" : "anos"}</TableCell>
                  <TableCell className="hidden lg:table-cell">{pet.sexo}</TableCell>
                  <TableCell>{pet.tutor}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditPet(pet)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePet(pet.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Nenhum pet encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Pet" : "Adicionar Novo Pet"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome*</Label>
                <Input
                  id="nome"
                  value={currentPet.nome}
                  onChange={(e) => setCurrentPet({ ...currentPet, nome: e.target.value })}
                  placeholder="Nome do pet"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="especie">Espécie*</Label>
                  <Select
                    value={currentPet.especie}
                    onValueChange={(value) => setCurrentPet({ ...currentPet, especie: value })}
                  >
                    <SelectTrigger id="especie">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cachorro">Cachorro</SelectItem>
                      <SelectItem value="Gato">Gato</SelectItem>
                      <SelectItem value="Ave">Ave</SelectItem>
                      <SelectItem value="Roedor">Roedor</SelectItem>
                      <SelectItem value="Réptil">Réptil</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="raca">Raça</Label>
                  <Input
                    id="raca"
                    value={currentPet.raca}
                    onChange={(e) => setCurrentPet({ ...currentPet, raca: e.target.value })}
                    placeholder="Raça do pet"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idade">Idade</Label>
                  <Input
                    id="idade"
                    type="number"
                    min="0"
                    value={currentPet.idade}
                    onChange={(e) => setCurrentPet({ ...currentPet, idade: e.target.value })}
                    placeholder="Idade em anos"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select
                    value={currentPet.sexo}
                    onValueChange={(value) => setCurrentPet({ ...currentPet, sexo: value })}
                  >
                    <SelectTrigger id="sexo">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Macho">Macho</SelectItem>
                      <SelectItem value="Fêmea">Fêmea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tutor">Tutor*</Label>
                <Select
                  value={currentPet.tutor}
                  onValueChange={(value) => setCurrentPet({ ...currentPet, tutor: value })}
                >
                  <SelectTrigger id="tutor">
                    <SelectValue placeholder="Selecione um tutor" />
                  </SelectTrigger>
                  <SelectContent>
                    {tutores.map((tutor) => (
                      <SelectItem key={tutor.id} value={tutor.nome}>
                        {tutor.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSavePet}>{isEditing ? "Atualizar" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pets;
