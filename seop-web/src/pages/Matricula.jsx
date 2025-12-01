import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { UserPlus, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

function Matricula() {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Estados do Formulário
    const [nome, setNome] = useState('');
    const [turma, setTurma] = useState('');
    const [matricula, setMatricula] = useState('');

    // Gera um número de matrícula aleatório ao abrir (sugestão)
    useState(() => {
        const ano = new Date().getFullYear();
        const random = Math.floor(1000 + Math.random() * 9000);
        setMatricula(`${ano}${random}`);
    }, []);

    async function handleSalvar(e) {
        e.preventDefault();
        if (!nome || !turma) {
            addToast("Preencha todos os campos obrigatórios.", "error");
            return;
        }

        setLoading(true);
        try {
            // Envia para o Backend (Endpoint já existente!)
            await api.post('/alunos', {
                nome,
                turma,
                matricula,
                situacao: "ATIVO"
            });

            addToast("Aluno matriculado com sucesso!", "success");
            navigate('/'); // Volta para o painel
        } catch (erro) {
            console.error(erro);
            addToast("Erro ao matricular aluno. Verifique se a matrícula já existe.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">

                {/* Cabeçalho */}
                <div className="bg-white px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-primary-dark">Nova Matrícula</h2>
                            <p className="text-sm text-gray-500">Cadastro de novo estudante no sistema</p>
                        </div>
                    </div>
                    <Link to="/">
                        <button className="text-gray-400 hover:text-gray-600 font-medium text-sm transition flex items-center gap-1">
                            <ArrowLeft size={16} /> Cancelar
                        </button>
                    </Link>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSalvar} className="p-8 space-y-6">

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nome Completo do Aluno</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-dark outline-none transition"
                            placeholder="Ex: Ana Clara de Souza"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Turma de Destino</label>
                            <select
                                value={turma}
                                onChange={e => setTurma(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-dark outline-none bg-white"
                            >
                                <option value="" disabled>Selecione...</option>
                                <option value="1º Ano A">1º Ano A</option>
                                <option value="2º Ano B">2º Ano B</option>
                                <option value="3º Ano A">3º Ano A</option>
                                <option value="9º Ano C">9º Ano C</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Matrícula (Gerada)</label>
                            <input
                                type="text"
                                value={matricula}
                                readOnly
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 font-mono cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-4 border-t border-gray-50 mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-primary-dark hover:bg-opacity-90 text-white font-bold rounded-lg shadow-md transition transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Confirmar Matrícula</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Matricula;