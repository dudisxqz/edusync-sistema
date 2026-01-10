import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Sidebar } from '../components/Sidebar';
import { User, Lock, Save, ShieldCheck, KeyRound, Eye, EyeOff, Contact, Flag, Calendar } from 'lucide-react';

function Perfil() {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();

    const [senhaAntiga, setSenhaAntiga] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);

    // Estados para visibilidade das senhas
    const [showAntiga, setShowAntiga] = useState(false);
    const [showNova, setShowNova] = useState(false);
    const [showConfirmar, setShowConfirmar] = useState(false);

    // Estado para dados do aluno
    const [dadosAluno, setDadosAluno] = useState(null);

    // Carrega dados extras se for aluno
    useEffect(() => {
        async function carregarDados() {
            if (user?.role === 'ALUNO') {
                try {

                    const idUsuario = user.id || localStorage.getItem("seop_id");
                    if (idUsuario) {
                        const res = await api.get(`/usuarios/${idUsuario}/dados-pessoais`);
                        setDadosAluno(res.data);
                    }
                } catch (error) {
                    console.log("Não foi possível carregar dados detalhados.");
                }
            }
        }
        carregarDados();
    }, [user]);

    async function handleTrocarSenha(e) {
        e.preventDefault();

        if (novaSenha.length < 6) {
            return addToast("A nova senha deve ter no mínimo 6 caracteres.", "error");
        }

        if (novaSenha !== confirmarSenha) {
            return addToast("A nova senha e a confirmação não conferem.", "error");
        }

        setLoading(true);
        try {
            const idUsuario = user.id || localStorage.getItem("seop_id");
            if (!idUsuario) throw new Error("ID do usuário não encontrado. Faça login novamente.");

            await api.put(`/usuarios/${idUsuario}/senha`, { senhaAntiga, novaSenha });

            addToast("Senha alterada com sucesso!", "success");
            setSenhaAntiga(''); setNovaSenha(''); setConfirmarSenha('');
        } catch (erro) {
            console.error(erro);
            const msg = erro.response?.data || erro.message || "Erro ao alterar senha.";
            addToast(msg, "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />

            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">
                <div className="max-w-5xl mx-auto">

                    <h1 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-3">
                        <User size={32} className="text-blue-600" /> Meu Perfil
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className="space-y-6">

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
                                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-5xl font-bold text-blue-600 mb-6 border-4 border-white shadow-lg">
                                    {user?.login?.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">{user?.login}</h2>
                                <span className="mt-2 px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                            {user?.role}
                        </span>
                                <div className="mt-8 w-full pt-8 border-t border-gray-100 flex flex-col gap-3 text-sm text-gray-500">
                                    <div className="flex justify-between"><span>Status</span> <span className="text-green-600 font-bold flex items-center gap-1"><ShieldCheck size={14}/> Ativo</span></div>
                                </div>
                            </div>

                            {user?.role === 'ALUNO' && dadosAluno && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider flex items-center gap-2">
                                        <Contact size={16}/> Dados Pessoais
                                    </h3>
                                    <ul className="space-y-4 text-sm">
                                        <li className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-500">Nome Completo</span>
                                            <span className="font-semibold text-gray-800 text-right">{dadosAluno.nome}</span>
                                        </li>
                                        <li className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-500">Matrícula</span>
                                            <span className="font-mono font-bold text-gray-700">{dadosAluno.matricula}</span>
                                        </li>
                                        <li className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-500 flex items-center gap-1"><Calendar size={14}/> Nascimento</span>
                                            <span className="font-medium text-gray-700">
                                        {new Date(dadosAluno.dataNascimento).toLocaleDateString('pt-BR')}
                                    </span>
                                        </li>
                                        <li className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-500">CPF</span>
                                            <span className="font-medium text-gray-700">{dadosAluno.cpf || "Não informado"}</span>
                                        </li>
                                        <li className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="text-gray-500">Responsável</span>
                                            <span className="font-medium text-gray-700">{dadosAluno.nomeResponsavel || "Não informado"}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-500 flex items-center gap-1"><Flag size={14}/> Nacionalidade</span>
                                            <span className="font-medium text-gray-700">Brasileira</span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 h-fit">
                                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><KeyRound size={24}/></div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Alterar Senha</h3>
                                        <p className="text-sm text-gray-500">Mantenha sua conta segura atualizando sua senha.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleTrocarSenha} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Senha Atual</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input type={showAntiga ? "text" : "password"} value={senhaAntiga} onChange={e => setSenhaAntiga(e.target.value)} className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Digite sua senha atual" required />
                                            <button type="button" onClick={() => setShowAntiga(!showAntiga)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">{showAntiga ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nova Senha</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                                <input type={showNova ? "text" : "password"} value={novaSenha} onChange={e => setNovaSenha(e.target.value)} className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Mínimo 6 caracteres" required />
                                                <button type="button" onClick={() => setShowNova(!showNova)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">{showNova ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Confirmar Nova Senha</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                                <input type={showConfirmar ? "text" : "password"} value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Repita a nova senha" required />
                                                <button type="button" onClick={() => setShowConfirmar(!showConfirmar)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">{showConfirmar ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition transform hover:-translate-y-1 disabled:opacity-70">
                                            {loading ? "Salvando..." : <><Save size={18} /> Salvar Alterações</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Perfil;