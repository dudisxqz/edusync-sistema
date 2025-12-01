import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, CalendarDays, CheckCircle2, XCircle } from 'lucide-react';

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

    if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500 font-medium">Carregando histórico...</div>;
    if (!aluno) return null;

    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-10">
            <nav className="bg-primary-dark text-white shadow-lg">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold flex items-center gap-2 tracking-wide">
                        <CalendarDays size={24} className="text-green-400" /> Histórico de Frequência
                    </h2>
                    <Link to="/">
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition flex items-center gap-2 border border-white/20">
                            <ArrowLeft size={16} /> Voltar
                        </button>
                    </Link>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* INFO ALUNO */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-l-4 border-primary-dark">
                    <h3 className="text-2xl font-bold text-gray-800">{aluno.nome}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded font-medium text-gray-600">Turma: {aluno.turma}</span>
                        <span className="flex items-center">Matrícula: {aluno.matricula}</span>
                    </div>
                </div>

                {/* CONTROLES */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-gray-100">
                        <div className="w-full sm:w-auto">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">Mês de Referência</label>
                            <select value={mesSelecionado} onChange={e => setMesSelecionado(parseInt(e.target.value))} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-700 focus:ring-2 focus:ring-primary-dark outline-none transition">
                                {nomesMeses.map((nome, index) => <option key={index} value={index}>{nome}</option>)}
                            </select>
                        </div>
                        <div className="w-full sm:w-auto">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">Ano</label>
                            <input type="number" value={anoSelecionado} onChange={e => setAnoSelecionado(parseInt(e.target.value))} className="w-28 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-medium text-gray-700 focus:ring-2 focus:ring-primary-dark outline-none transition" />
                        </div>
                    </div>

                    {/* CALENDÁRIO GRID */}
                    <div>
                        <div className="grid grid-cols-7 gap-2 sm:gap-3">
                            {/* Cabeçalho Dias (Opcional, mas fica bonito) */}
                            {['D','S','T','Q','Q','S','S'].map((d, i) => (
                                <div key={i} className="text-center text-xs font-bold text-gray-300 pb-2">{d}</div>
                            ))}

                            {listaDias.map(dia => {
                                const status = getStatusDia(dia);
                                return (
                                    <div key={dia} className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all duration-200
                    ${status === 'P' ? 'bg-green-50 border border-green-200' : status === 'F' ? 'bg-red-50 border border-red-200' : 'bg-white border border-gray-100'}`}>

                                        <span className={`text-xs font-bold absolute top-1 left-2 ${status ? 'text-gray-600' : 'text-gray-300'}`}>{dia}</span>

                                        {status === 'P' && <CheckCircle2 size={24} className="text-secondary-green mt-2" />}
                                        {status === 'F' && <XCircle size={24} className="text-error-red mt-2" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-8 flex gap-6 text-sm justify-end border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-secondary-green" /> <span className="text-gray-600 font-medium">Presente</span></div>
                        <div className="flex items-center gap-2"><XCircle size={18} className="text-error-red" /> <span className="text-gray-600 font-medium">Falta</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VisualizarFrequencia;