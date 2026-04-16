import { modules } from '../../data/modules.js'

const Sidebar = ({ activeModule, onSelect }) => {
    return (
        <aside className="w-full rounded-3xl bg-slate-900 p-5 text-white shadow-xl lg:w-72">
            <div className="mb-8 border-b border-slate-700 pb-5">
                {/**<p className="text-xs uppercase tracking-[0.2em] text-slate-400">Hotel Waldorf</p> */}
                <h1 className="mt-2 text-2xl font-bold">Hotel Waldorf</h1>
                {/**<p className="mt-2 text-sm text-slate-400">Panel de gestión del hotel</p> */}
            </div>

            <nav className="space-y-2">
                {modules.map((module) => {
                    const Icon = module.icon;
                    const isActive = activeModule === module.key;

                    return (
                        <button
                            key={module.key}
                            type="button"
                            onClick={() => onSelect(module.key)}
                            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition ${isActive
                                    ? 'bg-white text-slate-900'
                                    : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
                                }`}
                        >
                            <span className="flex items-center gap-3">
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{module.label}</span>
                            </span>
                            {!module.enabled && (
                                <span className="rounded-full bg-red-600 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-300">
                                    Próximo
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </aside>
    )
}

export default Sidebar
