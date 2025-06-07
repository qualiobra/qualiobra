export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categorias_itens: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      comodos_itens: {
        Row: {
          comodo_id: string
          created_at: string
          id: string
          item_id: string
          obrigatorio: boolean
          ordem: number
          updated_at: string
        }
        Insert: {
          comodo_id: string
          created_at?: string
          id?: string
          item_id: string
          obrigatorio?: boolean
          ordem?: number
          updated_at?: string
        }
        Update: {
          comodo_id?: string
          created_at?: string
          id?: string
          item_id?: string
          obrigatorio?: boolean
          ordem?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_comodos_itens_comodo"
            columns: ["comodo_id"]
            isOneToOne: false
            referencedRelation: "comodos_tipologia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_comodos_itens_item"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "itens_inspectionaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      comodos_master: {
        Row: {
          ativo: boolean
          created_at: string
          created_by: string | null
          descricao: string | null
          icone: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          created_by?: string | null
          descricao?: string | null
          icone?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      comodos_master_itens: {
        Row: {
          comodo_master_id: string
          created_at: string
          id: string
          item_id: string
          obrigatorio: boolean
          ordem: number
          updated_at: string
        }
        Insert: {
          comodo_master_id: string
          created_at?: string
          id?: string
          item_id: string
          obrigatorio?: boolean
          ordem?: number
          updated_at?: string
        }
        Update: {
          comodo_master_id?: string
          created_at?: string
          id?: string
          item_id?: string
          obrigatorio?: boolean
          ordem?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comodos_master_itens_comodo_master_id_fkey"
            columns: ["comodo_master_id"]
            isOneToOne: false
            referencedRelation: "comodos_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comodos_master_itens_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "itens_inspectionaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      comodos_tipologia: {
        Row: {
          comodo_master_id: string | null
          created_at: string
          descricao: string | null
          id: string
          nome: string
          tipologia_id: string
          updated_at: string
        }
        Insert: {
          comodo_master_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          tipologia_id: string
          updated_at?: string
        }
        Update: {
          comodo_master_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          tipologia_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comodos_tipologia_comodo_master_id_fkey"
            columns: ["comodo_master_id"]
            isOneToOne: false
            referencedRelation: "comodos_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_comodos_tipologia_tipologia_id"
            columns: ["tipologia_id"]
            isOneToOne: false
            referencedRelation: "tipologias"
            referencedColumns: ["id"]
          },
        ]
      }
      comodos_tipologia_itens: {
        Row: {
          comodo_tipologia_id: string
          created_at: string
          id: string
          item_id: string
          obrigatorio: boolean
          ordem: number
          updated_at: string
        }
        Insert: {
          comodo_tipologia_id: string
          created_at?: string
          id?: string
          item_id: string
          obrigatorio?: boolean
          ordem?: number
          updated_at?: string
        }
        Update: {
          comodo_tipologia_id?: string
          created_at?: string
          id?: string
          item_id?: string
          obrigatorio?: boolean
          ordem?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comodos_tipologia_itens_comodo_tipologia_id_fkey"
            columns: ["comodo_tipologia_id"]
            isOneToOne: false
            referencedRelation: "comodos_tipologia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comodos_tipologia_itens_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "itens_inspectionaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_inspectionaveis: {
        Row: {
          ativo: boolean
          categoria_id: string
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria_id: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria_id?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_inspectionaveis_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_itens"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          crea: string | null
          created_at: string | null
          email: string | null
          especialidade: string | null
          first_name: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          is_engenheiro: boolean | null
          last_name: string | null
          role: string | null
          status: string | null
          telefone: string | null
        }
        Insert: {
          crea?: string | null
          created_at?: string | null
          email?: string | null
          especialidade?: string | null
          first_name?: string | null
          id: string
          invited_at?: string | null
          invited_by?: string | null
          is_engenheiro?: boolean | null
          last_name?: string | null
          role?: string | null
          status?: string | null
          telefone?: string | null
        }
        Update: {
          crea?: string | null
          created_at?: string | null
          email?: string | null
          especialidade?: string | null
          first_name?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_engenheiro?: boolean | null
          last_name?: string | null
          role?: string | null
          status?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      questoes_diagnostico: {
        Row: {
          ativa: boolean
          created_at: string
          descricao_questao: string
          exigencia_siac_nivel_a: string
          exigencia_siac_nivel_b: string
          id_questao: string
          item_requisito: string
          ordem_exibicao: number
          referencia_completa_siac: string | null
          referencial_normativo: string
          tipo_pontuacao: string
          titulo_requisito: string
          updated_at: string
        }
        Insert: {
          ativa?: boolean
          created_at?: string
          descricao_questao: string
          exigencia_siac_nivel_a?: string
          exigencia_siac_nivel_b?: string
          id_questao?: string
          item_requisito: string
          ordem_exibicao: number
          referencia_completa_siac?: string | null
          referencial_normativo?: string
          tipo_pontuacao?: string
          titulo_requisito: string
          updated_at?: string
        }
        Update: {
          ativa?: boolean
          created_at?: string
          descricao_questao?: string
          exigencia_siac_nivel_a?: string
          exigencia_siac_nivel_b?: string
          id_questao?: string
          item_requisito?: string
          ordem_exibicao?: number
          referencia_completa_siac?: string | null
          referencial_normativo?: string
          tipo_pontuacao?: string
          titulo_requisito?: string
          updated_at?: string
        }
        Relationships: []
      }
      respostas_diagnostico_usuario: {
        Row: {
          created_at: string
          data_hora_resposta: string
          id_diagnostico_agrupador: string
          id_obra_avaliada: string | null
          id_questao_respondida: string
          id_resposta_diagnostico: string
          id_usuario_avaliador: string
          nivel_diagnostico_realizado: string
          observacoes_usuario: string | null
          pontuacao_usuario: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_hora_resposta?: string
          id_diagnostico_agrupador: string
          id_obra_avaliada?: string | null
          id_questao_respondida: string
          id_resposta_diagnostico?: string
          id_usuario_avaliador: string
          nivel_diagnostico_realizado: string
          observacoes_usuario?: string | null
          pontuacao_usuario: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_hora_resposta?: string
          id_diagnostico_agrupador?: string
          id_obra_avaliada?: string | null
          id_questao_respondida?: string
          id_resposta_diagnostico?: string
          id_usuario_avaliador?: string
          nivel_diagnostico_realizado?: string
          observacoes_usuario?: string | null
          pontuacao_usuario?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "respostas_diagnostico_usuario_id_questao_respondida_fkey"
            columns: ["id_questao_respondida"]
            isOneToOne: false
            referencedRelation: "questoes_diagnostico"
            referencedColumns: ["id_questao"]
          },
        ]
      }
      role_permissions: {
        Row: {
          action: Database["public"]["Enums"]["app_action"]
          created_at: string
          id: string
          module: Database["public"]["Enums"]["app_module"]
          role_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["app_action"]
          created_at?: string
          id?: string
          module: Database["public"]["Enums"]["app_module"]
          role_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["app_action"]
          created_at?: string
          id?: string
          module?: Database["public"]["Enums"]["app_module"]
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      tipologias: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          metragem: number | null
          nome: string
          obra_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          metragem?: number | null
          nome: string
          obra_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          metragem?: number | null
          nome?: string
          obra_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_invites: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          role?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      user_role_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          is_active: boolean
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          is_active?: boolean
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          is_active?: boolean
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_role_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          is_active: boolean
          name: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          name: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          name?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_comodos_tipologia_itens: {
        Row: {
          comodo_id: string | null
          item_id: string | null
          obrigatorio: boolean | null
          ordem: number | null
          origem: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_item_to_comodo_master: {
        Args: {
          p_comodo_master_id: string
          p_item_id: string
          p_obrigatorio?: boolean
          p_ordem?: number
        }
        Returns: string
      }
      add_item_to_comodo_tipologia: {
        Args: {
          p_comodo_tipologia_id: string
          p_item_id: string
          p_obrigatorio?: boolean
          p_ordem?: number
        }
        Returns: string
      }
      add_item_to_comodo_tipologia_new: {
        Args: {
          p_comodo_tipologia_id: string
          p_item_id: string
          p_obrigatorio?: boolean
          p_ordem?: number
        }
        Returns: string
      }
      create_categoria_item: {
        Args: { p_nome: string; p_descricao: string }
        Returns: string
      }
      create_comodo_item: {
        Args: {
          p_comodo_id: string
          p_item_id: string
          p_obrigatorio: boolean
          p_ordem: number
        }
        Returns: string
      }
      create_comodo_master: {
        Args: { p_nome: string; p_descricao: string; p_icone: string }
        Returns: string
      }
      create_item_inspecionavel: {
        Args: { p_nome: string; p_descricao: string; p_categoria_id: string }
        Returns: string
      }
      delete_comodo_item: {
        Args: { p_id: string }
        Returns: boolean
      }
      get_categorias_itens: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          nome: string
          descricao: string
          ativo: boolean
          created_at: string
          updated_at: string
        }[]
      }
      get_comodo_all_itens: {
        Args: { p_comodo_tipologia_id: string }
        Returns: {
          id: string
          item_id: string
          obrigatorio: boolean
          ordem: number
          item_nome: string
          item_descricao: string
          categoria_nome: string
          origem: string
        }[]
      }
      get_comodos_itens_by_comodo: {
        Args: { p_comodo_id: string }
        Returns: {
          id: string
          comodo_id: string
          item_id: string
          obrigatorio: boolean
          ordem: number
          created_at: string
          updated_at: string
          item_nome: string
          item_descricao: string
          categoria_nome: string
        }[]
      }
      get_comodos_master: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          nome: string
          descricao: string
          icone: string
          ativo: boolean
          created_at: string
          updated_at: string
        }[]
      }
      get_comodos_master_itens: {
        Args: { p_comodo_master_id: string }
        Returns: {
          id: string
          comodo_master_id: string
          item_id: string
          obrigatorio: boolean
          ordem: number
          created_at: string
          updated_at: string
          item_nome: string
          item_descricao: string
          categoria_nome: string
        }[]
      }
      get_comodos_tipologia_itens: {
        Args: { p_comodo_tipologia_id: string }
        Returns: {
          id: string
          comodo_tipologia_id: string
          item_id: string
          obrigatorio: boolean
          ordem: number
          created_at: string
          updated_at: string
          item_nome: string
          item_descricao: string
          categoria_nome: string
        }[]
      }
      get_itens_inspectionaveis: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          nome: string
          descricao: string
          categoria_id: string
          ativo: boolean
          created_at: string
          updated_at: string
          categoria_nome: string
        }[]
      }
      toggle_categoria_item: {
        Args: { p_id: string; p_ativo: boolean }
        Returns: boolean
      }
      toggle_comodo_item_obrigatorio: {
        Args: { p_id: string; p_obrigatorio: boolean }
        Returns: boolean
      }
      toggle_comodo_master: {
        Args: { p_id: string; p_ativo: boolean }
        Returns: boolean
      }
      toggle_item_inspecionavel: {
        Args: { p_id: string; p_ativo: boolean }
        Returns: boolean
      }
      update_categoria_item: {
        Args: { p_id: string; p_nome: string; p_descricao: string }
        Returns: boolean
      }
      update_comodo_item: {
        Args: { p_id: string; p_obrigatorio: boolean; p_ordem: number }
        Returns: boolean
      }
      update_comodo_master: {
        Args: {
          p_id: string
          p_nome: string
          p_descricao: string
          p_icone: string
        }
        Returns: boolean
      }
      update_item_inspecionavel: {
        Args: {
          p_id: string
          p_nome: string
          p_descricao: string
          p_categoria_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_action: "create" | "read" | "update" | "delete" | "approve" | "audit"
      app_module:
        | "usuarios"
        | "obras"
        | "fornecedores"
        | "inspections"
        | "reports"
        | "diagnostico"
        | "admin"
      app_role:
        | "admin"
        | "engenheiro_rt"
        | "mestre_obras"
        | "trabalhador"
        | "fornecedor"
        | "cliente"
        | "auditor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_action: ["create", "read", "update", "delete", "approve", "audit"],
      app_module: [
        "usuarios",
        "obras",
        "fornecedores",
        "inspections",
        "reports",
        "diagnostico",
        "admin",
      ],
      app_role: [
        "admin",
        "engenheiro_rt",
        "mestre_obras",
        "trabalhador",
        "fornecedor",
        "cliente",
        "auditor",
      ],
    },
  },
} as const
