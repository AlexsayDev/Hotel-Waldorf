import React from 'react'

const StatCard = ({ title, value, helper, icon: Icon }) => {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-slate-500">{title}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
                    <p className="mt-1 text-sm text-slate-500">{helper}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3">
                    <Icon className="h-5 w-5 text-slate-700" />
                </div>
            </div>
        </div>
    )
}

export default StatCard
