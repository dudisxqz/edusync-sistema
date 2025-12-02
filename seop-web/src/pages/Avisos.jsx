import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ArrowLeft, Megaphone, Trash2, Send } from 'lucide-react';

function Avisos() {
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const [avisos, setAvisos] = useState([]);
    const [novoTitulo, setNovoTitulo] = useState('');
    const [novaMensagem, setNovaMensagem] = useState('');
    const [turmaAlvo, setTurmaAlvo] = useState('');

    const isStaff = ['ADMIN', 'SECRETARIA', 'COORDENADOR', 'PROFESSOR'].includes(user?.role);

    useEffect(() => {
        carregarAvisos();
    }, []);

    async function carregarAvisos() {
        try {
            // Se for pai, poderia filtrar pela turma do filho, aqui trazemos tudo pra simplificar o demo
            const resp = await api.get('/avisos');
            setAvisos(resp.data);
        } catch (e) { console.error(e); }
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
        try {
            await api.delete(`/avisos/${id}`);
            addToast("Aviso removido.", "success");
            carregarAvisos();
        } catch (e) { addToast("Erro ao apagar.", "error"); }
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-10">
            <nav className="bg-primary-dark text-white shadow-md sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold flex items-center gap-2 tracking-wide">
                        <Megaphone size={24} className="text-yellow-400" /> Mural de Comunicados
                    </h2>
                    <Link to="/"><button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition flex items-center gap-2 border border-white/20"><ArrowLeft size={16} /> Voltar</button></Link>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 py-8">

                {/* FORMULÁRIO DE NOVO AVISO (SÓ STAFF) */}
                {isStaff && (
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
                        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><Send size={18}/> Novo Comunicado</h3>
                        <form onSubmit={handlePostar} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <input type="text" placeholder="Título do Aviso" value={novoTitulo} onChange={e => setNovoTitulo(e.target.value)} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <select value={turmaAlvo} onChange={e => setTurmaAlvo(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                        <option value="">Todas as Turmas</option>
                                        <option value="3º Ano A">3º Ano A</option>
                                        <option value="2º Ano B">2º Ano B</option>
                                    </select>
                                </div>
                            </div>
                            <textarea placeholder="Mensagem..." value={novaMensagem} onChange={e => setNovaMensagem(e.target.value)} required rows="3" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                            <div className="flex justify-end">
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition">Publicar</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* LISTA DE AVISOS */}
                <div className="space-y-4">
                    {avisos.map(aviso => (
                        <div key={aviso.id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 relative group hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg text-gray-800">{aviso.titulo}</h4>
                                {isStaff && (
                                    <button onClick={() => handleDeletar(aviso.id)} className="text-gray-300 hover:text-red-500 transition p-1">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{aviso.mensagem}</p>
                            <div className="mt-4 flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50">
                                <span className="bg-gray-100 px-2 py-1 rounded text-gray-500 font-medium">{aviso.turmaAlvo || "Geral"}</span>
                                <span>{new Date(aviso.dataPostagem).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                    {avisos.length === 0 && <p className="text-center text-gray-400 py-10">Nenhum comunicado recente.</p>}
                </div>

            </div>
        </div>
    );
}

export default Avisos;