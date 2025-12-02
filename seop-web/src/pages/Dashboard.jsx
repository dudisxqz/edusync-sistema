import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar';
import {
    Users, AlertTriangle, TrendingUp, Search, BookOpen,
    CalendarDays, FileText, GraduationCap, FileWarning, FileSignature, UserPlus, Calendar, BarChart3
} from 'lucide-react';

// --- COMPONENTE: CARD DE INDICADORES (KPI) ---
const KPICard = ({ title, value, desc, color, icon: Icon }) => {
    const styles = {
        blue: { border: 'border-blue-600', text: 'text-blue-600', bg: 'bg-blue-50' },
        red: { border: 'border-red-500', text: 'text-red-500', bg: 'bg-red-50' },
        green: { border: 'border-green-500', text: 'text-green-500', bg: 'bg-green-50' }
    };
    const currentStyle = styles[color] || styles.blue;

    return (
        <div className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${currentStyle.border} transition hover:shadow-md flex justify-between items-start`}>
            <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</div>
                <div className={`text-2xl font-extrabold ${currentStyle.text}`}>{value}</div>
                <div className="text-xs text-gray-400 mt-1 font-medium">{desc}</div>
            </div>
            <div className={`p-2 ${currentStyle.bg} rounded-lg ${currentStyle.text}`}>
                <Icon size={20} />
            </div>
        </div>
    );
};

// --- COMPONENTE: LINHA DO ALUNO ---
const LinhaAluno = ({ aluno }) => {
    if (!aluno) return null;
    return (
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
                        <button className="w-full flex justify-center items-center py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded shadow-sm transition active:scale-95 gap-1 uppercase tracking-wide h-full">
                            <FileText size={12} /> <span>Boletim</span>
                        </button>
                    </Link>

                    <Link to={`/frequencia/aluno/${aluno.id}`}>
                        <button className="w-full flex justify-center items-center py-1.5 bg-secondary-green hover:bg-green-700 text-white text-[10px] font-bold rounded shadow-sm transition active:scale-95 gap-1 uppercase tracking-wide h-full">
                            <CalendarDays size={12} /> <span>Freq.</span>
                        </button>
                    </Link>

                    <Link to={`/declaracao/aluno/${aluno.id}`}>
                        <button className="w-full flex justify-center items-center py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold rounded shadow-sm transition active:scale-95 gap-1 uppercase tracking-wide h-full">
                            <FileSignature size={12} /> <span>Declar.</span>
                        </button>
                    </Link>

                    <Link to={`/tarefas/aluno/${aluno.id}`}>
                        <button className="w-full flex justify-center items-center py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-[10px] font-bold rounded shadow-sm transition active:scale-95 gap-1 uppercase tracking-wide h-full">
                            <BookOpen size={12} /> <span>Tarefas</span>
                        </button>
                    </Link>
                </div>
            </div>
        </li>
    );
};

function Dashboard() {
    const { user, signOut } = useContext(AuthContext);
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

    const role = user?.role;
    const isStaff = ['ADMIN', 'COORDENADOR', 'SECRETARIA', 'PROFESSOR'].includes(role);
    const isParent = ['RESPONSAVEL', 'ALUNO'].includes(role);

    const totalAlunos = alunos.length;
    const hoje = new Date().toISOString().split('T')[0];
    const ocorrenciasHoje = ocorrencias.filter(o => o.dataCriacao && o.dataCriacao.startsWith(hoje)).length;
    const mediaGeral = notas.length > 0 ? (notas.reduce((acc, n) => acc + (Number(n.valor) || 0), 0) / notas.length).toFixed(1) : "0.0";

    // Definição de 'meusFilhos' ANTES de usar
    const meusFilhos = alunos.filter(a => a.nome.includes("João Silva") || a.nome.includes("Maria Oliveira"));
    const alunosVisiveis = isStaff ? alunos : meusFilhos;
    const alunosFiltrados = alunosVisiveis.filter(aluno => aluno.nome && aluno.nome.toLowerCase().includes(busca.toLowerCase()));

    const turmasAgrupadas = alunosVisiveis.reduce((grupo, aluno) => {
        const turma = aluno.turma || "Sem Turma";
        if (!grupo[turma]) grupo[turma] = [];
        grupo[turma].push(aluno);
        return grupo;
    }, {});

    const listaDeTurmas = Object.keys(turmasAgrupadas).sort();

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500">Carregando...</div>;

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Visão Geral</h1>
                        <p className="text-gray-500 mt-1 font-medium">Olá, {user?.login}. Bem-vindo ao EduSync.</p>
                    </div>
                </header>

                {isStaff && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <KPICard title="Total Alunos" value={totalAlunos} desc="Matriculados" color="blue" icon={Users} />
                        <KPICard title="Ocorrências" value={ocorrenciasHoje} desc="Hoje" color="red" icon={FileWarning} />
                        <KPICard title="Média Geral" value={mediaGeral} desc="Desempenho" color="green" icon={TrendingUp} />
                    </div>
                )}

                <div className={`grid gap-8 ${isStaff ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
                    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px] ${isStaff ? 'lg:col-span-1' : 'col-span-3 lg:col-span-2'}`}>

                        {isStaff ? (
                            <div className="flex border-b border-gray-100 shrink-0">
                                <button onClick={() => setAbaAtiva('pesquisa')} className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wide transition ${abaAtiva === 'pesquisa' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-400 hover:text-gray-600'}`}>
                                    Pesquisa
                                </button>
                                <button onClick={() => setAbaAtiva('turmas')} className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wide transition ${abaAtiva === 'turmas' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-400 hover:text-gray-600'}`}>
                                    Turmas
                                </button>
                            </div>
                        ) : (
                            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-3 shrink-0">
                                <Users className="text-primary-dark" size={20} />
                                <h3 className="text-lg font-bold text-primary-dark">Meus Filhos</h3>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {isStaff && abaAtiva === 'pesquisa' && (
                                <div className="p-4">
                                    <div className="relative mb-4">
                                        <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                                        <input type="text" placeholder="Buscar aluno..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 focus:bg-white" />
                                    </div>
                                    <ul>{alunosFiltrados.length > 0 && alunosFiltrados.map(aluno => <LinhaAluno key={aluno.id} aluno={aluno} />)}</ul>
                                </div>
                            )}

                            {isStaff && abaAtiva === 'turmas' && (
                                <div className="divide-y divide-gray-100">
                                    {listaDeTurmas.map(turma => (
                                        <div key={turma}>
                                            <button onClick={() => setTurmaAberta(turmaAberta === turma ? null : turma)} className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 transition group">
                                                <span className="font-bold text-gray-700 text-sm group-hover:text-blue-600 transition">{turma}</span>
                                                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition">{turmasAgrupadas[turma].length} alunos {turmaAberta === turma ? '▲' : '▼'}</span>
                                            </button>
                                            {turmaAberta === turma && <ul className="bg-gray-50 border-t border-gray-100 shadow-inner">{turmasAgrupadas[turma].map(aluno => <LinhaAluno key={aluno.id} aluno={aluno} />)}</ul>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {isParent && (
                                <ul className="divide-y divide-gray-100">
                                    {alunosVisiveis.length > 0 ? alunosVisiveis.map(aluno => <LinhaAluno key={aluno.id} aluno={aluno} />) : <li className="text-center py-10 text-gray-400 flex flex-col items-center gap-2"><Users size={32} className="opacity-20" /><span>Nenhum estudante vinculado.</span></li>}
                                </ul>
                            )}
                        </div>
                    </div>

                    {isStaff && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2 flex flex-col h-[600px]">
                            <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center shrink-0">
                                <h3 className="text-base font-bold text-gray-700 flex items-center gap-2"><AlertTriangle size={18} className="text-orange-500" /> Últimas Ocorrências</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                                {ocorrencias.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2"><FileWarning size={32} className="opacity-20" /><p className="text-sm">Nenhuma ocorrência registrada.</p></div>
                                ) : (
                                    ocorrencias.map(oc => (
                                        <div key={oc.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-sm transition bg-white group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-800 text-sm">{oc.aluno?.nome}</span>
                                                    <span className="text-[10px] text-gray-400">• {oc.aluno?.turma}</span>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border ${oc.tipo === 'AGRESSAO' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{oc.tipo}</span>
                                            </div>
                                            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-50 italic">"{oc.descricao}"</p>
                                            <div className="text-[10px] text-gray-400 mt-2 text-right font-medium flex justify-end items-center gap-1"><CalendarDays size={10} />{new Date(oc.dataCriacao).toLocaleDateString('pt-BR')}</div>
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