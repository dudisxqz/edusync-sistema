import { useState, useEffect, useContext, useRef } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { DeclaracaoMatricula } from '../components/DeclaracaoMatricula';
import {
    FileSignature, Search, Printer, Eye, Calendar as CalendarIcon,
    User, CheckCircle2, X, FileText, GraduationCap, ChevronRight
} from 'lucide-react';

function MeusDocumentos() {
    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [todosAlunos, setTodosAlunos] = useState([]);
    const [meusFilhos, setMeusFilhos] = useState([]);

    const [busca, setBusca] = useState('');
    const [sugestoes, setSugestoes] = useState([]);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);
    const [tipoDocumento, setTipoDocumento] = useState('matricula');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    const [mostrarPreview, setMostrarPreview] = useState(false);

    const isStaff = ['ADMIN', 'SECRETARIA', 'COORDENADOR'].includes(user?.role);

    useEffect(() => {
        async function carregar() {
            try {
                setLoading(true);
                const res = await api.get('/alunos');
                if (isStaff) {
                    setTodosAlunos(res.data);
                } else {
                    const filhos = res.data.filter(a => a.nome.includes("João") || a.nome.includes("Maria"));
                    setMeusFilhos(filhos);
                }
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        }
        carregar();
    }, [user, isStaff]);

    useEffect(() => {
        if (isStaff && busca.length > 0 && !alunoSelecionado) {
            const termo = busca.toLowerCase();
            const matches = todosAlunos.filter(a => a.nome.toLowerCase().includes(termo) || a.matricula.includes(termo));
            setSugestoes(matches.slice(0, 5));
        } else {
            setSugestoes([]);
        }
    }, [busca, todosAlunos, alunoSelecionado, isStaff]);

    const handleSelecionarAluno = (aluno) => {
        setAlunoSelecionado(aluno);
        setBusca(aluno.nome);
        setSugestoes([]);
        setMostrarPreview(false);
    };

    const handleGerarDocumento = () => {
        if (!alunoSelecionado) return alert("Selecione um estudante.");
        if (tipoDocumento === 'frequencia' && (!dataInicio || !dataFim)) return alert("Informe o período.");
        setMostrarPreview(true);
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50">Carregando...</div>;

    return (
        <div className="flex h-screen bg-gray-50 font-sans">

            <div className="no-print">
                <Sidebar />
            </div>

            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">

                <style>{`
            @media print {
                .no-print, nav, aside, header, .sidebar { display: none !important; }
                body, html, #root, .flex-1 { background: white !important; height: auto !important; overflow: visible !important; margin: 0 !important; padding: 0 !important; }
                #area-documento-container, #area-documento-container-hidden { display: block !important; position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; }
                #area-documento { box-shadow: none !important; border: none !important; transform: scale(1) !important; margin: 0 auto !important; }
                @page { size: A4 portrait; margin: 1cm; }
            }
            `}</style>

                <header className="mb-8 no-print">
                    <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                        <FileSignature className="text-orange-500" size={32}/> Emissão de Documentos
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Gerador de declarações e atestados oficiais.</p>
                </header>

                {isStaff ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
                        <div className="lg:col-span-1 space-y-6">

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative z-20">
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">1. Selecione o Estudante</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                    <input type="text" placeholder="Nome ou Matrícula..." value={busca} onChange={(e) => { setBusca(e.target.value); setAlunoSelecionado(null); }} className={`w-full pl-10 pr-10 py-3 border rounded-lg text-sm outline-none transition ${alunoSelecionado ? 'border-green-500 bg-green-50 text-green-700 font-bold' : 'focus:ring-2 focus:ring-blue-500'}`} autoComplete="off"/>
                                    {alunoSelecionado && <button onClick={() => {setAlunoSelecionado(null); setBusca('');}} className="absolute right-3 top-3.5 text-gray-400 hover:text-red-500"><X size={18}/></button>}
                                    {sugestoes.length > 0 && (
                                        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto z-50">
                                            {sugestoes.map(aluno => (
                                                <div key={aluno.id} onClick={() => handleSelecionarAluno(aluno)} className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex justify-between items-center">
                                                    <div><p className="font-bold text-gray-800 text-sm">{aluno.nome}</p><p className="text-xs text-gray-500">{aluno.turma}</p></div>
                                                    <CheckCircle2 size={14} className="text-gray-300"/>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ${!alunoSelecionado ? 'opacity-60 pointer-events-none' : ''}`}>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">2. Tipo de Documento</label>
                                <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white mb-4">
                                    <option value="matricula">Declaração de Matrícula</option>
                                    <option value="frequencia">Declaração de Frequência</option>
                                </select>
                                {tipoDocumento === 'frequencia' && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                                        <p className="text-xs font-bold text-blue-700 mb-3 flex items-center gap-1"><CalendarIcon size={12}/> Período</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div><label className="text-[10px] font-bold uppercase text-blue-500">Início</label><input type="date" value={dataInicio} onChange={e=>setDataInicio(e.target.value)} className="w-full p-2 rounded border border-blue-200 text-xs bg-white"/></div>
                                            <div><label className="text-[10px] font-bold uppercase text-blue-500">Fim</label><input type="date" value={dataFim} onChange={e=>setDataFim(e.target.value)} className="w-full p-2 rounded border border-blue-200 text-xs bg-white"/></div>
                                        </div>
                                    </div>
                                )}
                                <button onClick={handleGerarDocumento} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition flex justify-center items-center gap-2">
                                    <Eye size={18} /> Gerar Prévia
                                </button>
                            </div>
                        </div>


                        <div className="lg:col-span-2">
                            {mostrarPreview && alunoSelecionado ? (
                                <div className="bg-gray-200 rounded-xl border border-gray-300 h-full flex flex-col">
                                    <div className="p-3 border-b border-gray-300 bg-gray-100 rounded-t-xl flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-gray-600 font-bold text-sm"><FileText size={16}/> Visualização</div>
                                        <button onClick={handlePrint} className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded flex items-center gap-2 shadow-sm transition transform hover:scale-105">
                                            <Printer size={14}/> Imprimir PDF
                                        </button>
                                    </div>
                                    <div className="flex-1 p-8 overflow-auto flex justify-center items-start bg-gray-300/50">
                                        <div id="area-documento-container" className="bg-white shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }}>
                                            <DeclaracaoMatricula aluno={alunoSelecionado} tipo={tipoDocumento} dadosExtras={{ inicio: dataInicio && new Date(dataInicio).toLocaleDateString('pt-BR'), fim: dataFim && new Date(dataFim).toLocaleDateString('pt-BR') }} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full bg-white border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-300 p-10">
                                    <FileSignature size={64} className="opacity-20 mb-4"/>
                                    <p className="font-medium">Nenhum documento gerado.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 no-print">
                        {meusFilhos.map(aluno => (
                            <div key={aluno.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm"><GraduationCap size={24}/></div>
                                    <div><h3 className="font-bold text-gray-800">{aluno.nome}</h3><p className="text-xs text-gray-400 font-bold uppercase">{aluno.matricula}</p></div>
                                </div>
                                <button
                                    onClick={() => {
                                        setAlunoSelecionado(aluno);
                                        setTipoDocumento('matricula');
                                        setTimeout(() => window.print(), 300);
                                    }}
                                    className="w-full flex items-center justify-between p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition border border-orange-100 group"
                                >
                                    <div className="flex items-center gap-2 font-bold text-sm"><FileSignature size={16}/> Declaração de Matrícula</div>
                                    <ChevronRight size={16} className="text-orange-400 group-hover:translate-x-1 transition" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="hidden print:block">
                    <div id="area-documento-container-hidden">
                        {alunoSelecionado && <DeclaracaoMatricula aluno={alunoSelecionado} tipo={tipoDocumento} />}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default MeusDocumentos;