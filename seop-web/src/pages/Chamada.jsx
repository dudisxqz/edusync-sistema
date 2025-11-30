import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Chamada() {
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState('');
    const [dataChamada, setDataChamada] = useState(new Date().toISOString().split('T')[0]);
    const [presencas, setPresencas] = useState({});

    useEffect(() => {
        async function carregar() {
            try {
                const resp = await api.get('/alunos');
                setAlunos(resp.data);
                const listaTurmas = [...new Set(resp.data.map(a => a.turma))].sort();
                setTurmas(listaTurmas);
            } catch (e) { console.error(e); }
        }
        carregar();
    }, []);

    const alunosDaTurma = alunos.filter(a => a.turma === turmaSelecionada);

    useEffect(() => {
        if (alunosDaTurma.length > 0) {
            const inicial = {};
            alunosDaTurma.forEach(a => inicial[a.id] = true);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPresencas(inicial);
        }
    }, [turmaSelecionada]);

    function togglePresenca(id) {
        setPresencas(prev => ({ ...prev, [id]: !prev[id] }));
    }

    async function handleSalvarChamada() {
        if (!turmaSelecionada) return alert("Selecione uma turma!");
        const payload = alunosDaTurma.map(aluno => ({ alunoId: aluno.id, data: dataChamada, presente: presencas[aluno.id] }));
        try {
            await api.post('/frequencias/lote', payload);
            alert(`✅ Chamada registrada!`);
            navigate('/');
            // eslint-disable-next-line no-unused-vars
        } catch (erro) { alert("Erro ao salvar."); }
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <nav className="bg-primary-dark text-white shadow-md">
                <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📅</span>
                        <h2 className="text-xl font-bold">Registro de Frequência</h2>
                    </div>
                    <Link to="/">
                        <button className="px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg text-sm font-bold transition">Voltar</button>
                    </Link>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-6 mb-6">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Turma</label>
                            <select value={turmaSelecionada} onChange={e => setTurmaSelecionada(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-dark bg-white">
                                <option value="">-- Selecione a Turma --</option>
                                {turmas.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Data da Aula</label>
                            <input type="date" value={dataChamada} onChange={e => setDataChamada(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-dark" />
                        </div>
                    </div>

                    {turmaSelecionada ? (
                        <div>
                            <div className="flex justify-between items-center mb-4 px-2">
                                <span className="text-sm font-bold text-gray-400 uppercase">Lista de Alunos ({alunosDaTurma.length})</span>
                                <span className="text-xs text-gray-400">Clique na linha para alterar</span>
                            </div>

                            <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
                                {alunosDaTurma.map(aluno => (
                                    <div
                                        key={aluno.id}
                                        onClick={() => togglePresenca(aluno.id)}
                                        className={`p-4 flex justify-between items-center cursor-pointer transition duration-150 border-l-4 ${presencas[aluno.id] ? 'bg-white border-l-secondary-green hover:bg-green-50' : 'bg-red-50 border-l-error-red hover:bg-red-100'}`}
                                    >
                                        <div className="font-semibold text-gray-800">{aluno.nome}</div>

                                        <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${presencas[aluno.id] ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                        {presencas[aluno.id] ? 'PRESENTE' : 'AUSENTE'}
                      </span>
                                            <div className={`w-6 h-6 rounded border flex items-center justify-center ${presencas[aluno.id] ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-gray-300'}`}>
                                                {presencas[aluno.id] && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button onClick={handleSalvarChamada} className="px-8 py-3 bg-primary-dark hover:bg-opacity-90 text-white font-bold rounded-lg shadow-lg transition transform hover:-translate-y-0.5">
                                    💾 Salvar Chamada
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-400">
                            <p className="text-4xl mb-4">🏫</p>
                            <p>Selecione uma turma acima para carregar a lista de alunos.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Chamada;