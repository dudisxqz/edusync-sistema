import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Sidebar } from '../components/Sidebar';
import { BookOpen, Clock, Save, PlusCircle } from 'lucide-react';

function Tarefas() {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const [tarefas, setTarefas] = useState([]);
    const [loading, setLoading] = useState(true);

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataEntrega, setDataEntrega] = useState('');
    const [turma, setTurma] = useState('3º Ano A');
    const [materia, setMateria] = useState('MATEMATICA');

    const isStaff = ['ADMIN', 'PROFESSOR', 'COORDENADOR'].includes(user?.role);

    useEffect(() => { carregarTarefas(); }, []);

    async function carregarTarefas() {
        try { const resp = await api.get('/tarefas'); setTarefas(resp.data || []); } catch (e) { console.error(e); } finally { setLoading(false); }
    }

    async function handleCriar(e) {
        e.preventDefault();
        try { await api.post('/tarefas', { titulo, descricao, dataEntrega, turma, materia }); addToast("Criada!", "success"); setTitulo(''); setDescricao(''); setDataEntrega(''); carregarTarefas(); } catch { addToast("Erro.", "error"); }
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><BookOpen className="text-yellow-500"/> Tarefas</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {isStaff && (
                        <div className="bg-white p-6 rounded-xl shadow-sm h-fit border border-gray-200">
                            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><PlusCircle size={18} className="text-blue-600"/> Nova Tarefa</h3>
                            <form onSubmit={handleCriar} className="space-y-4">
                                <input type="text" placeholder="Título" value={titulo} onChange={e=>setTitulo(e.target.value)} className="w-full p-2 border rounded" required />
                                <div className="grid grid-cols-2 gap-2">
                                    <select value={turma} onChange={e=>setTurma(e.target.value)} className="w-full p-2 border rounded bg-white"><option>3º Ano A</option><option>2º Ano B</option></select>
                                    <select value={materia} onChange={e=>setMateria(e.target.value)} className="w-full p-2 border rounded bg-white"><option>MATEMATICA</option><option>PORTUGUES</option></select>
                                </div>
                                <input type="date" value={dataEntrega} onChange={e=>setDataEntrega(e.target.value)} className="w-full p-2 border rounded" required />
                                <textarea rows="3" placeholder="Descrição..." value={descricao} onChange={e=>setDescricao(e.target.value)} className="w-full p-2 border rounded resize-none" required></textarea>
                                <button type="submit" className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition">Publicar</button>
                            </form>
                        </div>
                    )}
                    <div className="lg:col-span-2 space-y-4">
                        {tarefas.map(t => (
                            <div key={t.id} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-yellow-400">
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-bold text-gray-800">{t.titulo}</h4>
                                    <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">{t.materia} • {t.turma}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">{t.descricao}</p>
                                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit"><Clock size={14}/> Entrega: {new Date(t.dataEntrega).toLocaleDateString()}</div>
                            </div>
                        ))}
                        {tarefas.length === 0 && <div className="text-center py-20 text-gray-400">Nenhuma tarefa.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Tarefas;