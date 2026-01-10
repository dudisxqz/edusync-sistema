import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { ArrowLeft, CalendarDays, CheckCircle2, XCircle, User } from 'lucide-react';

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

    if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">Carregando histórico...</div>;
    if (!aluno) return null;

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />

            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">

                <header className="mb-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 text-green-700 rounded-xl shadow-sm">
                            <CalendarDays size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Frequência Escolar</h1>
                            <p className="text-gray-500 text-sm">Histórico de presenças e faltas.</p>
                        </div>
                    </div>
                    <Link to="/">
                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-sm">
                            <ArrowLeft size={16} /> Voltar
                        </button>
                    </Link>
                </header>

                <div className="max-w-4xl mx-auto">

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border-2 border-white shadow-sm">
                            <User size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{aluno.nome}</h2>
                            <div className="flex gap-3 mt-1">
                                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase">{aluno.turma}</span>
                                <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">Mat: {aluno.matricula}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">

                        <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-gray-100">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Mês de Referência</label>
                                <select value={mesSelecionado} onChange={e => setMesSelecionado(parseInt(e.target.value))} className="w-48 px-4 py-2 bg-gray-50 border-none rounded-lg font-bold text-gray-700 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer">
                                    {nomesMeses.map((nome, index) => <option key={index} value={index}>{nome}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Ano</label>
                                <input type="number" value={anoSelecionado} onChange={e => setAnoSelecionado(parseInt(e.target.value))} className="w-24 px-4 py-2 bg-gray-50 border-none rounded-lg font-bold text-gray-700 focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-3 sm:gap-4">
                            {['D','S','T','Q','Q','S','S'].map((d,i) => (
                                <div key={i} className="text-center text-xs font-bold text-gray-300 mb-2">{d}</div>
                            ))}

                            {listaDias.map(dia => {
                                const status = getStatusDia(dia);
                                return (
                                    <div key={dia} className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-200
                            ${status === 'P' ? 'bg-green-50 border-2 border-green-100' : status === 'F' ? 'bg-red-50 border-2 border-red-100' : 'bg-white border border-gray-100'}`}>

                                        <span className={`text-xs font-bold absolute top-1 left-2 ${status ? 'text-gray-600' : 'text-gray-300'}`}>{dia}</span>

                                        {status === 'P' && <CheckCircle2 size={24} className="text-green-500 mt-2" />}
                                        {status === 'F' && <XCircle size={24} className="text-red-500 mt-2" />}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex justify-end gap-6 pt-6 border-t border-gray-50">
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium"><div className="w-3 h-3 bg-green-500 rounded-full"></div> Presente</div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Falta</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default VisualizarFrequencia;