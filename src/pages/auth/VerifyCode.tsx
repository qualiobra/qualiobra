
import { useState, useEffect } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { Mail } from "lucide-react";

const VerifyCode = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    // Obter o e-mail do estado da navegação
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // Se não houver e-mail, redirecionar para a página de registro
      navigate("/register");
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !code) {
      setError("Por favor, insira o código de verificação");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      const result = await signUp.attemptEmailAddressVerification({
        code
      });
      
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast({
          title: "E-mail verificado com sucesso",
          description: "Bem-vindo ao QualiObra!",
        });
        navigate("/dashboard");
      } else {
        console.error("Verificação incompleta:", result);
        toast({
          title: "Erro na verificação",
          description: "Não foi possível verificar seu e-mail.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Erro na verificação:", err);
      
      if (err.errors && err.errors.length > 0) {
        const errorMsg = err.errors[0].longMessage || err.errors[0].message;
        setError(errorMsg);
        toast({
          title: "Erro na verificação",
          description: errorMsg,
          variant: "destructive",
        });
      } else {
        setError("Ocorreu um erro ao verificar o código");
        toast({
          title: "Erro na verificação",
          description: "Ocorreu um erro ao verificar o código",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toast({
        title: "Código reenviado",
        description: "Um novo código foi enviado para o seu e-mail.",
      });
    } catch (err: any) {
      console.error("Erro ao reenviar código:", err);
      toast({
        title: "Erro ao reenviar código",
        description: err.message || "Não foi possível reenviar o código",
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
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Verificar E-mail</h1>
          
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <p className="text-center text-gray-600 mb-6">
            Enviamos um código de verificação para <span className="font-medium">{email}</span>. 
            Por favor, insira o código para continuar.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="code" className="sr-only">Código de Verificação</label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={setCode}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} index={index} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
              {error && <p className="text-center text-sm text-red-500">{error}</p>}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verificando..." : "Verificar código"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não recebeu o código?{" "}
              <button 
                type="button" 
                onClick={handleResendCode}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Reenviar código
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
