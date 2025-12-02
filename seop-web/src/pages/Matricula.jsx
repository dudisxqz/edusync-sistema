import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { UserPlus, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { Sidebar } from '../components/Sidebar'; // <--- Usa a Sidebar direto

function Matricula() {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState('');
    const [turma, setTurma] = useState('');

    const [matricula] = useState(() => {
        const ano = new Date().getFullYear();
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${ano}${random}`;
    });

    async function handleSalvar(e) {
        e.preventDefault();
        if (!nome || !turma) return addToast("Preencha todos os campos.", "error");

        setLoading(true);
        try {
            await api.post('/alunos', { nome, turma, matricula, situacao: "ATIVO" });
            addToast("Aluno matriculado!", "success");
            navigate('/');
        } catch (erro) {
            addToast("Erro ao matricular.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">

                <div className="max-w-2xl mx-auto w-full py-10">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                        {/* Header */}
                        <div className="bg-white px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                                    <UserPlus size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Nova Matrícula</h2>
                                    <p className="text-sm text-gray-500">Cadastro oficial de estudante</p>
                                </div>
                            </div>
                            <Link to="/">
                                <button className="text-gray-400 hover:text-gray-600 text-sm font-medium flex items-center gap-1 transition">
                                    <ArrowLeft size={16} /> Cancelar
                                </button>
                            </Link>
                        </div>

                        {/* Formulário */}
                        <form onSubmit={handleSalvar} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nome Completo</label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="Ex: Ana Clara de Souza"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Turma de Destino</label>
                                    <select
                                        value={turma}
                                        onChange={e => setTurma(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="" disabled>Selecione...</option>
                                        <option value="1º Ano A">1º Ano A</option>
                                        <option value="2º Ano B">2º Ano B</option>
                                        <option value="3º Ano A">3º Ano A</option>
                                        <option value="9º Ano C">9º Ano C</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Matrícula (Gerada)</label>
                                    <input
                                        type="text"
                                        value={matricula}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 font-mono cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition transform hover:-translate-y-0.5 disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Confirmar</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Matricula;