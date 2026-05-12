import { Database } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
                <Database className="w-8 h-8 text-primary" />
                Academic Analytics Dashboard
            </h1>
            <p className="text-text-muted mt-1">
                University strategic metrics
            </p>
        </div>
    </div>
  )
}
