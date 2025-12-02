import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Loader2 } from 'lucide-react';

function Login() {
    const { signIn, signed } = useContext(AuthContext);

    // CAMPOS VAZIOS POR PADRÃO (Mais profissional)
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setErro('');
        try {
            await signIn(login, senha);
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setErro("Login ou senha inválidos.");
        } finally {
            setLoading(false);
        }
    }

    if (signed) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="px-8 py-10">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold text-primary-dark tracking-tight">EduSync</h1>
                        <p className="text-sm text-gray-500 mt-2 font-medium">Portal de Gestão Escolar Inteligente</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Usuário</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={login}
                                    onChange={e => setLogin(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-primary-dark focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50 outline-none transition duration-200"
                                    placeholder="Digite seu usuário"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-semibold text-gray-700">Senha</label>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    value={senha}
                                    onChange={e => setSenha(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:border-primary-dark focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50 outline-none transition duration-200"
                                    placeholder="••••••"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none transition"
                                >
                                    {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {erro && (
                            <div className="bg-red-50 border-l-4 border-error-red p-3 rounded flex items-center gap-2">
                                <p className="text-xs text-error-red font-bold">{erro}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary-dark hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "ACESSAR O PORTAL"}
                        </button>
                    </form>
                </div>
                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500">Acesso restrito a funcionários e responsáveis autorizados.</p>
                </div>
            </div>
        </div>
    );
}

export default Login;