import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar'; // <--- Usa a Sidebar Manualmente
import { QrCode } from 'lucide-react';

function MinhaCarteirinha() {
    const { user } = useContext(AuthContext);
    const [aluno, setAluno] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarDados() {
            try {
                setLoading(true);
                const res = await api.get('/alunos');

                // Lógica para encontrar o aluno do usuário logado
                // Se o login for "aluno" ou "pai", tentamos achar pelo nome ou pegamos o primeiro como simulação
                const encontrado = res.data.find(a =>
                    a.nome.toLowerCase().includes("joão") || // Simulação para teste
                    a.nome.toLowerCase().includes(user?.login.toLowerCase())
                );

                // Se não achar específico, pega o primeiro da lista para não ficar vazio na demo
                setAluno(encontrado || res.data[0]);
            } catch (error) {
                console.error("Erro ao carregar carteirinha:", error);
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, [user]);

    return (
        <div className="flex h-screen bg-gray-50 font-sans">

            {/* SIDEBAR FIXA */}
            <Sidebar />

            {/* CONTEÚDO PRINCIPAL */}
            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full flex flex-col items-center justify-center bg-gray-100">

                <h2 className="text-3xl font-black text-gray-800 mb-8 tracking-tight text-center">
                    Identidade Estudantil Digital
                </h2>

                {loading ? (
                    <div className="text-gray-500 animate-pulse">Carregando dados...</div>
                ) : aluno ? (
                    <div className="transform transition hover:scale-105 duration-300">
                        {/* CARTÃO DIGITAL */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-[320px] border border-gray-200 relative">

                            {/* TOPO DO CARTÃO */}
                            <div className="bg-[#003366] p-6 text-center relative h-40">
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                                <h2 className="text-white font-bold text-xl tracking-widest relative z-10">EduSync</h2>
                                <p className="text-blue-200 text-[10px] uppercase tracking-[0.3em] mt-1 relative z-10">Carteira Oficial</p>

                                {/* FOTO (Círculo centralizado) */}
                                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 p-1.5 bg-white rounded-full shadow-lg">
                                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-400 border-4 border-gray-100">
                                        {aluno.nome.charAt(0)}
                                    </div>
                                </div>
                            </div>

                            {/* CORPO DO CARTÃO */}
                            <div className="pt-16 pb-8 px-6 text-center">
                                <h3 className="font-bold text-2xl text-gray-800 leading-tight mb-1">{aluno.nome}</h3>
                                <p className="text-sm text-gray-500 font-medium bg-gray-100 inline-block px-3 py-1 rounded-full">
                                    {aluno.turma}
                                </p>

                                <div className="mt-8 space-y-4 text-left">
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Matrícula</span>
                                        <span className="text-sm font-mono font-bold text-gray-700">{aluno.matricula}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Validade</span>
                                        <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> 12/2025
                            </span>
                                    </div>
                                </div>

                                {/* QR CODE */}
                                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-2">
                                    <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <QrCode size={64} className="text-gray-800" />
                                    </div>
                                    <p className="text-[9px] text-gray-400 uppercase tracking-wide">Documento Válido em Território Nacional</p>
                                </div>
                            </div>

                            {/* FAIXA INFERIOR */}
                            <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
                        </div>
                    </div>
                ) : (
                    <div className="text-red-500">Aluno não encontrado.</div>
                )}
            </div>
        </div>
    );
}

export default MinhaCarteirinha;