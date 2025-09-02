import { create } from 'zustand';

export type Energia =
  | 'Alta Inspiração'
  | 'Guiada pelo Campo'
  | 'Resistência'
  | 'Neutro'
  | 'Expansão';
export type Status =
  | 'Planejado'
  | 'Em Andamento'
  | 'Aguardando'
  | 'Concluído';
export type Tipo =
  | 'Publicação'
  | 'Pesquisa'
  | 'Desenvolvimento'
  | 'Reconhecimento'
  | 'APP/Tech';

export interface Projeto {
  id: string;
  nome: string; // "Nome do Projeto"
  tipo: Tipo; // "Tipo de Projeto"
  energia: Energia; // "Energia Atual"
  prioridade: 'Alta' | 'Média' | 'Baixa';
  prazo?: string; // ISO date
  responsavel?: string;
  proximosPassos?: string;
  observacoes?: string;
  conexoes?: string;
  status: Status;
}

interface State {
  projetos: Projeto[];
  set: (p: Projeto[]) => void;
}

export const useProjects = create<State>((set) => ({
  projetos: [],
  set: (projetos) => set({ projetos }),
}));
