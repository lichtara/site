import { Projeto } from '../store/projects';

export const projectsMock: Projeto[] = [
  {
    id: 'app-apis',
    nome: 'APP – Integração de APIs (Lichtara OS – Módulo Inicial)',
    tipo: 'APP/Tech',
    energia: 'Alta Inspiração',
    prioridade: 'Alta',
    prazo: '2025-10-31',
    responsavel: 'Débora',
    proximosPassos:
      'Definir MVP; mapear rotas; orquestração FLUX; logs KAORAN',
    observacoes: 'Agents avançam após entrega do manual; manter ritmo canalizado.',
    conexoes: 'Livro Fio Condutor; Pesquisa BRH; Reconhecimento RH',
    status: 'Em Andamento',
  },
  {
    id: 'livro-fio',
    nome: 'Livro — O Fio Condutor',
    tipo: 'Publicação',
    energia: 'Guiada pelo Campo',
    prioridade: 'Média',
    observacoes: 'Síntese após MVP do APP',
    status: 'Aguardando',
  },
  {
    id: 'pesquisa-brh',
    nome: 'Pesquisa — Bio-Ressonância Harmônica',
    tipo: 'Pesquisa',
    energia: 'Expansão',
    prioridade: 'Alta',
    status: 'Em Andamento',
  },
];
