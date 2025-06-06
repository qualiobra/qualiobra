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
      comodos_tipologia: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          tipologia_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          tipologia_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          tipologia_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_comodos_tipologia_tipologia_id"
            columns: ["tipologia_id"]
            isOneToOne: false
            referencedRelation: "tipologias"
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_comodo_master: {
        Args: { p_nome: string; p_descricao: string; p_icone: string }
        Returns: string
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
      toggle_comodo_master: {
        Args: { p_id: string; p_ativo: boolean }
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
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
