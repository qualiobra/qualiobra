
export interface UserData {
  id: string;
  name: string;
  email: string;
  telefoneWhatsApp?: string;
  role: string;
  roleId: string;
  avatar?: string;
  status: "active" | "inactive";
  lastLogin: string | null;
}
