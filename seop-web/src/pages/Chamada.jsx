import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { useToast } from '../contexts/ToastContext';
import { CalendarDays, Save, CheckCircle2, XCircle, BookOpen, Users } from 'lucide-react';

function Chamada() {
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [alunos, setAlunos] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState('');
    const [dataChamada, setDataChamada] = useState(new Date().toISOString().split('T')[0]);
    const [presencas, setPresencas] = useState({});
    const [conteudo, setConteudo] = useState('');
    const [saving, setSaving] = useState(false);

    // 1. Carregar Dados
    useEffect(() => {
        api.get('/alunos').then(res => {
            setAlunos(res.data);
            setTurmas([...new Set(res.data.map(a => a.turma))].sort());
        }).catch(() => addToast("Erro ao carregar.", "error"));
    }, [addToast]);

    // 2. Filtrar Alunos (DEPOIS de carregar)
    const alunosDaTurma = alunos.filter(a => a.turma === turmaSelecionada);

    // 3. Inicializar Presenças (Quando a turma muda)
    useEffect(() => {
        if (alunosDaTurma.length > 0) {
            const inicial = {};
            alunosDaTurma.forEach(a => inicial[a.id] = true);
            setPresencas(inicial);
        }
    }, [turmaSelecionada, alunos]); // Dependências corretas

    function togglePresenca(id) {
        setPresencas(prev => ({ ...prev, [id]: !prev[id] }));
    }

    async function handleSalvarChamada() {
        if (!turmaSelecionada) return addToast("Selecione a turma!", "error");
        setSaving(true);
        try {
            const payload = alunosDaTurma.map(a => ({ alunoId: a.id, data: dataChamada, presente: presencas[a.id] }));
            await api.post('/frequencias/lote', payload);
            if(conteudo) await api.post('/diarios', { data: dataChamada, turma: turmaSelecionada, conteudoMinistrado: conteudo });
            addToast("Chamada salva!", "success");
            navigate('/');
        } catch { addToast("Erro ao salvar.", "error"); }
        finally { setSaving(false); }
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><CalendarDays className="text-purple-600"/> Diário de Classe</h1>

                <div className="bg-white p-6 rounded-xl shadow-sm mb-6 grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1">TURMA</label>
                        <select value={turmaSelecionada} onChange={e=>setTurmaSelecionada(e.target.value)} className="w-full p-2 border rounded"><option value="">Selecione...</option>{turmas.map(t=><option key={t}>{t}</option>)}</select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1">DATA</label>
                        <input type="date" value={dataChamada} onChange={e=>setDataChamada(e.target.value)} className="w-full p-2 border rounded"/>
                    </div>
                </div>

                {turmaSelecionada && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b font-bold text-gray-700 flex items-center gap-2"><Users size={16}/> Alunos</div>
                            <div className="max-h-[400px] overflow-y-auto">
                                {alunosDaTurma.map(a => (
                                    <div key={a.id} onClick={()=>togglePresenca(a.id)} className={`p-3 flex justify-between items-center cursor-pointer border-b border-gray-50 hover:bg-gray-50 ${!presencas[a.id]?'bg-red-50':''}`}>
                                        <span className="font-bold text-sm text-gray-700">{a.nome}</span>
                                        {presencas[a.id] ? <CheckCircle2 className="text-green-500" size={20}/> : <XCircle className="text-red-500" size={20}/>}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <label className="text-xs font-bold text-gray-400 block mb-2"><BookOpen size={14} className="inline mr-1"/> CONTEÚDO</label>
                                <textarea value={conteudo} onChange={e=>setConteudo(e.target.value)} className="w-full p-2 border rounded h-32 resize-none text-sm" placeholder="O que foi dado hoje?"></textarea>
                            </div>
                            <button onClick={handleSalvarChamada} disabled={saving} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition flex justify-center gap-2">
                                {saving ? "Salvando..." : <><Save size={18}/> Salvar Diário</>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default Chamada;