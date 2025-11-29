import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

function Desempenho() {
    const [alunos, setAlunos] = useState([]);
    const [notas, setNotas] = useState([]);

    // Formulário de Notas
    const [alunoId, setAlunoId] = useState('');
    const [materia, setMateria] = useState('MATEMATICA');
    const [valor, setValor] = useState('');
    const [bimestre, setBimestre] = useState('1');

    // Estados do Relatório IA
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
        } catch (e) {
            console.error(e);
        }
    }

    async function handleLancarNota(e) {
        e.preventDefault();
        try {
            await api.post('/notas', {
                alunoId,
                materia,
                valor: parseFloat(valor),
                bimestre: parseInt(bimestre),
                faltas: 0
            });
            alert("✅ Nota lançada com sucesso!");
            carregarDados();
            setValor('');
        } catch (erro) {
            console.error(erro);
            const msg = erro.response?.data?.message || "Erro ao lançar nota (Verifique duplicidade).";
            alert(msg);
        }
    }

    // --- FUNÇÃO PARA GERAR RELATÓRIO COM IA ---
    async function handleGerarRelatorio() {
        if (!alunoId) return;
        setLoadingRelatorio(true);
        setRelatorioIA(''); // Limpa o anterior

        try {
            // Chama o endpoint que criamos no RelatorioController
            const resp = await api.get(`/relatorios/gerar/${alunoId}`);
            setRelatorioIA(resp.data);
        } catch (erro) {
            console.error(erro);
            alert("Erro ao gerar relatório. Verifique se a chave da API está configurada.");
        } finally {
            setLoadingRelatorio(false);
        }
    }

    // --- LÓGICA DO GRÁFICO (CÁLCULO DA MÉDIA) ---
    const alunoSelecionado = alunos.find(a => a.id == alunoId);
    const turmaDoAluno = alunoSelecionado ? alunoSelecionado.turma : null;

    const dadosGrafico = notas
        .filter(n => n.aluno && n.aluno.id == alunoId)
        .map(notaDoAluno => {
            // Filtra notas da mesma matéria e mesma turma para calcular média
            const notasDaMesmaTurma = notas.filter(n =>
                n.materia === notaDoAluno.materia &&
                n.aluno && n.aluno.turma === turmaDoAluno
            );

            const total = notasDaMesmaTurma.reduce((acc, cur) => acc + cur.valor, 0);
            const mediaRealTurma = total / notasDaMesmaTurma.length;

            return {
                name: `${notaDoAluno.materia} (${notaDoAluno.bimestre}º Bim)`,
                Aluno: notaDoAluno.valor,
                MediaTurma: parseFloat(mediaRealTurma.toFixed(1))
            };
        });

    return (
        <div style={{ background: '#f4f6f9', minHeight: '100vh', padding: '20px', fontFamily: "'Segoe UI', sans-serif" }}>

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: '#003366' }}>📊 Controle Acadêmico</h2>
                    <Link to="/">
                        <button style={styles.btnVoltar}>Voltar ao Painel</button>
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                    {/* ESQUERDA: Formulário de Lançamento */}
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Lançar Nota</h3>
                        <form onSubmit={handleLancarNota} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Aluno</label>
                                <select value={alunoId} onChange={e => setAlunoId(e.target.value)} required style={styles.input}>
                                    <option value="">Selecione...</option>
                                    {alunos.map(a => <option key={a.id} value={a.id}>{a.nome} - {a.turma}</option>)}
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 2 }}>
                                    <label style={styles.label}>Matéria</label>
                                    <select value={materia} onChange={e => setMateria(e.target.value)} style={styles.input}>
                                        <option value="MATEMATICA">Matemática</option>
                                        <option value="PORTUGUES">Português</option>
                                        <option value="HISTORIA">História</option>
                                        <option value="GEOGRAFIA">Geografia</option>
                                        <option value="CIENCIAS">Ciências</option>
                                    </select>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <label style={styles.label}>Bimestre</label>
                                    <select value={bimestre} onChange={e => setBimestre(e.target.value)} style={styles.input}>
                                        <option value="1">1º</option>
                                        <option value="2">2º</option>
                                        <option value="3">3º</option>
                                        <option value="4">4º</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={styles.label}>Nota (0.0 a 10.0)</label>
                                <input
                                    type="number"
                                    placeholder="Ex: 8.5"
                                    value={valor}
                                    onChange={e => setValor(e.target.value)}
                                    step="0.1" min="0" max="10"
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <button type="submit" style={styles.btnSalvar}>Salvar Nota</button>
                        </form>
                    </div>

                    {/* DIREITA: Gráfico Visual */}
                    <div style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#495057', fontSize: '18px' }}>
                                Desempenho vs. Turma
                            </h3>
                            {turmaDoAluno && (
                                <span style={{ background: '#e9ecef', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
                  Comparando com: {turmaDoAluno}
                </span>
                            )}
                        </div>

                        {alunoId && dadosGrafico.length > 0 ? (
                            <div style={{ width: '100%', overflowX: 'auto' }}>
                                <BarChart width={450} height={300} data={dadosGrafico} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{fontSize: 11}} />
                                    <YAxis domain={[0, 10]} />
                                    <Tooltip />
                                    <Legend />
                                    <ReferenceLine y={6} label="Média Azul" stroke="red" strokeDasharray="3 3" />
                                    <Bar name="Aluno" dataKey="Aluno" fill="#0056b3" radius={[4, 4, 0, 0]} />
                                    <Bar name="Média da Turma" dataKey="MediaTurma" fill="#adb5bd" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </div>
                        ) : (
                            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#999', textAlign: 'center' }}>
                                <p>Selecione um aluno que tenha notas lançadas<br/>para ver o comparativo.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- ÁREA DO RELATÓRIO IA (NOVA) --- */}
                <div style={{ marginTop: '30px', background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                            <h3 style={{ margin: 0, color: '#003366', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                🤖 Parecer Pedagógico Inteligente
                                {loadingRelatorio && <span style={{fontSize: '12px', color: '#666'}}>(Gerando análise...)</span>}
                            </h3>
                            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                                A IA analisa as notas e o comportamento para sugerir ações.
                            </p>
                        </div>

                        <button
                            onClick={handleGerarRelatorio}
                            disabled={!alunoId || loadingRelatorio}
                            style={{
                                background: loadingRelatorio ? '#ccc' : 'linear-gradient(45deg, #FF512F 0%, #DD2476 100%)',
                                color: 'white', border: 'none', padding: '12px 24px', borderRadius: '30px',
                                cursor: loadingRelatorio ? 'wait' : 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                            }}
                        >
                            {loadingRelatorio ? '✨ Escrevendo...' : '📄 Gerar Relatório Completo'}
                        </button>
                    </div>

                    {relatorioIA && (
                        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #DD2476', lineHeight: '1.6', color: '#333' }}>
                            {/* Quebra de linha para exibir o texto formatado */}
                            {relatorioIA.split('\n').map((line, i) => <p key={i} style={{margin: '5px 0'}}>{line}</p>)}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

const styles = {
    card: { background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ced4da', width: '100%', boxSizing: 'border-box' },
    label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },
    formGroup: { marginBottom: '10px' },
    btnSalvar: { background: '#28a745', color: 'white', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
    btnVoltar: { background: '#6c757d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }
};

export default Desempenho;