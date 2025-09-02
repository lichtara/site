import { NavLink, Outlet } from 'react-router-dom';

export default function App() {
  const link = 'px-3 py-2 rounded-xl hover:bg-gray-100 transition';
  const active = 'bg-gray-900 text-white hover:bg-gray-900';
  return (
    <div className="min-h-full p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Lichtara OS • MVP</h1>
        <nav className="flex gap-2">
          <NavLink to="/" end className={({ isActive }) => `${link} ${isActive ? active : ''}`}>Agents</NavLink>
          <NavLink to="/board" className={({ isActive }) => `${link} ${isActive ? active : ''}`}>Board</NavLink>
          <NavLink to="/timeline" className={({ isActive }) => `${link} ${isActive ? active : ''}`}>Timeline</NavLink>
        </nav>
      </header>
      <main className="max-w-6xl mx-auto mt-6">
        <Outlet />
      </main>
    </div>
  );
}
