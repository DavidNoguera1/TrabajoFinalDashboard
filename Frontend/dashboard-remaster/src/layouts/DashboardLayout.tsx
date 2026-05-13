import { Activity, Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

interface Props {
  sidebar: ReactNode;
  children: ReactNode;
}

export default function DashboardLayout({ sidebar, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar — desktop */}
      <aside className="hidden w-72 flex-shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="sticky top-0 flex h-screen flex-col overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">DEI Analytics</p>
              <p className="text-[10px] text-slate-400">Dashboard académico</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex-1 overflow-y-auto px-5 py-5">{sidebar}</div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-6 py-4">
            <p className="text-[11px] text-slate-400">© 2026 Universidad Mariana</p>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-800">DEI Analytics</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-20 flex md:hidden">
          <div className="w-72 overflow-y-auto bg-white px-5 py-5 pt-16 shadow-xl">
            {sidebar}
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-4 py-6 pt-16 md:px-8 md:pt-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
