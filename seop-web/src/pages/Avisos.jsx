import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Sidebar } from '../components/Sidebar';
import { Megaphone, Trash2, Send, Bell } from 'lucide-react';

function Avisos() {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const [avisos, setAvisos] = useState([]);
    const [novoTitulo, setNovoTitulo] = useState('');
    const [novaMensagem, setNovaMensagem] = useState('');
    const [turmaAlvo, setTurmaAlvo] = useState('');

    const isStaff = ['ADMIN', 'SECRETARIA', 'COORDENADOR', 'PROFESSOR'].includes(user?.role);

    useEffect(() => { carregarAvisos(); }, []);

    async function carregarAvisos() {
        try { const resp = await api.get('/avisos'); setAvisos(resp.data); } catch (e) { console.error(e); }
    }

    async function handlePostar(e) {
        e.preventDefault();
        try {
            await api.post('/avisos', { titulo: novoTitulo, mensagem: novaMensagem, turmaAlvo: turmaAlvo || null });
            addToast("Aviso publicado!", "success");
            setNovoTitulo(''); setNovaMensagem(''); setTurmaAlvo('');
            carregarAvisos();
        } catch (e) { addToast("Erro ao publicar.", "error"); }
    }

    async function handleDeletar(id) {
        if (!window.confirm("Apagar este aviso?")) return;
        try { await api.delete(`/avisos/${id}`); addToast("Aviso removido.", "success"); carregarAvisos(); } catch { addToast("Erro.", "error"); }
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">
                <header className="mb-8 flex items-center gap-3">
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl"><Megaphone size={28}/></div>
                    <div><h1 className="text-3xl font-black text-gray-900">Mural de Comunicados</h1><p className="text-gray-500">Avisos oficiais e novidades.</p></div>
                </header>

                <div className="max-w-4xl mx-auto">
                    {isStaff && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><Send size={18}/> Novo Comunicado</h3>
                            <form onSubmit={handlePostar} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <input type="text" placeholder="Título do Aviso" value={novoTitulo} onChange={e => setNovoTitulo(e.target.value)} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div>
                                        <select value={turmaAlvo} onChange={e => setTurmaAlvo(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl bg-white outline-none">
                                            <option value="">Todas as Turmas</option>
                                            <option value="3º Ano A">3º Ano A</option>
                                            <option value="2º Ano B">2º Ano B</option>
                                        </select>
                                    </div>
                                </div>
                                <textarea placeholder="Mensagem..." value={novaMensagem} onChange={e => setNovaMensagem(e.target.value)} required rows="3" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
                                <div className="flex justify-end">
                                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition text-sm shadow-lg shadow-blue-200">Publicar</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-4">
                        {avisos.map(aviso => (
                            <div key={aviso.id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition relative group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2"><Bell size={18} className="text-blue-400"/> {aviso.titulo}</h4>
                                    {isStaff && (
                                        <button onClick={() => handleDeletar(aviso.id)} className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition"><Trash2 size={18} /></button>
                                    )}
                                </div>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm pl-7">{aviso.mensagem}</p>
                                <div className="mt-4 flex justify-between text-xs text-gray-400 pt-3 border-t border-gray-50 pl-7">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-medium">{aviso.turmaAlvo || "Institucional"}</span>
                                    <span>{new Date(aviso.dataPostagem).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                        {avisos.length === 0 && <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2"><Megaphone size={40} className="opacity-20"/><p>Nenhum comunicado no momento.</p></div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Avisos;