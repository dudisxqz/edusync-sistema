import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '../contexts/ToastContext';
import { Sidebar } from '../components/Sidebar';
import { BarChart3, Save, Loader2, Sparkles, Printer, ArrowLeft } from 'lucide-react';
import { Boletim } from '../components/Boletim';

function Desempenho() {
    const { addToast } = useToast();
    const [alunos, setAlunos] = useState([]);
    const [notas, setNotas] = useState([]);
    const [alunoId, setAlunoId] = useState('');
    const [materia, setMateria] = useState('MATEMATICA');
    const [valor, setValor] = useState('');
    const [bimestre, setBimestre] = useState('1');

    // Estados para IA e Relatório
    const [relatorioIA, setRelatorioIA] = useState('');
    const [loadingRelatorio, setLoadingRelatorio] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const [ra, rn] = await Promise.all([api.get('/alunos'), api.get('/notas')]);
                setAlunos(ra.data || []);
                setNotas(rn.data || []);
            } catch (e) {
                console.error(e);
                addToast("Erro ao carregar dados.", "error");
            }
        }
        load();
    }, [addToast]);

    async function handleLancarNota(e) {
        e.preventDefault();
        if (!alunoId) return addToast("Selecione um aluno.", "error");

        try {
            await api.post('/notas', {
                alunoId,
                materia,
                valor: parseFloat(valor),
                bimestre: parseInt(bimestre),
                faltas: 0
            });
            addToast("Nota lançada com sucesso!", "success");

            // Recarrega notas
            const rn = await api.get('/notas');
            setNotas(rn.data || []);
            setValor('');
        } catch (err) {
            const msg = err.response?.data?.message || "Erro ao lançar nota.";
            addToast(msg, "error");
        }
    }

    async function handleGerarRelatorio() {
        if (!alunoId) return addToast("Selecione um aluno primeiro.", "error");

        setLoadingRelatorio(true);
        setRelatorioIA('');
        try {
            const resp = await api.get(`/relatorios/gerar/${alunoId}`);
            setRelatorioIA(resp.data);
            addToast("Relatório gerado!", "success");
        } catch (erro) {
            console.error(erro);
            addToast("Erro ao gerar relatório.", "error");
        } finally {
            setLoadingRelatorio(false);
        }
    }

    const handlePrint = () => {
        window.print();
    };

    // Dados para o gráfico e boletim
    const objAlunoSelecionado = alunos.find(a => a.id == alunoId);
    const turmaDoAluno = objAlunoSelecionado ? objAlunoSelecionado.turma : null;

    const dadosGrafico = notas
        .filter(n => n.aluno && n.aluno.id == alunoId)
        .map(notaDoAluno => {
            const notasDaMesmaTurma = notas.filter(n => n.materia === notaDoAluno.materia && n.aluno && n.aluno.turma === turmaDoAluno);
            const total = notasDaMesmaTurma.reduce((acc, cur) => acc + cur.valor, 0);
            const media = total / (notasDaMesmaTurma.length || 1);

            return {
                name: `${notaDoAluno.materia} (${notaDoAluno.bimestre}º)`,
                Aluno: notaDoAluno.valor,
                Media: parseFloat(media.toFixed(1))
            };
        });

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />

            {/* CSS DE IMPRESSÃO */}
            <style>{`
        @media print {
          .no-print { display: none !important; }
          #area-do-boletim { 
            display: block !important; 
            position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important;
            transform: scale(0.90); transform-origin: top left;
          }
          body > * > *:not(#area-do-boletim) { display: none !important; }
          body, html { visibility: visible !important; background: white; }
          @page { margin: 0; size: auto; }
        }
      `}</style>

            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-screen no-print">
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-cyan-100 text-cyan-700 rounded-xl"><BarChart3 size={28} /></div>
                        <div><h1 className="text-3xl font-black text-gray-900">Lançamento de Notas</h1><p className="text-gray-500">Registro acadêmico oficial.</p></div>
                    </div>
                    <Link to="/"><button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-bold transition flex items-center gap-2"><ArrowLeft size={16}/> Voltar</button></Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* FORMULÁRIO */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                        <form onSubmit={handleLancarNota} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Aluno</label>
                                <select className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none" value={alunoId} onChange={e=>setAlunoId(e.target.value)}>
                                    <option value="">Selecione...</option>
                                    {alunos.map(a=><option key={a.id} value={a.id}>{a.nome} - {a.turma}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Matéria</label>
                                    <select className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none" value={materia} onChange={e=>setMateria(e.target.value)}>
                                        <option value="MATEMATICA">Matemática</option><option value="PORTUGUES">Português</option><option value="HISTORIA">História</option><option value="GEOGRAFIA">Geografia</option><option value="CIENCIAS">Ciências</option><option value="INGLES">Inglês</option><option value="EDUCACAO_FISICA">Ed. Física</option><option value="ARTE">Arte</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Bimestre</label>
                                    <select className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none" value={bimestre} onChange={e=>setBimestre(e.target.value)}>
                                        <option value="1">1º Bim</option><option value="2">2º Bim</option><option value="3">3º Bim</option><option value="4">4º Bim</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Nota (0-10)</label>
                                <input type="number" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none" step="0.1" min="0" max="10" value={valor} onChange={e=>setValor(e.target.value)} required/>
                            </div>
                            <button type="submit" className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition shadow-lg shadow-cyan-200 flex justify-center gap-2"><Save size={18}/> Salvar Nota</button>
                        </form>
                    </div>

                    {/* GRÁFICO E IA */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[350px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-gray-800">Desempenho vs Turma</h3>
                                {turmaDoAluno && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold">{turmaDoAluno}</span>}
                            </div>

                            <div className="h-[250px] w-full">
                                {alunoId && dadosGrafico.length > 0 ? (
                                    <ResponsiveContainer>
                                        <BarChart data={dadosGrafico}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                            <XAxis dataKey="name" tick={{fontSize:10}}/>
                                            <YAxis domain={[0,10]}/>
                                            <Tooltip cursor={{fill:'#f3f4f6'}}/>
                                            <Legend/>
                                            <Bar name="Aluno" dataKey="Aluno" fill="#0891b2" radius={[4,4,0,0]}/>
                                            <Bar name="Média Turma" dataKey="Media" fill="#e5e7eb" radius={[4,4,0,0]}/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">Selecione um aluno com notas para visualizar.</div>
                                )}
                            </div>
                        </div>

                        {/* CARD DA IA */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-purple-700 font-bold"><Sparkles size={18}/> Parecer Pedagógico Inteligente</div>
                                <div className="flex gap-2">
                                    <button onClick={handleGerarRelatorio} disabled={!alunoId || loadingRelatorio} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50 flex items-center gap-2">
                                        {loadingRelatorio ? <Loader2 size={14} className="animate-spin"/> : "Gerar Parecer"}
                                    </button>
                                    {relatorioIA && (
                                        <button onClick={handlePrint} className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-lg transition flex items-center gap-2">
                                            <Printer size={14}/> Imprimir
                                        </button>
                                    )}
                                </div>
                            </div>
                            {relatorioIA && (
                                <div className="p-4 bg-purple-50 rounded-xl text-sm text-gray-700 leading-relaxed text-justify border border-purple-100">
                                    {relatorioIA.split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Componente Oculto para Impressão */}
            <div id="area-do-boletim" style={{ display: 'none' }}>
                <Boletim aluno={objAlunoSelecionado} notas={notas} relatorioIA={relatorioIA} />
            </div>
        </div>
    );
}
export default Desempenho;