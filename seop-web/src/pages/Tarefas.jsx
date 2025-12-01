import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, BookOpen, Clock, CheckCircle } from 'lucide-react';

function Tarefas() {
    const [tarefas, setTarefas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarTarefas() {
            try {
                // Busca todas as tarefas (num app real, filtraria pela turma do aluno)
                const resp = await api.get('/tarefas');
                setTarefas(resp.data || []);
            } catch (error) {
                console.error("Erro ao carregar tarefas:", error);
            } finally {
                setLoading(false);
            }
        }
        carregarTarefas();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">
            Carregando atividades...
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-10">
            {/* NAVBAR */}
            <nav className="bg-primary-dark text-white shadow-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold flex items-center gap-2 tracking-wide">
                        <BookOpen size={24} className="text-yellow-400" /> Atividades & Tarefas
                    </h2>
                    <Link to="/">
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition flex items-center gap-2 border border-white/20">
                            <ArrowLeft size={16} /> Voltar
                        </button>
                    </Link>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">

                {tarefas.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p>Nenhuma tarefa pendente. 🎉</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {tarefas.map(tarefa => (
                            <div key={tarefa.id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-400 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-800">{tarefa.titulo}</h3>
                                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded uppercase">
                                {tarefa.materia}
                            </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {tarefa.descricao}
                                </p>

                                <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-4">
                                    <div className="flex items-center gap-2 text-orange-600 font-semibold">
                                        <Clock size={14} />
                                        <span>Entrega: {new Date(tarefa.dataEntrega).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <div className="text-gray-400 font-medium">
                                        Turma: {tarefa.turma}
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

export default Tarefas;