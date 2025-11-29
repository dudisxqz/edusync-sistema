import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function NovaOcorrencia() {
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState([]);

    const [alunoId, setAlunoId] = useState('');
    const [turmaDisplay, setTurmaDisplay] = useState('');
    const [tipo, setTipo] = useState(''); // Começa vazio
    const [descricao, setDescricao] = useState('');
    const [carregandoIA, setCarregandoIA] = useState(false); // Para o efeito de carregamento

    useEffect(() => {
        api.get('/alunos').then(res => setAlunos(res.data));
    }, []);

    function handleAlunoChange(e) {
        const id = e.target.value;
        setAlunoId(id);
        const aluno = alunos.find(a => a.id == id);
        setTurmaDisplay(aluno ? aluno.turma : '');
    }


    async function handleMelhorarTexto() {
        if (!descricao) {
            alert('⚠️ Escreva algo na descrição primeiro para a IA melhorar!');
            return;
        }

        try {
            setCarregandoIA(true);
            const resp = await api.post('/ocorrencias/ia/melhorar-texto', descricao, {
                headers: { 'Content-Type': 'text/plain' }
            });
            setDescricao(resp.data);
        } catch (erro) {
            console.error(erro);
            alert('❌ Erro ao consultar a IA. Verifique se o Backend está rodando.');
        } finally {
            setCarregandoIA(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.post('/ocorrencias', { alunoId, tipo, descricao });
            alert('✅ Ocorrência registrada com sucesso!');
            navigate('/');
        } catch (erro) {
            console.error(erro);
            alert('❌ Erro ao salvar! Verifique os dados.');
        }
    }

    return (
        <div style={{ background: '#f4f6f9', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Segoe UI', sans-serif" }}>

            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Registrar Ocorrência</h2>
                    <p style={styles.subtitle}>Preencha os dados abaixo para formalizar o registro.</p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Estudante</label>
                        <select value={alunoId} onChange={handleAlunoChange} required style={styles.select}>
                            <option value="" disabled>Selecione na lista...</option>
                            {alunos.map(a => (
                                <option key={a.id} value={a.id}>{a.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.row}>
                        <div style={{...styles.formGroup, flex: 1, marginRight: '15px'}}>
                            <label style={styles.label}>Turma</label>
                            <input type="text" value={turmaDisplay} disabled style={styles.inputDisabled} />
                        </div>

                        <div style={{...styles.formGroup, flex: 1}}>
                            <label style={styles.label}>Classificação</label>
                            <select value={tipo} onChange={e => setTipo(e.target.value)} required style={styles.select}>
                                <option value="" disabled>Selecione...</option>
                                <option value="COMPORTAMENTO">Comportamento</option>
                                <option value="ATRASO">Atraso</option>
                                <option value="TAREFA">Tarefa não realizada</option>
                                <option value="AGRESSAO">Agressão Física/Verbal</option>
                                <option value="OUTROS">Outros</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{...styles.label, marginBottom: 0}}>Descrição Detalhada</label>

                            <button
                                type="button"
                                onClick={handleMelhorarTexto}
                                disabled={carregandoIA}
                                style={{
                                    background: carregandoIA ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '20px',
                                    padding: '5px 12px',
                                    fontSize: '11px',
                                    cursor: carregandoIA ? 'wait' : 'pointer',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {carregandoIA ? '🤖 Pensando...' : '✨ Melhorar com IA'}
                            </button>
                        </div>

                        <textarea
                            rows="5"
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                            required
                            style={styles.textarea}
                            placeholder="Ex: O aluno xingou o colega e saiu da sala..."
                        />
                    </div>

                    <div style={styles.actions}>
                        <Link to="/" style={styles.btnCancel}>Cancelar</Link>
                        <button type="submit" style={styles.btnSubmit}>Salvar Registro</button>
                    </div>

                </form>
            </div>
        </div>
    );
}

const styles = {
    card: { background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px' },
    header: { marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' },
    title: { margin: '0 0 10px 0', color: '#003366', fontSize: '22px' },
    subtitle: { margin: 0, color: '#6c757d', fontSize: '14px' },
    formGroup: { marginBottom: '20px' },
    row: { display: 'flex' },
    label: { display: 'block', marginBottom: '8px', color: '#495057', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' },
    select: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '14px', background: 'white' },
    inputDisabled: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #e9ecef', background: '#f8f9fa', color: '#495057', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' },
    actions: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '30px', gap: '15px' },
    btnCancel: { textDecoration: 'none', color: '#6c757d', fontSize: '14px', fontWeight: '500' },
    btnSubmit: { background: '#0056b3', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }
};

export default NovaOcorrencia;