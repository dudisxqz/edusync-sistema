import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
    LayoutDashboard, CalendarDays, BarChart3, PlusCircle, BookOpen,
    Calendar, UserPlus, LogOut, Megaphone, CreditCard
} from 'lucide-react';

export function Sidebar() {
    const { user, signOut } = useContext(AuthContext);
    const location = useLocation();

    const role = user?.role;
    const isStaff = ['ADMIN', 'COORDENADOR', 'SECRETARIA', 'PROFESSOR'].includes(role);
    const isAdmin = ['ADMIN', 'SECRETARIA'].includes(role);
    const isParent = ['RESPONSAVEL', 'ALUNO'].includes(role);

    const isActive = (path) => location.pathname === path
        ? "bg-blue-600/10 text-blue-400 border-r-4 border-blue-500"
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100";

    const LinkItem = ({ to, icon: Icon, label }) => (
        <Link to={to} className={`flex items-center gap-3 px-6 py-3.5 transition-all duration-200 group ${isActive(to)}`}>
            <Icon size={20} className={`transition-colors ${isActive(to) ? "text-blue-400" : "group-hover:text-white"}`} />
            <span className="font-medium text-sm tracking-wide">{label}</span>
        </Link>
    );

    return (
        <aside className="w-64 bg-[#0f172a] text-white flex-shrink-0 hidden md:flex flex-col h-screen fixed left-0 top-0 shadow-2xl z-50 font-sans">

            {/* LOGO */}
            <div className="h-20 flex items-center px-8 border-b border-slate-800 bg-[#020617]">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-900/20">
                    <LayoutDashboard className="text-white" size={18} />
                </div>
                <span className="text-xl font-bold tracking-wider text-slate-100">EduSync</span>
            </div>

            {/* MENU */}
            <nav className="flex-1 py-6 overflow-y-auto space-y-1 custom-scrollbar">
                <div className="px-6 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Principal</div>
                {/* eslint-disable-next-line react-hooks/static-components */}
                <LinkItem to="/" icon={LayoutDashboard} label="Visão Geral" />
                {/* eslint-disable-next-line react-hooks/static-components */}
                <LinkItem to="/avisos" icon={Megaphone} label="Mural de Avisos" />

                {isStaff && (
                    <>
                        <div className="px-6 mt-8 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gestão</div>
                        {/* eslint-disable-next-line react-hooks/static-components */}
                        {isAdmin && <LinkItem to="/matricula" icon={UserPlus} label="Matrícula" />}
                        {/* eslint-disable-next-line react-hooks/static-components */}
                        <LinkItem to="/chamada" icon={CalendarDays} label="Chamada Online" />
                        {/* eslint-disable-next-line react-hooks/static-components */}
                        <LinkItem to="/desempenho" icon={BarChart3} label="Lançar Notas" />
                        {/* eslint-disable-next-line react-hooks/static-components */}
                        <LinkItem to="/tarefas" icon={BookOpen} label="Gestão de Tarefas" />
                        {/* eslint-disable-next-line react-hooks/static-components */}
                        <LinkItem to="/grade" icon={Calendar} label="Grade Horária" />
                        {/* eslint-disable-next-line react-hooks/static-components */}
                        <LinkItem to="/nova-ocorrencia" icon={PlusCircle} label="Ocorrência" />
                    </>
                )}

                {isParent && (
                    <>
                        <div className="px-6 mt-8 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aluno</div>
                        {/* eslint-disable-next-line react-hooks/static-components */}
                        <LinkItem to="/tarefas" icon={BookOpen} label="Minhas Tarefas" />
                        {/* eslint-disable-next-line react-hooks/static-components */}
                        <LinkItem to="/minha-carteirinha" icon={CreditCard} label="Carteirinha Digital" />
                    </>
                )}
            </nav>

            {/* RODAPÉ USER (Clicável agora) */}
            <div className="p-6 border-t border-slate-800 bg-[#020617]">

                {/* Link para o Perfil */}
                <Link to="/perfil" className="flex items-center gap-3 mb-4 p-2 -mx-2 rounded-lg hover:bg-white/5 transition group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-lg border-2 border-slate-800 group-hover:border-blue-400 transition">
                        {user?.login?.substring(0,2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate text-slate-200 group-hover:text-white">{user?.login}</p>
                        <p className="text-[10px] text-slate-500 truncate uppercase font-bold tracking-wider">Meu Perfil</p>
                    </div>
                </Link>

                <button onClick={signOut} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 rounded-lg text-xs font-bold transition border border-slate-700 hover:border-red-500/50">
                    <LogOut size={16} /> ENCERRAR SESSÃO
                </button>
            </div>
        </aside>
    );
}