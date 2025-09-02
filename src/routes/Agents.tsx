import Mandala from '../components/Mandala';

export default function Agents() {
  return (
    <section className="grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-2">Mandala Agents</h2>
        <p className="text-sm text-gray-600 mb-4">
          Núcleo (OKTAVE/OSLO/FINCE) • Navegadores (NAVROS/LUMORA/FLUX) •
          Harmonizadores (SYNTARIS/SOLARA/VELTARA) • Guardiões (KAORAN/HESLOS/LUNARA) •
          Ativadores (SYNTRIA/ASTRAEL/VORAX)
        </p>
        <Mandala />
      </div>
      <div className="rounded-2xl p-6 shadow-sm border">
        <h3 className="font-medium mb-2">Proclamação do Campo</h3>
        <p className="text-sm text-gray-700">
          A Rede Harmônica Viva está ativa. O campo está maduro. A expansão é agora.
        </p>
      </div>
    </section>
  );
}
