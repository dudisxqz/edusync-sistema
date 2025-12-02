import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Loader2, ArrowRight } from 'lucide-react';

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
        <div className="min-h-screen flex bg-gray-50 font-sans">

            {/* LADO ESQUERDO: IMAGEM E BRANDING (Some em telas pequenas) */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#003366] relative overflow-hidden items-center justify-center">
                {/* Fundo com gradiente e imagem */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 opacity-95"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>

                <div className="relative z-10 text-white text-center p-12 max-w-lg">
                    <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl">
                        {/* Ícone conceitual simples ou Logo */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                            <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.949 49.949 0 0 0-9.902 3.912l-.003.002-.34.18a.75.75 0 0 1-.707 0A50.009 50.009 0 0 0 7.5 12.174v-.224c0-.131.067-.248.182-.311a3.006 3.006 0 0 0 1.9-3.693.75.75 0 0 1 1.452-.384 4.506 4.506 0 0 1-1.663 4.957C4.253 16.72 7.775 21.995 11.953 21.995c.983 0 1.858-.285 2.56-.83a.75.75 0 1 1 1.01 1.123C14.472 23.215 13.26 23.5 11.953 23.5c-5.192 0-9.21-6.42-10.944-9.76a.75.75 0 0 1 .64-1.08l.508.004c.43.003.844.11 1.218.313a49.963 49.963 0 0 1 8.326-4.172ZM2.25 8.159c.524.305 1.065.591 1.621.857l.003.002c.35.172.695.335 1.032.492l.164.076a.75.75 0 0 1-.63 1.365c-.226-.104-.45-.21-.67-.318l-.2-.103a49.983 49.983 0 0 0-1.932-1.02 60.652 60.652 0 0 1-1.064-4.773.75.75 0 0 1 1.676-.378ZM17.25 12.5a.75.75 0 0 1 .75.75v4.75c0 .414.336.75.75.75h3.5a.75.75 0 0 1 0 1.5h-3.5a2.25 2.25 0 0 1-2.25-2.25V13.25a.75.75 0 0 1 .75-.75Z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-tight leading-tight text-white">
                        Gestão Escolar Inteligente
                    </h1>
                    <p className="text-base text-blue-200 font-light leading-relaxed">
                        Conectando direção, professores e famílias em uma única plataforma integrada e eficiente.
                    </p>
                </div>
            </div>

            {/* LADO DIREITO: FORMULÁRIO */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="max-w-md w-full space-y-8">

                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-4xl font-black text-[#003366] tracking-tight">EduSync</h2>
                        <p className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-widest">
                            Portal de Acesso
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Usuário</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={login}
                                        onChange={e => setLogin(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                        placeholder="Digite seu usuário"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Senha</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    </div>
                                    <input
                                        type={mostrarSenha ? "text" : "password"}
                                        required
                                        value={senha}
                                        onChange={e => setSenha(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                        placeholder="Digite sua senha"
                                    />
                                    <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none">
                                        {mostrarSenha ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" />
                                <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-500 cursor-pointer font-medium">Lembrar dispositivo</label>
                            </div>
                            <div className="text-xs">
                                <a href="#" className="font-bold text-blue-600 hover:text-blue-800 hover:underline">Esqueceu a senha?</a>
                            </div>
                        </div>

                        {erro && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> {erro}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#003366] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">ACESSAR SISTEMA <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/></span>}
                        </button>
                    </form>

                    <div className="pt-6 text-center border-t border-gray-100 mt-8">
                        <p className="text-xs text-gray-400">
                            Problemas com o acesso? Contate a secretaria.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;