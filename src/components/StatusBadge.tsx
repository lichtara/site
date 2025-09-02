export default function StatusBadge({ v }: { v: string }) {
  const map: Record<string, string> = {
    Planejado: 'bg-gray-200 text-gray-900',
    'Em Andamento': 'bg-blue-600 text-white',
    Aguardando: 'bg-orange-500 text-white',
    Concluído: 'bg-green-600 text-white',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${map[v] || 'bg-gray-200'}`}>{
      v
    }</span>
  );
}
