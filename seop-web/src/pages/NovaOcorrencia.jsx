import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { Sidebar } from '../components/Sidebar';
import { Save, Sparkles, Loader2, AlertTriangle } from 'lucide-react';

function NovaOcorrencia() {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState([]);
    const [alunoId, setAlunoId] = useState('');
    const [turmaDisplay, setTurmaDisplay] = useState('');
    const [tipo, setTipo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [carregandoIA, setCarregandoIA] = useState(false);

    useEffect(() => { api.get('/alunos').then(res => setAlunos(res.data)); }, []);

    function handleAlunoChange(e) {
        const id = e.target.value;
        setAlunoId(id);
        setTurmaDisplay(alunos.find(a => a.id == id)?.turma || '');
    }

    async function handleMelhorarTexto() {
        if (!descricao) return addToast('Escreva algo primeiro!', 'error');
        try {
            setCarregandoIA(true);
            const resp = await api.post('/ocorrencias/ia/melhorar-texto', descricao, { headers: { 'Content-Type': 'text/plain' } });
            setDescricao(resp.data);
            addToast('Texto melhorado com IA!', 'success');
        } catch { addToast('Erro na IA.', 'error'); } finally { setCarregandoIA(false); }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.post('/ocorrencias', { alunoId, tipo, descricao });
            addToast('Ocorrência salva!', 'success');
            navigate('/');
        } catch { addToast('Erro ao salvar.', 'error'); }
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8 flex items-center justify-center">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
                        <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><AlertTriangle size={24}/></div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-800">Nova Ocorrência</h2>
                            <p className="text-sm text-gray-500">Registro disciplinar oficial</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Aluno</label>
                                <select value={alunoId} onChange={handleAlunoChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition">
                                    <option value="" disabled>Selecione...</option>
                                    {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Turma</label>
                                <input type="text" value={turmaDisplay} disabled className="w-full p-3 bg-gray-100 border-none rounded-xl text-gray-500" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tipo</label>
                                <select value={tipo} onChange={e => setTipo(e.target.value)} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition">
                                    <option value="" disabled>Selecione...</option>
                                    <option value="COMPORTAMENTO">Comportamento</option>
                                    <option value="ATRASO">Atraso</option>
                                    <option value="AGRESSAO">Agressão</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Descrição</label>
                                <button type="button" onClick={handleMelhorarTexto} disabled={carregandoIA} className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700 transition disabled:opacity-50">
                                    {carregandoIA ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>} Melhorar com IA
                                </button>
                            </div>
                            <textarea rows="5" value={descricao} onChange={e => setDescricao(e.target.value)} required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-700" placeholder="Descreva o ocorrido..."></textarea>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition transform hover:-translate-y-1">
                                <Save size={18} /> Salvar Registro
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default NovaOcorrencia;