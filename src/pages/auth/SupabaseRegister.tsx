
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/SupabaseAuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SupabaseRegister = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateForm = () => {
    let isValid = true;
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");

    if (!firstName.trim()) {
      setFirstNameError("Nome é obrigatório");
      isValid = false;
    }

    if (!lastName.trim()) {
      setLastNameError("Sobrenome é obrigatório");
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("E-mail é obrigatório");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("E-mail inválido");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Senha é obrigatória");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      const userData = {
        first_name: firstName,
        last_name: lastName,
      };

      const { data, error } = await signUp(email, password, userData);
      
      if (error) {
        console.error("Erro no cadastro:", error);
        
        if (error.message.includes("User already registered")) {
          setEmailError("Este e-mail já está cadastrado");
          toast({
            title: "E-mail já cadastrado",
            description: "Este e-mail já possui uma conta. Tente fazer login.",
            variant: "destructive",
          });
        } else if (error.message.includes("Password")) {
          setPasswordError(error.message);
        } else {
          toast({
            title: "Erro no cadastro",
            description: error.message || "Ocorreu um erro durante o cadastro",
            variant: "destructive",
          });
        }
        return;
      }

      if (data.user) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu e-mail para confirmar sua conta antes de fazer login.",
        });
        navigate("/login");
      }
      
    } catch (err: any) {
      console.error("Erro inesperado no cadastro:", err);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
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
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Criar conta</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">Nome</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`pl-10 ${firstNameError ? 'border-red-500' : ''}`}
                    placeholder="Nome"
                    disabled={isLoading}
                  />
                </div>
                {firstNameError && <p className="text-sm text-red-500">{firstNameError}</p>}
              </div>
              
              <div className="space-y-1">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Sobrenome</label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`${lastNameError ? 'border-red-500' : ''}`}
                  placeholder="Sobrenome"
                  disabled={isLoading}
                />
                {lastNameError && <p className="text-sm text-red-500">{lastNameError}</p>}
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${emailError ? 'border-red-500' : ''}`}
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
              </div>
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 ${passwordError ? 'border-red-500' : ''}`}
                  placeholder="Senha (mínimo 8 caracteres)"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            </div>
            
            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <div className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Entrar
              </Link>
            </div>
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
