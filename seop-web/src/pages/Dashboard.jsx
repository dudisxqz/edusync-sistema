import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { Users, AlertTriangle, TrendingUp, Search, BookOpen, CalendarDays, FileText, GraduationCap, FileWarning, FileSignature, UserPlus, Calendar } from 'lucide-react';

const KPICard = ({ title, value, desc, color, icon: Icon }) => {
    const styles = { blue: 'border-blue-600 text-blue-600 bg-blue-50', red: 'border-red-500 text-red-500 bg-red-50', green: 'border-green-500 text-green-500 bg-green-50' };
    const s = styles[color] || styles.blue;
    return (
        <div className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${s.split(' ')[0]} flex justify-between items-start`}>
            <div><div className="text-xs font-bold text-gray-400 uppercase">{title}</div><div className={`text-2xl font-extrabold ${s.split(' ')[1]}`}>{value}</div><div className="text-xs text-gray-400 mt-1">{desc}</div></div>
            <div className={`p-2 rounded-lg ${s.split(' ').slice(1).join(' ')}`}><Icon size={20} /></div>
        </div>
    );
};

const LinhaAluno = ({ aluno }) => (
    <li className="border-b border-gray-100 last:border-0 hover:bg-gray-50 p-4">
        <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-full"><GraduationCap size={18} /></div>
            <div className="min-w-0 flex-1"><div className="font-bold text-gray-800 text-sm truncate">{aluno.nome}</div><div className="text-xs text-gray-500 mt-0.5">{aluno.turma} | Mat: {aluno.matricula}</div></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Link to={`/boletim/aluno/${aluno.id}`}><button className="w-full flex justify-center py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded hover:bg-blue-700 flex items-center gap-1"><FileText size={12}/>Boletim</button></Link>
            <Link to={`/frequencia/aluno/${aluno.id}`}><button className="w-full flex justify-center py-1.5 bg-green-600 text-white text-[10px] font-bold rounded hover:bg-green-700 flex items-center gap-1"><CalendarDays size={12}/>Freq.</button></Link>
            <Link to={`/declaracao/aluno/${aluno.id}`}><button className="w-full flex justify-center py-1.5 bg-orange-500 text-white text-[10px] font-bold rounded hover:bg-orange-600 flex items-center gap-1"><FileSignature size={12}/>Declar.</button></Link>
            <Link to={`/tarefas/aluno/${aluno.id}`}><button className="w-full flex justify-center py-1.5 bg-yellow-500 text-white text-[10px] font-bold rounded hover:bg-yellow-600 flex items-center gap-1"><BookOpen size={12}/>Tarefas</button></Link>
        </div>
    </li>
);

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
        async function carregar() {
            try {
                const [r1, r2, r3] = await Promise.all([api.get('/alunos'), api.get('/ocorrencias'), api.get('/notas')]);
                setAlunos(r1.data||[]); setOcorrencias(r2.data||[]); setNotas(r3.data||[]);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        }
        carregar();
    }, []);

    const isStaff = ['ADMIN', 'COORDENADOR', 'SECRETARIA', 'PROFESSOR'].includes(user?.role);
    const isParent = !isStaff;

    const meusFilhos = alunos.filter(a => a.nome.includes("João") || a.nome.includes("Maria"));
    const listaAlunos = isStaff ? alunos : meusFilhos;
    const alunosFiltrados = listaAlunos.filter(a => a.nome.toLowerCase().includes(busca.toLowerCase()));

    const turmasAgrupadas = listaAlunos.reduce((g, a) => { (g[a.turma] = g[a.turma] || []).push(a); return g; }, {});
    const listaTurmas = Object.keys(turmasAgrupadas).sort();

    if (loading) return <div className="h-screen flex items-center justify-center">Carregando...</div>;

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">
                <header className="mb-8 flex justify-between items-end">
                    <div><h1 className="text-3xl font-black text-gray-800">Visão Geral</h1><p className="text-gray-500">Olá, {user?.login}.</p></div>
                </header>

                {isStaff && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <KPICard title="Total Alunos" value={alunos.length} desc="Matriculados" color="blue" icon={Users} />
                        <KPICard title="Ocorrências" value={ocorrencias.length} desc="Total" color="red" icon={FileWarning} />
                        <KPICard title="Média Geral" value="7.5" desc="Estimada" color="green" icon={TrendingUp} />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2 h-[600px] flex flex-col">
                        <div className="flex border-b border-gray-100">
                            <button onClick={()=>setAbaAtiva('pesquisa')} className={`flex-1 py-3 font-bold text-sm ${abaAtiva==='pesquisa'?'text-blue-600 border-b-2 border-blue-600':'text-gray-400'}`}>Pesquisa</button>
                            {isStaff && <button onClick={()=>setAbaAtiva('turmas')} className={`flex-1 py-3 font-bold text-sm ${abaAtiva==='turmas'?'text-blue-600 border-b-2 border-blue-600':'text-gray-400'}`}>Turmas</button>}
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {abaAtiva === 'pesquisa' && (
                                <>
                                    <input type="text" placeholder="Buscar..." value={busca} onChange={e=>setBusca(e.target.value)} className="w-full p-2 border rounded mb-4 outline-none focus:ring-2 focus:ring-blue-500"/>
                                    <ul>{alunosFiltrados.map(a => <LinhaAluno key={a.id} aluno={a} />)}</ul>
                                </>
                            )}
                            {abaAtiva === 'turmas' && isStaff && (
                                <div className="space-y-2">
                                    {listaTurmas.map(t => (
                                        <div key={t}>
                                            <button onClick={()=>setTurmaAberta(turmaAberta===t?null:t)} className="w-full text-left p-3 bg-gray-50 rounded font-bold text-gray-700 flex justify-between">{t} <span>{turmasAgrupadas[t].length}</span></button>
                                            {turmaAberta===t && <ul className="pl-4 mt-2 border-l-2 border-gray-200">{turmasAgrupadas[t].map(a=><LinhaAluno key={a.id} aluno={a}/>)}</ul>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Dashboard;