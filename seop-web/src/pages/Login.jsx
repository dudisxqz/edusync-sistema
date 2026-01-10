import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Loader2, LayoutDashboard, ArrowRight } from 'lucide-react';

function Login() {
    const { signIn, signed } = useContext(AuthContext);

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
            
        } catch (error) {
            setErro("Credenciais inválidas. Verifique seu login e senha.");
        } finally {
            setLoading(false);
        }
    }

    if (signed) return <Navigate to="/" />;

    return (
        <div className="flex min-h-screen font-sans bg-gray-50">

            <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f172a] items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')" }} // Imagem de universidade moderna
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-blue-900/40 to-[#0f172a]"></div>

                <div className="relative z-10 p-12 text-center max-w-lg">
                    <div className="flex justify-center mb-8">
                        <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30">
                            <LayoutDashboard className="text-white h-12 w-12" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-4">
                        Gestão escolar simplificada e inteligente.
                    </h1>
                    <p className="text-lg text-blue-200 leading-relaxed">
                        Conectando direção, professores, alunos e responsáveis em uma única plataforma robusta e eficiente. Bem-vindo ao futuro da educação.
                    </p>
                </div>

                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
                <div className="w-full max-w-md space-y-8">

                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex p-3 bg-blue-600 rounded-xl shadow-md mb-4">
                            <LayoutDashboard className="text-white h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">EduSync</h2>
                    </div>

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Acesse sua conta</h2>
                        <p className="mt-2 text-sm text-gray-500">Entre com suas credenciais para continuar.</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-2">Usuário ou Matrícula</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={login}
                                    onChange={e => setLogin(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                                    placeholder="Ex: diretor, prof.joao"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-700 block mb-2">Senha</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    required
                                    value={senha}
                                    onChange={e => setSenha(e.target.value)}
                                    className="block w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {mostrarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <a href="#" className="font-bold text-blue-600 hover:text-blue-800 transition">
                                    Esqueceu a senha?
                                </a>
                            </div>
                        </div>

                        {erro && (
                            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg animate-shake">
                                <p className="font-bold flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-7a1 1 0 00-1 1v3a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    Atenção
                                </p>
                                <p className="mt-1">{erro}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-[0.99]"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-6 w-6" />
                            ) : (
                                <span className="flex items-center gap-2">
                            ENTRAR NA PLATAFORMA <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                        </span>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-gray-400">
                        © 2025 EduSync Tecnologia. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;