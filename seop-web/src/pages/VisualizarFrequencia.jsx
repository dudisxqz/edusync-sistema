import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function VisualizarFrequencia() {
    const { alunoId } = useParams();
    const [frequencias, setFrequencias] = useState([]);
    const [aluno, setAluno] = useState(null);
    const [loading, setLoading] = useState(true);

    const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
    const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());

    useEffect(() => {
        async function carregar() {
            try {
                setLoading(true);
                const respAlunos = await api.get('/alunos');
                const alunoEncontrado = respAlunos.data.find(a => a.id === Number(alunoId));
                setAluno(alunoEncontrado);
                const respFreq = await api.get(`/frequencias/aluno/${alunoId}`);
                setFrequencias(respFreq.data || []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        if (alunoId) carregar();
    }, [alunoId]);

    const getStatusDia = (dia) => {
        try {
            const dataString = `${anoSelecionado}-${String(mesSelecionado + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            const registro = (frequencias || []).find(f => f.data === dataString);
            if (!registro) return null;
            return registro.presente ? 'P' : 'F';
        } catch { return null; }
    };

    const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const diasNoMes = new Date(anoSelecionado, mesSelecionado + 1, 0).getDate();
    const listaDias = Array.from({ length: diasNoMes }, (_, i) => i + 1);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">Carregando...</div>;
    if (!aluno) return null;

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <nav className="bg-primary-dark text-white shadow-md">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2"><span>📅</span> Histórico de Frequência</h2>
                    <Link to="/"><button className="px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg text-sm font-bold transition">Voltar</button></Link>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* INFO DO ALUNO */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-primary-dark">
                    <h3 className="text-xl font-bold text-gray-800">{aluno.nome}</h3>
                    <p className="text-sm text-gray-500 mt-1">Turma: {aluno.turma} • Matrícula: {aluno.matricula}</p>
                </div>

                {/* CONTROLES */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Mês</label>
                            <select value={mesSelecionado} onChange={e => setMesSelecionado(parseInt(e.target.value))} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-700 focus:ring-2 focus:ring-primary-dark outline-none">
                                {nomesMeses.map((nome, index) => <option key={index} value={index}>{nome}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Ano</label>
                            <input type="number" value={anoSelecionado} onChange={e => setAnoSelecionado(parseInt(e.target.value))} className="w-24 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-700 focus:ring-2 focus:ring-primary-dark outline-none" />
                        </div>
                    </div>

                    {/* CALENDÁRIO GRID */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">Visualização Mensal</h4>
                        <div className="grid grid-cols-7 gap-2 sm:gap-4">
                            {listaDias.map(dia => {
                                const status = getStatusDia(dia);
                                return (
                                    <div key={dia} className="aspect-square border border-gray-100 rounded-lg bg-gray-50 flex flex-col items-center justify-center relative">
                                        <span className="text-xs font-bold text-gray-400 absolute top-1 left-2">{dia}</span>
                                        {status === 'P' && <div className="w-8 h-8 bg-secondary-green text-white rounded flex items-center justify-center font-bold text-sm shadow-sm">P</div>}
                                        {status === 'F' && <div className="w-8 h-8 bg-error-red text-white rounded flex items-center justify-center font-bold text-sm shadow-sm">F</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-6 flex gap-6 text-sm">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-secondary-green rounded"></div> <span className="text-gray-600 font-medium">Presente</span></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-error-red rounded"></div> <span className="text-gray-600 font-medium">Falta</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VisualizarFrequencia;