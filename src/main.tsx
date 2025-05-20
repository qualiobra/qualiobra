
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from "@clerk/clerk-react";
import App from './App.tsx'
import './index.css'

// Chave publicável do Clerk
const CLERK_PUBLISHABLE_KEY = "pk_test_c2VjdXJlLWZhbGNvbi00NC5jbGVyay5hY2NvdW50cy5kZXYk";

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Chave publicável do Clerk não encontrada");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider 
    publishableKey={CLERK_PUBLISHABLE_KEY}
    localization={{
      locale: "pt-BR"
    }}
  >
    <App />
  </ClerkProvider>
);
