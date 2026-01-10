import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { BookOpen, Clock, CheckCircle, User } from 'lucide-react';

function MinhasTarefas() {
    const { user } = useContext(AuthContext);
    const [filhos, setFilhos] = useState([]);
    const [tarefas, setTarefas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregar() {
            try {
                setLoading(true);
                const resAlunos = await api.get('/alunos');
                const meusFilhos = resAlunos.data.filter(a => a.nome.includes("João") || a.nome.includes("Maria"));
                setFilhos(meusFilhos);

                const promises = meusFilhos.map(filho => api.get(`/tarefas/turma/${encodeURIComponent(filho.turma)}`));
                const resultados = await Promise.all(promises);

                const todasTarefas = resultados.flatMap((r, index) =>
                    r.data.map(t => ({ ...t, alunoNome: meusFilhos[index].nome }))
                );

                setTarefas(todasTarefas);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        }
        carregar();
    }, [user]);

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Minhas Tarefas</h1>
                    <p className="text-gray-500 mt-1">Atividades e trabalhos pendentes de todos os filhos.</p>
                </header>

                {loading ? (
                    <div className="text-center text-gray-400 py-20">Carregando agenda...</div>
                ) : tarefas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                        <CheckCircle size={48} className="text-green-500 mb-4 opacity-50"/>
                        <p className="text-lg font-bold">Tudo em dia!</p>
                        <p className="text-sm">Nenhuma atividade pendente.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {tarefas.map(t => {
                            const isLate = new Date(t.dataEntrega) < new Date();
                            return (
                                <div key={t.id} className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 ${isLate ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-yellow-400'}`}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded uppercase flex items-center gap-1">
                                        <User size={10} /> {t.alunoNome}
                                    </span>
                                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase">{t.materia}</span>
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-800 mb-2">{t.titulo}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">{t.descricao}</p>
                                    </div>
                                    <div className="md:w-40 flex flex-col justify-center items-end">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Entrega</span>
                                        <div className={`flex items-center gap-2 font-bold text-sm ${isLate ? 'text-red-600' : 'text-gray-700'}`}>
                                            <Clock size={16} /> {new Date(t.dataEntrega).toLocaleDateString('pt-BR')}
                                        </div>
                                        {isLate && <span className="mt-2 text-[9px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">ATRASADO</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MinhasTarefas;