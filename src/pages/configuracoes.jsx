
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, User, Building, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const Configuracoes = () => {
  const { toast } = useToast();
  const [clinicaInfo, setClinicaInfo] = useState(() => {
    const savedInfo = localStorage.getItem("clinicaInfo");
    return savedInfo ? JSON.parse(savedInfo) : {
      nome: "VetClinic",
      endereco: "Av. Principal, 1000",
      telefone: "(11) 3456-7890",
      email: "contato@vetclinic.com",
      cnpj: "12.345.678/0001-90",
      horarioFuncionamento: "Segunda a Sexta: 08:00 - 18:00, Sábado: 08:00 - 12:00"
    };
  });
  
  const [veterinarios, setVeterinarios] = useState(() => {
    const savedVets = localStorage.getItem("veterinarios");
    return savedVets ? JSON.parse(savedVets) : [
      { id: 1, nome: "Dr. Carlos Mendes", especialidade: "Clínica Geral", crmv: "CRMV-SP 12345", telefone: "(11) 98765-4321", email: "carlos@vetclinic.com" },
      { id: 2, nome: "Dra. Ana Sousa", especialidade: "Cirurgia", crmv: "CRMV-SP 54321", telefone: "(11) 91234-5678", email: "ana@vetclinic.com" },
      { id: 3, nome: "Dr. Ricardo Lima", especialidade: "Dermatologia", crmv: "CRMV-SP 67890", telefone: "(11) 99876-5432", email: "ricardo@vetclinic.com" },
    ];
  });

  const handleSaveClinicaInfo = () => {
    localStorage.setItem("clinicaInfo", JSON.stringify(clinicaInfo));
    toast({
      title: "Configurações salvas",
      description: "As informações da clínica foram atualizadas com sucesso."
    });
  };

  const handleSaveVeterinario = (id, data) => {
    const updatedVets = veterinarios.map(vet => 
      vet.id === id ? { ...vet, ...data } : vet
    );
    setVeterinarios(updatedVets);
    localStorage.setItem("veterinarios", JSON.stringify(updatedVets));
    toast({
      title: "Veterinário atualizado",
      description: `As informações de ${data.nome} foram atualizadas com sucesso.`
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="clinica">
        <TabsList>
          <TabsTrigger value="clinica">Informações da Clínica</TabsTrigger>
          <TabsTrigger value="veterinarios">Veterinários</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clinica" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Informações da Clínica</CardTitle>
                <CardDescription>
                  Atualize as informações básicas da sua clínica veterinária.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Clínica</Label>
                    <Input
                      id="nome"
                      value={clinicaInfo.nome}
                      onChange={(e) => setClinicaInfo({ ...clinicaInfo, nome: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={clinicaInfo.cnpj}
                      onChange={(e) => setClinicaInfo({ ...clinicaInfo, cnpj: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={clinicaInfo.endereco}
                    onChange={(e) => setClinicaInfo({ ...clinicaInfo, endereco: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={clinicaInfo.telefone}
                      onChange={(e) => setClinicaInfo({ ...clinicaInfo, telefone: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clinicaInfo.email}
                      onChange={(e) => setClinicaInfo({ ...clinicaInfo, email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="horarioFuncionamento">Horário de Funcionamento</Label>
                  <Input
                    id="horarioFuncionamento"
                    value={clinicaInfo.horarioFuncionamento}
                    onChange={(e) => setClinicaInfo({ ...clinicaInfo, horarioFuncionamento: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveClinicaInfo}>
                  <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="veterinarios" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {veterinarios.map((vet, index) => (
              <Card key={vet.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" /> {vet.nome}
                  </CardTitle>
                  <CardDescription>{vet.especialidade} - {vet.crmv}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`nome-${vet.id}`}>Nome</Label>
                      <Input
                        id={`nome-${vet.id}`}
                        value={vet.nome}
                        onChange={(e) => {
                          const updatedVets = [...veterinarios];
                          updatedVets[index].nome = e.target.value;
                          setVeterinarios(updatedVets);
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`especialidade-${vet.id}`}>Especialidade</Label>
                      <Input
                        id={`especialidade-${vet.id}`}
                        value={vet.especialidade}
                        onChange={(e) => {
                          const updatedVets = [...veterinarios];
                          updatedVets[index].especialidade = e.target.value;
                          setVeterinarios(updatedVets);
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`crmv-${vet.id}`}>CRMV</Label>
                    <Input
                      id={`crmv-${vet.id}`}
                      value={vet.crmv}
                      onChange={(e) => {
                        const updatedVets = [...veterinarios];
                        updatedVets[index].crmv = e.target.value;
                        setVeterinarios(updatedVets);
                      }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`telefone-${vet.id}`}>Telefone</Label>
                      <Input
                        id={`telefone-${vet.id}`}
                        value={vet.telefone}
                        onChange={(e) => {
                          const updatedVets = [...veterinarios];
                          updatedVets[index].telefone = e.target.value;
                          setVeterinarios(updatedVets);
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`email-${vet.id}`}>Email</Label>
                      <Input
                        id={`email-${vet.id}`}
                        type="email"
                        value={vet.email}
                        onChange={(e) => {
                          const updatedVets = [...veterinarios];
                          updatedVets[index].email = e.target.value;
                          setVeterinarios(updatedVets);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSaveVeterinario(vet.id, vet)}>
                    <Save className="h-4 w-4 mr-2" /> Salvar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="sistema" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Gerencie as configurações gerais do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                  <p className="text-sm">
                    Esta é uma versão local do sistema. Os dados são armazenados apenas no navegador atual.
                    Para uma solução completa com armazenamento em nuvem e recursos avançados, entre em contato com o suporte.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      localStorage.clear();
                      toast({
                        title: "Dados limpos",
                        description: "Todos os dados do sistema foram removidos. A página será recarregada.",
                      });
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    }}
                  >
                    Limpar todos os dados
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
