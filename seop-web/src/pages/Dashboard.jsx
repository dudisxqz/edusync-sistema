import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

function Dashboard() {
    const { user, signOut } = useContext(AuthContext);

    const [alunos, setAlunos] = useState([]);
    const [ocorrencias, setOcorrencias] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados novos para a navegação
    const [abaAtiva, setAbaAtiva] = useState('pesquisa'); // 'pesquisa' ou 'turmas'
    const [busca, setBusca] = useState('');
    const [turmaAberta, setTurmaAberta] = useState(null); // Qual turma está expandida

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        setLoading(true);
        try {
            const [respAlunos, respOcorrencias] = await Promise.all([
                api.get('/alunos'),
                api.get('/ocorrencias')
            ]);
            setAlunos(respAlunos.data);
            setOcorrencias(respOcorrencias.data);
        } catch (erro) {
            console.error(erro);
        } finally {
            setLoading(false);
        }
    }

    // --- LÓGICA 1: FILTRO DE PESQUISA ---
    const alunosFiltrados = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(busca.toLowerCase())
    );

    // --- LÓGICA 2: AGRUPAR POR TURMAS ---
    // Transforma a lista [Aluno1, Aluno2] em { "3º A": [Aluno1], "2º B": [Aluno2] }
    const turmasAgrupadas = alunos.reduce((grupo, aluno) => {
        const turma = aluno.turma;
        if (!grupo[turma]) {
            grupo[turma] = [];
        }
        grupo[turma].push(aluno);
        return grupo;
    }, {});

    // Pega os nomes das turmas e ordena (Ex: 1º Ano, 2º Ano...)
    const listaDeTurmas = Object.keys(turmasAgrupadas).sort();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f6f9', flexDirection: 'column' }}>
                <div style={styles.spinner}></div>
                <p style={{ color: '#666', marginTop: '10px' }}>Carregando sistema...</p>
            </div>
        );
    }

    return (
        <div style={{ background: '#f4f6f9', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>

            {/* --- NAVBAR --- */}
            <div style={styles.navbar}>
                <div style={styles.containerNav}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>SEOP</h2>
                        {user && (
                            <span style={{fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '15px', fontWeight: '500'}}>
                  {user.login} <small>({user.role})</small>
               </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        {user?.role === 'ADMIN' && (
                            <>
                                <Link to="/desempenho"><button style={{...styles.btnPrimary, background: '#17a2b8'}}>📊 Notas</button></Link>
                                <Link to="/nova-ocorrencia"><button style={{...styles.btnPrimary}}>+ Ocorrência</button></Link>
                            </>
                        )}
                        <button onClick={signOut} style={{...styles.btnPrimary, background: '#dc3545', padding: '8px 12px'}}>Sair</button>
                    </div>
                </div>
            </div>

            <div style={styles.containerBody}>
                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>

                    {/* --- COLUNA ESQUERDA: NAVEGAÇÃO DE ALUNOS --- */}
                    <div style={styles.card}>

                        {/* Cabeçalho com Abas */}
                        <div style={styles.tabsContainer}>
                            <button
                                style={abaAtiva === 'pesquisa' ? styles.tabActive : styles.tabInactive}
                                onClick={() => setAbaAtiva('pesquisa')}
                            >
                                🔍 Pesquisa
                            </button>
                            <button
                                style={abaAtiva === 'turmas' ? styles.tabActive : styles.tabInactive}
                                onClick={() => setAbaAtiva('turmas')}
                            >
                                📚 Turmas
                            </button>
                        </div>

                        {/* CONTEÚDO DA ABA: PESQUISA */}
                        {abaAtiva === 'pesquisa' && (
                            <div style={{ padding: '15px' }}>
                                <input
                                    type="text"
                                    placeholder="Digite o nome do aluno..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    style={styles.inputBusca}
                                    autoFocus
                                />

                                <ul style={styles.list}>
                                    {busca.length === 0 ? (
                                        <li style={styles.emptyState}>
                                            Digite acima para buscar entre os {alunos.length} alunos cadastrados.
                                        </li>
                                    ) : alunosFiltrados.length > 0 ? (
                                        alunosFiltrados.map(aluno => (
                                            <li key={aluno.id} style={styles.itemAluno}>
                                                <div style={{ fontWeight: '500', color: '#333' }}>{aluno.nome}</div>
                                                <div style={{ fontSize: '12px', color: '#6c757d' }}>{aluno.turma}</div>
                                            </li>
                                        ))
                                    ) : (
                                        <li style={styles.emptyState}>Nenhum aluno encontrado.</li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {abaAtiva === 'turmas' && (
                            <div style={{ padding: '0' }}>
                                {listaDeTurmas.map(turma => (
                                    <div key={turma}>
                                        <div
                                            onClick={() => setTurmaAberta(turmaAberta === turma ? null : turma)}
                                            style={{...styles.turmaHeader, background: turmaAberta === turma ? '#e9ecef' : 'white'}}
                                        >
                                            <span style={{fontWeight: 'bold', color: '#003366'}}>{turma}</span>
                                            <span style={{fontSize: '12px', color: '#666'}}>
                        {turmasAgrupadas[turma].length} alunos {turmaAberta === turma ? '▲' : '▼'}
                      </span>
                                        </div>

                                        {turmaAberta === turma && (
                                            <ul style={{...styles.list, background: '#f8f9fa', borderBottom: '1px solid #ddd'}}>
                                                {turmasAgrupadas[turma].map(aluno => (
                                                    <li key={aluno.id} style={{...styles.itemAluno, paddingLeft: '30px'}}>
                                                        {aluno.nome}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.cardTitle}>Últimas Ocorrências</h3>
                        </div>
                        {ocorrencias.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                                Nenhum registro encontrado.
                            </div>
                        ) : (
                            <ul style={styles.list}>
                                {ocorrencias.map(oc => (
                                    <li key={oc.id} style={styles.itemOcorrencia}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <div>
                                                <span style={styles.alunoName}>{oc.aluno?.nome}</span>
                                                <span style={styles.turmaTag}>{oc.aluno?.turma}</span>
                                            </div>
                                            <span style={styles.badge(oc.tipo)}>{oc.tipo}</span>
                                        </div>
                                        <p style={styles.descricaoTexto}>{oc.descricao}</p>
                                        <div style={styles.dataFooter}>
                                            {new Date(oc.dataCriacao).toLocaleDateString('pt-BR')} às {new Date(oc.dataCriacao).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

const styles = {
    navbar: { background: '#003366', color: 'white', padding: '15px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    containerNav: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    containerBody: { maxWidth: '1200px', margin: '30px auto', padding: '0 20px' },
    card: { background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', height: 'fit-content', minHeight: '300px' },
    cardHeader: { padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' },
    cardTitle: { margin: 0, fontSize: '16px', color: '#495057', fontWeight: 'bold' },

    tabsContainer: { display: 'flex', borderBottom: '1px solid #eee' },
    tabActive: { flex: 1, padding: '15px', background: 'white', border: 'none', borderBottom: '3px solid #003366', fontWeight: 'bold', color: '#003366', cursor: 'pointer' },
    tabInactive: { flex: 1, padding: '15px', background: '#f8f9fa', border: 'none', borderBottom: '3px solid transparent', color: '#6c757d', cursor: 'pointer' },

    turmaHeader: { padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },

    inputBusca: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ced4da', boxSizing: 'border-box', marginBottom: '10px' },
    emptyState: { padding: '30px 10px', textAlign: 'center', color: '#adb5bd', fontSize: '14px' },

    list: { listStyle: 'none', padding: 0, margin: 0 },
    itemAluno: { padding: '12px 15px', borderBottom: '1px solid #f1f3f5' },
    itemOcorrencia: { padding: '20px', borderBottom: '1px solid #f1f3f5' },
    alunoName: { fontWeight: '600', color: '#212529', marginRight: '8px' },
    turmaTag: { fontSize: '12px', color: '#868e96', background: '#f8f9fa', padding: '2px 6px', borderRadius: '4px', border: '1px solid #dee2e6' },
    descricaoTexto: { margin: 0, color: '#495057', lineHeight: '1.5', fontSize: '14px' },
    dataFooter: { fontSize: '11px', color: '#adb5bd', marginTop: '10px' },
    btnPrimary: { background: '#0056b3', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
    counterBadge: { background: '#e9ecef', color: '#495057', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' },
    spinner: { border: '4px solid #f3f3f3', borderTop: '4px solid #003366', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' },
    badge: (tipo) => {
        let bg = '#17a2b8';
        if (tipo === 'AGRESSAO') bg = '#dc3545';
        if (tipo === 'COMPORTAMENTO') bg = '#ffc107';
        if (tipo === 'TAREFA') bg = '#6c757d';
        return { background: bg, color: tipo === 'COMPORTAMENTO' ? '#212529' : 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' };
    }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default Dashboard;