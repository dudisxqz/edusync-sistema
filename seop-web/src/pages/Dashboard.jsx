import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import {
    LayoutDashboard, Users, AlertTriangle, TrendingUp, Search, BookOpen,
    PlusCircle, LogOut, CalendarDays, FileText, BarChart3, GraduationCap, FileWarning, FileSignature, UserPlus
} from 'lucide-react';

const KPICard = ({ title, value, desc, color, icon: Icon }) => (
    <div className={`bg-white p-5 rounded-xl shadow-sm border-l-4 border-${color}-500 transition hover:shadow-md flex justify-between items-start`}>
        <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</div>
            <div className={`text-2xl font-extrabold text-${color}-600`}>{value}</div>
            <div className="text-xs text-gray-400 mt-1 font-medium">{desc}</div>
        </div>
        <div className={`p-2 bg-${color}-50 rounded-lg text-${color}-600`}>
            <Icon size={20} />
        </div>
    </div>
);

const LinhaAluno = ({ aluno }) => (
    <li className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition duration-150">
        <div className="p-4">
            <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-full shrink-0">
                    <GraduationCap size={18} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-800 text-sm truncate">{aluno.nome}</div>
                    <div className="text-xs text-gray-500 mt-0.5 flex flex-wrap items-center gap-2">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium whitespace-nowrap">{aluno.turma}</span>
                        <span className="text-gray-300">|</span>
                        <span className="truncate">Mat: {aluno.matricula}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Link to={`/boletim/aluno/${aluno.id}`}>
                    <button className="w-full flex justify-center items-center py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded shadow-sm transition active:scale-95 gap-1.5 uppercase tracking-wide h-full">
                        <FileText size={14} /> <span>Boletim</span>
                    </button>
                </Link>

                <Link to={`/frequencia/aluno/${aluno.id}`}>
                    <button className="w-full flex justify-center items-center py-2 bg-secondary-green hover:bg-green-700 text-white text-[10px] font-bold rounded shadow-sm transition active:scale-95 gap-1.5 uppercase tracking-wide h-full">
                        <CalendarDays size={14} /> <span>Freq.</span>
                    </button>
                </Link>

                <Link to={`/declaracao/aluno/${aluno.id}`}>
                    <button className="w-full flex justify-center items-center py-2 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold rounded shadow-sm transition active:scale-95 gap-1.5 uppercase tracking-wide h-full">
                        <FileSignature size={14} /> <span>Declar.</span>
                    </button>
                </Link>

                <Link to={`/tarefas/aluno/${aluno.id}`}>
                    <button className="w-full flex justify-center items-center py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-[10px] font-bold rounded shadow-sm transition active:scale-95 gap-1.5 uppercase tracking-wide h-full">
                        <BookOpen size={14} /> <span>Tarefas</span>
                    </button>
                </Link>
            </div>
        </div>
    </li>
);

function Dashboard() {
    const { user, signOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const [alunos, setAlunos] = useState([]);
    const [ocorrencias, setOcorrencias] = useState([]);
    const [notas, setNotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [abaAtiva, setAbaAtiva] = useState('pesquisa');
    const [busca, setBusca] = useState('');
    const [turmaAberta, setTurmaAberta] = useState(null);

    useEffect(() => {
        async function carregarDados() {
            try {
                const [respAlunos, respOcorrencias, respNotas] = await Promise.all([
                    api.get('/alunos'),
                    api.get('/ocorrencias'),
                    api.get('/notas')
                ]);
                setAlunos(respAlunos.data || []);
                setOcorrencias(respOcorrencias.data || []);
                setNotas(respNotas.data || []);
            } catch (erro) {
                console.error("Erro ao carregar dados:", erro);
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, []);

    // --- PERMISSÕES E ROLES (ATUALIZADO) ---
    // Lista de quem é "Equipe da Escola" (Vê tudo)
    const STAFF_ROLES = ['ADMIN', 'COORDENADOR', 'SECRETARIA', 'PROFESSOR'];
    const isStaff = STAFF_ROLES.includes(user?.role);

    // Quem pode Matricular? (Diretor e Secretaria)
    const canRegister = ['ADMIN', 'SECRETARIA'].includes(user?.role);

    // Lista de quem é "Família" (Vê só filhos)
    const isFamily = ['RESPONSAVEL', 'ALUNO'].includes(user?.role);

    // --- KPIs ---
    const totalAlunos = alunos.length;
    const hoje = new Date().toISOString().split('T')[0];
    const ocorrenciasHoje = ocorrencias.filter(o => o.dataCriacao && new Date(o.dataCriacao).toISOString().split('T')[0] === hoje).length;
    const mediaGeral = notas.length > 0 ? (notas.reduce((acc, n) => acc + (Number(n.valor) || 0), 0) / notas.length).toFixed(1) : "0.0";

    // --- FILTRAGEM ---
    const alunosVisiveis = isStaff
        ? alunos
        : alunos.filter(a => a.nome.includes("João Silva") || a.nome.includes("Maria Oliveira"));

    const alunosFiltrados = alunosVisiveis.filter(aluno =>
        aluno.nome && aluno.nome.toLowerCase().includes(busca.toLowerCase())
    );

    const turmasAgrupadas = alunosVisiveis.reduce((grupo, aluno) => {
        const turma = aluno.turma || "Sem Turma";
        if (!grupo[turma]) grupo[turma] = [];
        grupo[turma].push(aluno);
        return grupo;
    }, {});
    const listaDeTurmas = Object.keys(turmasAgrupadas).sort();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary-dark"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans">

            <nav className="bg-primary-dark text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <LayoutDashboard size={24} />
                            <div className="text-lg font-bold tracking-wide">EduSync</div>
                        </div>
                        {user && (
                            <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-white/10 text-[10px] font-medium backdrop-blur-sm border border-white/20">
                                <span className="opacity-75 mr-1">Olá,</span> {user.login} <span className="opacity-75 ml-1">({user.role})</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {isStaff && (
                            <div className="hidden md:flex gap-2">
                                {/* Botão Matrícula (Só Admin e Secretaria) */}
                                {canRegister && (
                                    <Link to="/matricula">
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs font-bold transition shadow-sm text-white">
                                            <UserPlus size={14} /> Matrícula
                                        </button>
                                    </Link>
                                )}

                                <Link to="/tarefas"><button className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 rounded text-xs font-bold transition shadow-sm text-white"><BookOpen size={14} /> Tarefas</button></Link>
                                <Link to="/chamada"><button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-xs font-bold transition shadow-sm"><CalendarDays size={14} /> Chamada</button></Link>
                                <Link to="/desempenho"><button className="flex items-center gap-1.5 px-3 py-1.5 bg-tertiary-info hover:bg-cyan-600 rounded text-xs font-bold transition shadow-sm"><BarChart3 size={14} /> Notas</button></Link>
                                <Link to="/nova-ocorrencia"><button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-xs font-bold transition shadow-sm"><PlusCircle size={14} /> Ocorrência</button></Link>
                            </div>
                        )}
                        <button onClick={signOut} className="flex items-center gap-1.5 px-3 py-1.5 bg-error-red hover:bg-red-600 rounded text-xs font-bold transition shadow-sm ml-1"><LogOut size={14} /> Sair</button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* KPIs (Só Staff vê) */}
                {isStaff && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <KPICard title="Total de Alunos" value={totalAlunos} desc="Matriculados" color="blue" icon={Users} />
                        <KPICard title="Ocorrências Hoje" value={ocorrenciasHoje} desc="Registros disciplinares" color="red" icon={FileWarning} />
                        <KPICard title="Média Geral" value={mediaGeral} desc="Desempenho Acadêmico" color="green" icon={TrendingUp} />
                    </div>
                )}

                <div className={`grid gap-6 ${isStaff ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 max-w-3xl mx-auto'}`}>

                    {/* COLUNA ESQUERDA: LISTA DE ALUNOS */}
                    <div className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 ${isStaff ? 'lg:col-span-1' : 'col-span-3 lg:col-span-2'}`}>
                        {isStaff ? (
                            <div className="flex border-b border-gray-100">
                                <button onClick={() => setAbaAtiva('pesquisa')} className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wide transition flex justify-center items-center gap-2 ${abaAtiva === 'pesquisa' ? 'text-primary-dark border-b-2 border-primary-dark bg-blue-50/50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
                                    <Search size={14} /> Pesquisa
                                </button>
                                <button onClick={() => setAbaAtiva('turmas')} className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wide transition flex justify-center items-center gap-2 ${abaAtiva === 'turmas' ? 'text-primary-dark border-b-2 border-primary-dark bg-blue-50/50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
                                    <BookOpen size={14} /> Turmas
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                                <Users className="text-primary-dark" size={20} />
                                <h3 className="text-base font-bold text-primary-dark">Estudantes Matriculados</h3>
                            </div>
                        )}

                        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                            {/* PESQUISA (STAFF) */}
                            {isStaff && abaAtiva === 'pesquisa' && (
                                <div className="p-3">
                                    <div className="relative mb-2">
                                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                        <input type="text" placeholder="Buscar aluno..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary-dark focus:border-primary-dark outline-none transition bg-gray-50 focus:bg-white" />
                                    </div>
                                    <ul className="mt-2">
                                        {busca.length > 0 && alunosFiltrados.map(aluno => <LinhaAluno key={aluno.id} aluno={aluno} />)}
                                        {busca.length > 0 && alunosFiltrados.length === 0 && <li className="text-center text-xs text-gray-500 py-6">Nenhum aluno encontrado.</li>}
                                    </ul>
                                </div>
                            )}

                            {/* TURMAS (STAFF) */}
                            {isStaff && abaAtiva === 'turmas' && (
                                <div className="divide-y divide-gray-100">
                                    {listaDeTurmas.map(turma => (
                                        <div key={turma}>
                                            <button onClick={() => setTurmaAberta(turmaAberta === turma ? null : turma)} className="w-full text-left p-3 flex justify-between items-center hover:bg-gray-50 transition group">
                                                <span className="font-bold text-gray-700 text-sm group-hover:text-primary-dark transition">{turma}</span>
                                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-blue-100 transition">
                          {turmasAgrupadas[turma].length} {turmaAberta === turma ? '▲' : '▼'}
                        </span>
                                            </button>
                                            {turmaAberta === turma && (
                                                <ul className="bg-gray-50 border-t border-gray-100 shadow-inner">
                                                    {turmasAgrupadas[turma].map(aluno => <LinhaAluno key={aluno.id} aluno={aluno} />)}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* LISTA FAMÍLIA */}
                            {isFamily && (
                                <ul className="divide-y divide-gray-100">
                                    {alunosVisiveis.length > 0 ? alunosVisiveis.map(aluno => <LinhaAluno key={aluno.id} aluno={aluno} />) : <li className="text-center py-10 text-gray-400">Nenhum estudante vinculado.</li>}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* DIREITA: OCORRÊNCIAS (Só Staff) */}
                    {isStaff && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 lg:col-span-2 flex flex-col h-[600px]">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="text-base font-bold text-gray-700 flex items-center gap-2">
                                    <AlertTriangle size={18} className="text-orange-500" /> Últimas Ocorrências
                                </h3>
                            </div>
                            <div className="overflow-y-auto flex-1 p-4 space-y-3 custom-scrollbar">
                                {ocorrencias.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                                        <FileWarning size={32} className="opacity-20" />
                                        <p className="text-sm">Nenhuma ocorrência registrada.</p>
                                    </div>
                                ) : (
                                    ocorrencias.map(oc => (
                                        <div key={oc.id} className="p-3 border border-gray-100 rounded-lg hover:shadow-md transition bg-white group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-800 text-sm">{oc.aluno?.nome}</span>
                                                    <span className="text-[10px] text-gray-400">• {oc.aluno?.turma}</span>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border
                          ${oc.tipo === 'AGRESSAO' ? 'bg-red-50 text-red-700 border-red-100' :
                                                    oc.tipo === 'COMPORTAMENTO' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                        'bg-blue-50 text-blue-700 border-blue-100'}`}>
                          {oc.tipo}
                        </span>
                                            </div>
                                            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2 rounded border border-gray-50 italic">"{oc.descricao}"</p>
                                            <div className="text-[10px] text-gray-400 mt-2 text-right font-medium flex justify-end items-center gap-1">
                                                <CalendarDays size={10} />
                                                {new Date(oc.dataCriacao).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Dashboard;