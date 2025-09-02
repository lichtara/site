export default function EnergyBadge({ v }: { v: string }) {
  const map: Record<string, string> = {
    'Alta Inspiração': 'bg-green-100 text-green-800',
    'Guiada pelo Campo': 'bg-blue-100 text-blue-800',
    Resistência: 'bg-red-100 text-red-800',
    Neutro: 'bg-gray-100 text-gray-800',
    Expansão: 'bg-purple-100 text-purple-800',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${map[v] || 'bg-gray-100'}`}>{
      v
    }</span>
  );
}
