import type { ReactNode } from 'react';
import { Activity, Menu, Filter } from 'lucide-react';
import { useState } from 'react';

interface Props{
    children: ReactNode;
    filters: ReactNode;
}

function DashboardLayout({children, filters}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className={`w-full md:w-72 bg-surface border-r border-slate-200 p-6 flex flex-col sticky top-0 h-screen overflow-y-auto ${
        sidebarOpen ? 'block' : 'hidden md:flex'
      }`}>
        <div className="flex items-center gap-3 mb-8 text-text-main">
          <Activity className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">DEI Analytics</span>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2 mb-8">
            <li>
              <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-primary rounded-lg font-medium border border-blue-200 hover:bg-blue-100 transition-colors">
                <span>Dashboard</span>
              </a>
            </li>
          </ul>
          
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center gap-2 mb-4 text-text-main font-medium">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </div>
            {filters}
          </div>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-slate-200">
          <p className="text-xs text-text-muted text-center">© 2026 Universidad</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-surface border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-main">
          <Activity className="w-6 h-6 text-primary" />
          <span className="font-bold">DEI Analytics</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-text-muted hover:text-text-main"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout