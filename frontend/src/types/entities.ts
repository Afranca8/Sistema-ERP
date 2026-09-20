// ========================================
// DIAGRAMA DE CLASSES — OFICINA MECÂNICA
// ========================================

// ── USUÁRIO (abstrato) ──
export interface Usuario {
  ID_Usuario: number;
  Nome: string;
  Login: string;
  Senha: string;
}

// ── PERFIS (herdam de Usuario) ──
export interface Administrador extends Usuario {
  ID_NivelAcesso: number;
}

export interface Atendente extends Usuario {
  ID_MATRICULA: number;
}

export interface Mecanico extends Usuario {
  ID_MATRICULA: number;
  Especialidade: string;
}

// ── MODELO ──
export interface Modelo {
  ID_Modelo: number;
  Marca: string;
  Modelo: string;
}

// ── VEÍCULO ──
export interface Veiculo {
  ID_Veiculo: number;
  Placa: string;
  Quilometragem: number; // DECIMAL
  ID_Modelo: number; // FK → Modelo
  ID_Cliente: number; // FK → Cliente
}

// ── CLIENTE ──
export interface Cliente {
  ID_Cliente: number;
  Nome: string;
  Telefone: string;
  Endereco: string;
}

// ── ORÇAMENTO ──
export interface Orcamento {
  ID_Orcamento: number;
  Valor_Total: number; // DECIMAL
  Status: string;
  Data_Aprovacao: Date | null;
  ID_Cliente: number | null; // FK → Cliente (0..1)
}

// ── ORDEM DE SERVIÇO ──
export interface OrdemServico {
  ID_OS: number;
  Data_Abertura: Date;
  Status_Orcamento: string;
  Status_OS: string;
  Data_Fechamento: Date | null;
  Problema_Relatado: string; // Campo que faltava!
  ID_Cliente: number; // FK → Cliente
  ID_Veiculo: number; // FK → Veiculo
  ID_Orcamento: number | null; // FK → Orcamento (0..1)
}

// ── SERVIÇO ── (relacionamento Contém 1..* OrdemServico ↔ 1..* Servico)
export interface Servico {
  ID_Servico: number;
  Descricao: string;
  Hora_Max_Obra: number; // DECIMAL
  Custo_Unitario: number; // DECIMAL
  Data_Execucao: Date | null; // Campo questionável, mas está no diagrama
}

// ── PEÇA ──
export interface Peca {
  ID_Peca: number;
  Descricao: string;
  Quantidade_Disponivel: number; // DOUBLE
  Estoque_Minimo: number;
  Valor_Unitario: number; // DECIMAL
  ID_Fornecedor: number; // FK → Fornecedor
}

// ── PAGAMENTO ──
export interface Pagamento {
  ID_Pagamento: number;
  Valor: string;
  Forma_Pagamento: string;
  Parcelas: number;
  ID_OS: number; // FK → OrdemServico
}

// ── RELACIONAMENTOS ──

// HISTORICO: Cliente 1 ←→ * Veiculo (já em Veiculo.ID_Cliente)

// SOLICITA: Cliente 1 ←→ 0..1 Orcamento (já em Orcamento.ID_Cliente)

// GERA: Orcamento 0..1 ←→ * OrdemServico (já em OrdemServico.ID_Orcamento)

// VINCULA: Peca 1..* ↔ 1..* OrdemServico (tabela de junção)
export interface VinculaPeca {
  ID_OS: number;
  ID_Peca: number;
  Quantidade: number;
}

// CONTÉM: OrdemServico 1..* ↔ 1..* Servico (tabela de junção)
export interface ContemServico {
  ID_OS: number;
  ID_Servico: number;
  Quantidade: number;
}

// EXECUTA: Mecanico * ←→ * OrdemServico (relacionamento via execução)
export interface ExecutaOS {
  ID_MATRICULA: number; // FK → Mecanico
  ID_OS: number; // FK → OrdemServico
}