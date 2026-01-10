import { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { ArrowLeft, Calendar, Clock, Edit3, XCircle } from 'lucide-react';

function GradeHoraria() {
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();

    const [grade, setGrade] = useState([]);
    const [loading, setLoading] = useState(true);

    const turmaUrl = searchParams.get('turma');
    const [turmaSelecionada, setTurmaSelecionada] = useState(turmaUrl || '3º Ano A');
    const [celulaEditando, setCelulaEditando] = useState(null);

    const podeEditar = ['ADMIN', 'COORDENADOR', 'SECRETARIA', 'DIRETOR'].includes(user?.role);
    const isFamily = ['RESPONSAVEL', 'ALUNO'].includes(user?.role);
    const selecaoTravada = isFamily && turmaUrl;

    const turmas = ["3º Ano A", "2º Ano B"];
    const HORARIOS = [
        { id: 'H07_00', label: '07:00 - 07:50' },
        { id: 'H07_50', label: '07:50 - 08:40' },
        { id: 'H08_40', label: '08:40 - 09:30' },
        { id: 'H09_50', label: '09:50 - 10:40' },
        { id: 'H10_40', label: '10:40 - 11:30' },
    ];
    const DIAS = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'];
    const MATERIAS = ["MATEMATICA", "PORTUGUES", "HISTORIA", "GEOGRAFIA", "CIENCIAS", "INGLES", "EDUCACAO_FISICA", "ARTE"];

    useEffect(() => {
        async function carregarGrade() {
            setLoading(true);
            try {
                const turmaParaBuscar = decodeURIComponent(turmaSelecionada);
                const resp = await api.get(`/grade/${turmaParaBuscar}`);
                setGrade(resp.data || []);
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        }
        carregarGrade();
    }, [turmaSelecionada]);

    const getAula = (dia, horarioId) => grade.find(aula => aula.dia === dia && aula.horario === horarioId);

    async function handleSalvarAula(dia, horario, novaMateria) {
        try {
            const novaGrade = [...grade.filter(a => !(a.dia === dia && a.horario === horario))];
            if (novaMateria) novaGrade.push({ dia, horario, materia: novaMateria, turma: turmaSelecionada });
            setGrade(novaGrade);
            setCelulaEditando(null);

            if (novaMateria) await api.post('/grade', { turma: turmaSelecionada, dia, horario, materia: novaMateria });
            else await api.delete('/grade/limpar', { data: { turma: turmaSelecionada, dia, horario, materia: 'MATEMATICA' } });
        } catch (erro) {
            alert("Erro ao salvar horário.");
        }
    }

    const getCorMateria = (materia) => {
        const cores = {
            MATEMATICA: 'bg-blue-100 text-blue-800 border-blue-200',
            PORTUGUES: 'bg-red-100 text-red-800 border-red-200',
            HISTORIA: 'bg-amber-100 text-amber-800 border-yellow-200',
            GEOGRAFIA: 'bg-emerald-100 text-emerald-800 border-green-200',
            CIENCIAS: 'bg-purple-100 text-purple-800 border-purple-200',
            INGLES: 'bg-pink-100 text-pink-800 border-pink-200',
            EDUCACAO_FISICA: 'bg-orange-100 text-orange-800 border-orange-200',
            ARTE: 'bg-teal-100 text-teal-800 border-teal-200',
        };
        return cores[materia] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Calendar className="text-indigo-500" /> Quadro de Horários
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {podeEditar ? "Modo Edição Habilitado" : "Visualização de Aulas"}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                            <span className="text-xs font-bold text-gray-400 uppercase ml-2">TURMA:</span>

                            {selecaoTravada ? (
                                <div className="px-4 py-1 font-bold text-gray-600">{turmaSelecionada}</div>
                            ) : (
                                <select value={turmaSelecionada} onChange={(e) => setTurmaSelecionada(e.target.value)} className="bg-transparent font-bold text-gray-700 outline-none cursor-pointer py-1">
                                    {turmas.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            )}
                        </div>

                        {selecaoTravada && (
                            <Link to="/">
                                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-bold transition flex items-center gap-2">
                                    <ArrowLeft size={16} /> Voltar
                                </button>
                            </Link>
                        )}
                    </div>


                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {loading ? (
                            <div className="p-20 text-center text-gray-400">Carregando grade...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px]">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-32">Horário</th>
                                        {DIAS.map(d => <th key={d} className="py-4 px-2 text-center text-xs font-bold text-indigo-900 uppercase tracking-wider flex-1">{d}</th>)}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {HORARIOS.map(h => (
                                        <tr key={h.id} className="hover:bg-gray-50/50 transition">
                                            <td className="py-4 px-6 border-r border-gray-100">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                                    <Clock size={14} className="text-gray-300" /> {h.label.split(' ')[0]}
                                                </div>
                                            </td>
                                            {DIAS.map(d => {
                                                const aula = getAula(d, h.id);
                                                const isEditing = celulaEditando?.dia === d && celulaEditando?.horario === h.id;
                                                return (
                                                    <td key={d} className="p-2 text-center align-middle relative h-20" onClick={() => podeEditar && !isEditing && setCelulaEditando({ dia: d, horario: h.id })}>
                                                        {isEditing ? (
                                                            <div className="absolute inset-1 z-10 bg-white shadow-lg rounded-lg border border-indigo-500 p-1 flex flex-col justify-center">
                                                                <select autoFocus className="w-full text-xs font-bold text-center outline-none mb-1" onChange={e => handleSalvarAula(d, h.id, e.target.value)} defaultValue="">
                                                                    <option value="" disabled>Selecione...</option>
                                                                    {MATERIAS.map(m => <option key={m} value={m}>{m}</option>)}
                                                                </select>
                                                                <button onClick={(e) => {e.stopPropagation(); handleSalvarAula(d, h.id, null)}} className="text-[10px] text-red-500 hover:bg-red-50 rounded w-full">LIMPAR</button>
                                                            </div>
                                                        ) : aula ? (
                                                            <div className={`w-full h-full rounded-lg flex items-center justify-center text-[10px] font-bold border ${getCorMateria(aula.materia)} shadow-sm group relative cursor-pointer`}>
                                                                {aula.materia}
                                                                {podeEditar && <Edit3 size={12} className="absolute top-1 right-1 opacity-0 group-hover:opacity-50" />}
                                                            </div>
                                                        ) : (
                                                            <div className={`w-full h-full rounded-lg border-2 border-dashed border-gray-100 flex items-center justify-center ${podeEditar ? 'hover:bg-gray-50 cursor-pointer' : ''}`}>
                                                                {podeEditar && <span className="text-gray-200 text-lg">+</span>}
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GradeHoraria;