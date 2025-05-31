
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Lock, Mail, User, Phone, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SupabaseRegister = () => {
  const { signUp } = useSupabaseAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
    crea: "",
    especialidade: "",
    isEngenheiro: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Nome é obrigatório";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Sobrenome é obrigatório";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    if (formData.isEngenheiro && !formData.crea.trim()) {
      newErrors.crea = "CREA é obrigatório para engenheiros";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        telefone: formData.telefone,
        crea: formData.crea,
        especialidade: formData.especialidade,
        is_engenheiro: formData.isEngenheiro,
        role: 'user'
      };

      const { data, error } = await signUp(formData.email, formData.password, userData);
      
      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Verifique seu e-mail para confirmar sua conta.",
        });
        navigate("/verify-code", { 
          state: { email: formData.email }
        });
      }
      
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      
      if (err.message.includes("User already registered")) {
        setErrors({ email: "Este e-mail já está cadastrado" });
      } else {
        toast({
          title: "Erro no cadastro",
          description: err.message || "Ocorreu um erro ao criar sua conta",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/0606c9b7-ff8b-45c2-93f5-0ce14a8cdab6.png" 
            alt="QualiObra Logo" 
            className="h-14 w-auto" 
          />
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Criar Conta</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">Nome</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`pl-9 ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Nome"
                    disabled={isLoading}
                  />
                </div>
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>
              
              <div className="space-y-1">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Sobrenome</label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Sobrenome"
                  disabled={isLoading}
                />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-9 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="telefone" className="text-sm font-medium text-gray-700">Telefone (opcional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  className="pl-9"
                  placeholder="+55 00 00000-0000"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-9 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Senha"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmar</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Confirmar senha"
                  disabled={isLoading}
                />
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isEngenheiro"
                checked={formData.isEngenheiro}
                onCheckedChange={(checked) => handleInputChange('isEngenheiro', !!checked)}
                disabled={isLoading}
              />
              <label htmlFor="isEngenheiro" className="text-sm text-gray-700">
                Sou engenheiro
              </label>
            </div>
            
            {formData.isEngenheiro && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="crea" className="text-sm font-medium text-gray-700">CREA</label>
                  <Input
                    id="crea"
                    type="text"
                    value={formData.crea}
                    onChange={(e) => handleInputChange('crea', e.target.value)}
                    className={`${errors.crea ? 'border-red-500' : ''}`}
                    placeholder="CREA"
                    disabled={isLoading}
                  />
                  {errors.crea && <p className="text-xs text-red-500">{errors.crea}</p>}
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="especialidade" className="text-sm font-medium text-gray-700">Especialidade</label>
                  <Input
                    id="especialidade"
                    type="text"
                    value={formData.especialidade}
                    onChange={(e) => handleInputChange('especialidade', e.target.value)}
                    placeholder="Especialidade"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Faça login
              </Link>
            </p>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center text-primary hover:underline font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SupabaseRegister;
