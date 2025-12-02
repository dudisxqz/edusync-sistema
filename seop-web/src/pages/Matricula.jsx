import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { UserPlus, Save, ArrowLeft, Loader2, Eraser } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { Sidebar } from '../components/Sidebar';

function Matricula() {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Estado único para o formulário completo
    const [form, setForm] = useState({
        nome: '',
        dataNascimento: '',
        cpf: '',
        telefone: '',
        endereco: '',

        nomeResponsavel: '',
        cpfResponsavel: '',
        telefoneResponsavel: '',
        emailResponsavel: '',

        escola: 'EEEM MAJOR GUAPINDAIA',
        serie: '',
        turma: '',
        dataMatricula: new Date().toISOString().split('T')[0], // Hoje
        matricula: Math.floor(100000 + Math.random() * 900000).toString() // Gera automático
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLimpar = () => {
        if(window.confirm("Deseja limpar todo o formulário?")) {
            setForm({
                ...form,
                nome: '', dataNascimento: '', cpf: '', telefone: '', endereco: '',
                nomeResponsavel: '', cpfResponsavel: '', telefoneResponsavel: '', emailResponsavel: '',
                serie: '', turma: ''
            });
        }
    };

    async function handleSalvar(e) {
        e.preventDefault();
        if (!form.nome || !form.turma) return addToast("Preencha os campos obrigatórios.", "error");

        setLoading(true);
        try {
            // Envia todos os campos novos para o Backend
            await api.post('/alunos', { ...form, situacao: "ATIVO" });
            addToast("Aluno matriculado com sucesso!", "success");
            navigate('/');
        } catch (erro) {
            console.error(erro);
            addToast("Erro ao realizar matrícula.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">

                <div className="max-w-5xl mx-auto w-full pb-10">

                    {/* Header */}
                    <div className="mb-8 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                                <UserPlus size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Matrícula de Aluno</h1>
                                <p className="text-gray-500 text-sm mt-1">Cadastre um novo aluno e realize a matrícula.</p>
                            </div>
                        </div>
                        <Link to="/">
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-bold transition flex items-center gap-2">
                                <ArrowLeft size={16} /> Voltar
                            </button>
                        </Link>
                    </div>

                    <form onSubmit={handleSalvar} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">

                        {/* SEÇÃO 1: DADOS DO ALUNO */}
                        <section>
                            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4 uppercase tracking-wide text-blue-600">Dados do Aluno</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nome Completo *</label>
                                    <input type="text" name="nome" value={form.nome} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Data de Nascimento</label>
                                    <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">CPF</label>
                                    <input type="text" name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Telefone</label>
                                    <input type="text" name="telefone" value={form.telefone} onChange={handleChange} placeholder="(00) 00000-0000" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Endereço Completo</label>
                                    <input type="text" name="endereco" value={form.endereco} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                        </section>

                        {/* SEÇÃO 2: RESPONSÁVEL */}
                        <section>
                            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4 uppercase tracking-wide text-blue-600">Dados do Responsável</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nome do Responsável</label>
                                    <input type="text" name="nomeResponsavel" value={form.nomeResponsavel} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">CPF Responsável</label>
                                    <input type="text" name="cpfResponsavel" value={form.cpfResponsavel} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Telefone Responsável</label>
                                    <input type="text" name="telefoneResponsavel" value={form.telefoneResponsavel} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">E-mail Responsável</label>
                                    <input type="email" name="emailResponsavel" value={form.emailResponsavel} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>
                        </section>

                        {/* SEÇÃO 3: DADOS ESCOLARES */}
                        <section>
                            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4 uppercase tracking-wide text-blue-600">Dados Escolares</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Escola</label>
                                    <select name="escola" value={form.escola} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg bg-white outline-none">
                                        <option>EEEM MAJOR GUAPINDAIA</option>
                                        <option>EEEFM CASTELO BRANCO</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Série/Ano</label>
                                    <select name="serie" value={form.serie} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg bg-white outline-none">
                                        <option value="">Selecione...</option>
                                        <option>1º Ano Ensino Médio</option>
                                        <option>2º Ano Ensino Médio</option>
                                        <option>3º Ano Ensino Médio</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Turma *</label>
                                    <select name="turma" value={form.turma} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-lg bg-white outline-none">
                                        <option value="">Selecione...</option>
                                        <option value="1º Ano A">1º Ano A</option>
                                        <option value="2º Ano B">2º Ano B</option>
                                        <option value="3º Ano A">3º Ano A</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Data Matrícula</label>
                                    <input type="date" name="dataMatricula" value={form.dataMatricula} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Matrícula (Auto)</label>
                                    <input type="text" value={form.matricula} readOnly className="w-full p-3 bg-gray-100 border border-transparent rounded-lg text-gray-500 font-mono" />
                                </div>
                            </div>
                        </section>

                        {/* BOTÕES */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleLimpar}
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition text-sm flex items-center gap-2"
                            >
                                <Eraser size={18} /> Limpar
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition flex items-center gap-2 text-sm disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Confirmar Matrícula</>}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}

export default Matricula;