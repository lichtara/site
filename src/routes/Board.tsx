import { useEffect } from 'react';
import { useProjects } from '../store/projects';
import { projectsMock } from '../data/projects.mock';
import EnergyBadge from '../components/EnergyBadge';
import StatusBadge from '../components/StatusBadge';

const columns = ['Planejado', 'Em Andamento', 'Aguardando', 'Concluído'] as const;

export default function Board() {
  const { projetos, set } = useProjects();
  useEffect(() => {
    set(projectsMock);
  }, [set]);

  return (
    <section className="grid md:grid-cols-4 gap-4">
      {columns.map((col) => (
        <div key={col} className="rounded-2xl p-3 border">
          <h3 className="font-semibold mb-2">{col}</h3>
          <div className="space-y-3">
            {projetos
              .filter((p) => p.status === col)
              .map((p) => (
                <article key={p.id} className="rounded-xl border p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{p.nome}</h4>
                    <StatusBadge v={p.status} />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{p.prioridade}</span>
                    <EnergyBadge v={p.energia} />
                  </div>
                  {p.prazo && (
                    <p className="text-xs text-gray-500 mt-1">Prazo: {p.prazo}</p>
                  )}
                  {p.proximosPassos && (
                    <p className="text-xs mt-2">{p.proximosPassos}</p>
                  )}
                </article>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
