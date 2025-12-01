import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, BookOpen, Clock, Calendar } from 'lucide-react';

function VisualizarTarefas() {
    const { alunoId } = useParams();
    const [aluno, setAluno] = useState(null);
    const [tarefas, setTarefas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarDados() {
            try {
                setLoading(true);

                // 1. Busca o Aluno para saber a turma
                const resAlunos = await api.get('/alunos');
                const alunoEncontrado = resAlunos.data.find(a => a.id === Number(alunoId));
                setAluno(alunoEncontrado);

                if (alunoEncontrado && alunoEncontrado.turma) {
                    // 2. Busca tarefas filtradas pela turma (EncodeURIComponent trata os espaços e acentos)
                    // O endpoint /tarefas/turma/{turma} já existe no seu Backend AVA
                    const resTarefas = await api.get(`/tarefas/turma/${encodeURIComponent(alunoEncontrado.turma)}`);
                    setTarefas(resTarefas.data || []);
                }
            } catch (error) {
                console.error("Erro ao carregar tarefas:", error);
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, [alunoId]);

    if (loading) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500 font-medium">
            Carregando agenda...
        </div>
    );

    if (!aluno) return <div className="p-10 text-center">Aluno não encontrado.</div>;

    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-10">

            {/* NAVBAR */}
            <nav className="bg-primary-dark text-white shadow-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-500 p-2 rounded-lg text-white shadow">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-wide">Agenda de Tarefas</h2>
                            <p className="text-xs text-gray-400">{aluno.nome} - {aluno.turma}</p>
                        </div>
                    </div>
                    <Link to="/">
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition flex items-center gap-2 border border-white/20">
                            <ArrowLeft size={16} /> Voltar
                        </button>
                    </Link>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">

                {tarefas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <BookOpen size={40} className="opacity-20" />
                        </div>
                        <p className="text-lg font-medium">Nenhuma tarefa pendente.</p>
                        <p className="text-sm">Sua agenda está livre por enquanto!</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {tarefas.map(tarefa => (
                            <div key={tarefa.id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition duration-200 group">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-xl text-gray-800 group-hover:text-primary-dark transition">{tarefa.titulo}</h3>
                                    <span className="text-[10px] font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full uppercase tracking-wide border border-blue-100">
                                {tarefa.materia}
                            </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-6 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    {tarefa.descricao}
                                </p>

                                <div className="flex items-center justify-between text-xs pt-2">
                                    <div className={`flex items-center gap-2 font-bold px-3 py-1.5 rounded-md ${new Date(tarefa.dataEntrega) < new Date() ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                                        <Clock size={16} />
                                        <span>Entrega: {new Date(tarefa.dataEntrega).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Calendar size={14} />
                                        <span>Postado recentemente</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default VisualizarTarefas;