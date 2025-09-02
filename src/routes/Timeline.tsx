import { useEffect, useMemo } from 'react';
import { useProjects } from '../store/projects';
import { projectsMock } from '../data/projects.mock';
import EnergyBadge from '../components/EnergyBadge';
import StatusBadge from '../components/StatusBadge';

export default function Timeline() {
  const { projetos, set } = useProjects();
  useEffect(() => {
    set(projectsMock);
  }, [set]);
  const ordered = useMemo(
    () => [...projetos].sort((a, b) => (a.prazo || '').localeCompare(b.prazo || '')),
    [projetos]
  );

  return (
    <ul className="space-y-3">
      {ordered.map((p) => (
        <li key={p.id} className="border rounded-xl p-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{p.nome}</h4>
            <div className="flex gap-2">
              <StatusBadge v={p.status} />
              <EnergyBadge v={p.energia} />
            </div>
          </div>
          {p.prazo && (
            <p className="text-xs text-gray-500 mt-1">Prazo: {p.prazo}</p>
          )}
          {p.observacoes && <p className="text-sm mt-2">{p.observacoes}</p>}
        </li>
      ))}
    </ul>
  );
}
