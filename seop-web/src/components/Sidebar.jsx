import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
    LayoutDashboard, CalendarDays, BarChart3, PlusCircle, BookOpen,
    Calendar, UserPlus, LogOut, Megaphone, CreditCard, FileSignature, UserCog
} from 'lucide-react';

export function Sidebar() {
    const { user, signOut } = useContext(AuthContext);
    const location = useLocation();

    const role = user?.role;

    // Perfis
    const isStaff = ['ADMIN', 'COORDENADOR', 'SECRETARIA', 'PROFESSOR'].includes(role);
    const isAdmin = ['ADMIN', 'SECRETARIA'].includes(role); // Podem matricular
    const isSecretaria = ['ADMIN', 'SECRETARIA'].includes(role); // Podem emitir documentos
    const isParent = ['RESPONSAVEL', 'ALUNO'].includes(role);

    // Formata nome do cargo
    const getRoleName = (r) => {
        if (r === 'ADMIN') return 'Coordenação';
        if (r === 'SECRETARIA') return 'Secretaria';
        if (r === 'PROFESSOR') return 'Professor';
        if (r === 'RESPONSAVEL') return 'Responsável';
        if (r === 'ALUNO') return 'Estudante';
        return r;
    };

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

            {/* MENU SCROLLÁVEL */}
            <nav className="flex-1 py-6 overflow-y-auto space-y-1 custom-scrollbar">
                <div className="px-6 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Principal</div>
                <LinkItem to="/" icon={LayoutDashboard} label="Visão Geral" />
                <LinkItem to="/avisos" icon={Megaphone} label="Mural de Avisos" />

                {isStaff && (
                    <>
                        <div className="px-6 mt-8 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gestão</div>

                        {isAdmin && <LinkItem to="/matricula" icon={UserPlus} label="Nova Matrícula" />}

                        {/* Botão específico para secretaria */}
                        {isSecretaria && <LinkItem to="/meus-documentos" icon={FileSignature} label="Emissão de Docs" />}

                        <LinkItem to="/grade" icon={Calendar} label="Grade Horária" />
                        <LinkItem to="/chamada" icon={CalendarDays} label="Chamada Online" />
                        <LinkItem to="/desempenho" icon={BarChart3} label="Lançar Notas" />
                        <LinkItem to="/tarefas" icon={BookOpen} label="Gestão de Tarefas" />
                        <LinkItem to="/nova-ocorrencia" icon={PlusCircle} label="Ocorrência" />
                    </>
                )}

                {isParent && (
                    <>
                        <div className="px-6 mt-8 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aluno</div>
                        <LinkItem to="/tarefas" icon={BookOpen} label="Minhas Tarefas" />
                        <LinkItem to="/meus-documentos" icon={FileSignature} label="Emissão de Documentos" />
                        <LinkItem to="/minha-carteirinha" icon={CreditCard} label="Carteirinha Digital" />
                    </>
                )}
            </nav>

            {/* RODAPÉ DE USUÁRIO */}
            <div className="p-5 border-t border-slate-800 bg-[#020617]">

                {/* Info do Usuário */}
                <div className="flex items-center gap-3 mb-4 px-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-lg border-2 border-slate-800 text-white">
                        {user?.login?.substring(0,2).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate text-slate-200">{user?.login}</p>
                        <p className="text-[10px] text-slate-500 truncate uppercase font-bold tracking-wider flex items-center gap-1">
                            {getRoleName(role)} <span className="text-green-500 text-[6px]">●</span>
                        </p>
                    </div>
                </div>

                {/* Botões de Ação (Lado a Lado) - RESTAURADO */}
                <div className="grid grid-cols-2 gap-2">
                    <Link to="/perfil">
                        <button className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-400 rounded-lg text-xs font-bold transition border border-slate-700 group">
                            <UserCog size={14} className="group-hover:scale-110 transition-transform"/> Perfil
                        </button>
                    </Link>

                    <button onClick={signOut} className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-red-600 hover:text-white text-slate-400 rounded-lg text-xs font-bold transition border border-slate-700 group">
                        <LogOut size={14} className="group-hover:scale-110 transition-transform"/> Sair
                    </button>
                </div>

            </div>
        </aside>
    );
}