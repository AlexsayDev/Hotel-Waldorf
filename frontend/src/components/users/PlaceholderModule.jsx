

const PlaceholderModule = ({ title, description, icon: Icon }) => {
    return (
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-slate-100 p-4">
                    <Icon className="h-7 w-7 text-slate-700" />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
                    <p className="mt-1 text-slate-500">{description}</p>
                </div>
            </div>
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                Este módulo está preparado en el sidebar para desarrollarse en las siguientes fases del proyecto.
            </div>
        </div>
    )
}

export default PlaceholderModule
