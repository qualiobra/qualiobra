
import { useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { client } = useClerk();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const validateForm = () => {
    let isValid = true;
    setEmailError("");

    if (!email.trim()) {
      setEmailError("E-mail é obrigatório");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("E-mail inválido");
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
      
      await client.signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      
      setResetSent(true);
      toast({
        title: "E-mail enviado",
        description: "Enviamos instruções para redefinir sua senha.",
      });
      
      // Redirecionar para a página de redefinição após 2 segundos
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
      
    } catch (err: any) {
      console.error("Erro ao enviar e-mail:", err);
      const errorMessage = err.errors?.[0]?.message || "Ocorreu um erro ao enviar o e-mail";
      
      if (errorMessage.includes("identifier") || errorMessage.includes("email")) {
        setEmailError("Não foi possível encontrar uma conta com este e-mail");
      } else {
        toast({
          title: "Erro ao redefinir senha",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const continueToReset = () => {
    navigate(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/0606c9b7-ff8b-45c2-93f5-0ce14a8cdab6.png" 
            alt="QualiObra Logo" 
            className="h-14 w-auto" 
          />
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          {!resetSent ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Recuperar Senha</h1>
              <p className="text-gray-600 text-center mb-6">
                Digite seu e-mail e enviaremos instruções para redefinir sua senha.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
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
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar instruções"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Mail className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">E-mail enviado</h2>
              <p className="text-gray-600 mb-6">
                Enviamos instruções para redefinir sua senha para {email}. 
                Por favor, verifique sua caixa de entrada e clique no botão abaixo quando receber o código.
              </p>
              <div className="space-y-3">
                <Button onClick={continueToReset} className="w-full">
                  Continuar para redefinir senha
                </Button>
                <Button onClick={() => setResetSent(false)} variant="outline" className="w-full">
                  Tentar com outro e-mail
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center text-primary hover:underline font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
