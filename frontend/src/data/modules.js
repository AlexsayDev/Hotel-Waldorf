import { Users, LayoutDashboard, BedDouble, Search, CalendarDays, CreditCard, Tags, BarChart3, Settings} from 'lucide-react';
export const modules = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, enabled: false },
    { key: 'usuarios', label: 'Usuarios', icon: Users, enabled: true },
    { key: 'habitaciones', label: 'Habitaciones', icon: BedDouble, enabled: true },
    { key: 'disponibilidad', label: 'Disponibilidad', icon: Search, enabled: true },
    { key: 'reservas', label: 'Reservas', icon: CalendarDays, enabled: false },
    { key: 'pagos', label: 'Pagos', icon: CreditCard, enabled: false },
    { key: 'temporadas', label: 'Temporadas', icon: Tags, enabled: false },
    { key: 'reportes', label: 'Reportes', icon: BarChart3, enabled: false },
    { key: 'configuracion', label: 'Configuración', icon: Settings, enabled: false },
];