import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Boletim } from '../components/Boletim';

function Desempenho() {
    const [alunos, setAlunos] = useState([]);
    const [notas, setNotas] = useState([]);
    const [alunoId, setAlunoId] = useState('');
    const [materia, setMateria] = useState('MATEMATICA');
    const [valor, setValor] = useState('');
    const [bimestre, setBimestre] = useState('1');
    const [relatorioIA, setRelatorioIA] = useState('');
    const [loadingRelatorio, setLoadingRelatorio] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const respAlunos = await api.get('/alunos');
            const respNotas = await api.get('/notas');
            setAlunos(respAlunos.data);
            setNotas(respNotas.data);
        } catch (e) { console.error(e); }
    }

    async function handleLancarNota(e) {
        e.preventDefault();
        try {
            await api.post('/notas', { alunoId, materia, valor: parseFloat(valor), bimestre: parseInt(bimestre), faltas: 0 });
            alert("✅ Nota lançada!");
            carregarDados(); setValor('');
        } catch (erro) { alert(erro.response?.data?.message || "Erro ao lançar."); }
    }

    async function handleGerarRelatorio() {
        if (!alunoId) return;
        setLoadingRelatorio(true);
        setRelatorioIA('');
        try {
            const resp = await api.get(`/relatorios/gerar/${alunoId}`);
            setRelatorioIA(resp.data);
        } catch (erro) { alert("Erro ao gerar relatório."); }
        finally { setLoadingRelatorio(false); }
    }

    // Lógica do Gráfico
    const dadosGrafico = notas
        .filter(n => n.aluno && n.aluno.id == alunoId)
        .map(notaDoAluno => {
            const notasDaMesmaTurma = notas.filter(n => n.materia === notaDoAluno.materia && n.aluno && n.aluno.turma === (alunos.find(a=>a.id==alunoId)?.turma));
            const total = notasDaMesmaTurma.reduce((acc, cur) => acc + cur.valor, 0);
            const media = total / notasDaMesmaTurma.length;
            return { name: `${notaDoAluno.materia}`, Aluno: notaDoAluno.valor, MediaTurma: parseFloat(media.toFixed(1)) };
        });

    const objAlunoSelecionado = alunos.find(a => a.id == alunoId);

    return (
        <div className="min-h-screen bg-gray-100 font-sans">

            {/* NAVBAR SIMPLES */}
            <nav className="bg-primary-dark text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        <h2 className="text-xl font-bold">Controle Acadêmico</h2>
                    </div>
                    <Link to="/">
                        <button className="px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg text-sm font-bold transition">Voltar ao Painel</button>
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* ESQUERDA: FORMULÁRIO */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-700 border-b border-gray-100 pb-4 mb-6">Lançar Nota</h3>

                        <form onSubmit={handleLancarNota} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Aluno</label>
                                <select value={alunoId} onChange={e => setAlunoId(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-dark outline-none bg-white">
                                    <option value="">Selecione o Aluno...</option>
                                    {alunos.map(a => <option key={a.id} value={a.id}>{a.nome} - {a.turma}</option>)}
                                </select>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Matéria</label>
                                    <select value={materia} onChange={e => setMateria(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-dark outline-none bg-white">
                                        <option value="MATEMATICA">Matemática</option><option value="PORTUGUES">Português</option><option value="HISTORIA">História</option><option value="GEOGRAFIA">Geografia</option><option value="CIENCIAS">Ciências</option>
                                    </select>
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bimestre</label>
                                    <select value={bimestre} onChange={e => setBimestre(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-dark outline-none bg-white">
                                        <option value="1">1º Bim</option><option value="2">2º Bim</option><option value="3">3º Bim</option><option value="4">4º Bim</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nota (0.0 - 10.0)</label>
                                <input type="number" placeholder="Ex: 8.5" value={valor} onChange={e => setValor(e.target.value)} step="0.1" max="10" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-dark outline-none" />
                            </div>

                            <button type="submit" className="w-full py-3 bg-secondary-green hover:bg-green-700 text-white font-bold rounded-lg shadow transition transform hover:-translate-y-0.5">
                                Salvar Nota
                            </button>
                        </form>
                    </div>

                    {/* DIREITA: GRÁFICO */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                            <h3 className="text-lg font-bold text-gray-700">Desempenho vs. Turma</h3>
                            {objAlunoSelecionado && <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 font-medium">Turma: {objAlunoSelecionado.turma}</span>}
                        </div>

                        <div className="flex-1 flex items-center justify-center min-h-[300px]">
                            {alunoId && dadosGrafico.length > 0 ? (
                                <div className="w-full h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dadosGrafico}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{fontSize: 10}} />
                                            <YAxis domain={[0, 10]} />
                                            <Tooltip cursor={{fill: '#f3f4f6'}} />
                                            <Legend />
                                            <Bar name="Aluno" dataKey="Aluno" fill="#003366" radius={[4, 4, 0, 0]} />
                                            <Bar name="Média Turma" dataKey="MediaTurma" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="text-center text-gray-400">
                                    <p className="mb-2 text-4xl">📊</p>
                                    <p>Selecione um aluno com notas para visualizar.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ÁREA DA IA */}
                <div className="mt-8 bg-white rounded-xl shadow-md p-6 border-t-4 border-purple-500">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-primary-dark flex items-center gap-2">
                                🤖 Parecer Pedagógico Inteligente
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">A IA analisa as notas e o comportamento para sugerir ações.</p>
                        </div>

                        <button
                            onClick={handleGerarRelatorio}
                            disabled={!alunoId || loadingRelatorio}
                            className={`px-6 py-2.5 rounded-full font-bold text-white shadow-md transition transform active:scale-95 ${loadingRelatorio || !alunoId ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'}`}
                        >
                            {loadingRelatorio ? 'Analisando dados...' : '✨ Gerar Parecer com IA'}
                        </button>
                    </div>

                    {relatorioIA && (
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-gray-700 leading-relaxed text-sm text-justify">
                            {relatorioIA.split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>)}
                        </div>
                    )}
                </div>
            </div>

            {/* Componente Oculto para Impressão */}
            <div style={{ display: 'none' }}><Boletim /></div>
        </div>
    );
}

export default Desempenho;