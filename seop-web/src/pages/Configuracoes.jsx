import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Sidebar } from '../components/Sidebar';
import { useToast } from '../contexts/ToastContext';
import {
    Settings, Save, X, Calendar, ListOrdered, Bot, Sparkles, AlertCircle, Loader2
} from 'lucide-react';

function Configuracoes() {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [anoLetivo, setAnoLetivo] = useState(2025);
    const [periodos, setPeriodos] = useState({ p1: '', p2: '', p3: '', p4: '' });
    const [iaHabilitada, setIaHabilitada] = useState(true);
    const [iaLimite, setIaLimite] = useState(1200);

    useEffect(() => {
        async function carregarConfig() {
            try {
                const res = await api.get('/configuracoes');
                const data = res.data;
                if (data) {
                    setAnoLetivo(data.anoLetivo);
                    setPeriodos({
                        p1: data.periodo1, p2: data.periodo2, p3: data.periodo3, p4: data.periodo4
                    });
                    setIaHabilitada(data.iaHabilitada);
                    setIaLimite(data.iaLimite);
                }
            } catch (error) {
                console.error("Erro ao carregar configurações:", error);
            }
        }
        carregarConfig();
    }, []);

    async function handleSalvar(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/configuracoes', {
                anoLetivo: parseInt(anoLetivo),
                periodo1: periodos.p1,
                periodo2: periodos.p2,
                periodo3: periodos.p3,
                periodo4: periodos.p4,
                iaHabilitada,
                iaLimite: parseInt(iaLimite)
            });

            addToast("Configurações salvas com sucesso!", "success");
        } catch (erro) {
            addToast("Erro ao salvar configurações.", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />

            <div className="flex-1 md:ml-64 p-8 overflow-y-auto h-full">

                <header className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Settings className="text-gray-600" size={32} /> Configurações da Escola
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Defina os parâmetros globais do sistema.</p>
                </header>

                <form onSubmit={handleSalvar} className="max-w-4xl space-y-6">

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Calendar size={20} className="text-blue-600"/> Definição do Ano Letivo
                        </h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ano Corrente</label>
                            <input
                                type="number"
                                value={anoLetivo}
                                onChange={e => setAnoLetivo(e.target.value)}
                                className="w-32 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <ListOrdered size={20} className="text-blue-600"/> Períodos Avaliativos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.keys(periodos).map((key, index) => (
                                <div key={key}>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{index + 1}º Período</label>
                                    <input
                                        type="text"
                                        value={periodos[key]}
                                        onChange={e => setPeriodos({...periodos, [key]: e.target.value})}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Bot size={20} className="text-purple-600"/> Controle de IA Pedagógica
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600"><Sparkles size={20}/></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm">Geração Automática</h4>
                                        <p className="text-xs text-gray-500">Habilitar criação de pareceres descritivos.</p>
                                    </div>
                                </div>
                                <input type="checkbox" checked={iaHabilitada} onChange={e => setIaHabilitada(e.target.checked)} className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Limite de Caracteres</label>
                                <input
                                    type="number"
                                    value={iaLimite}
                                    onChange={e => setIaLimite(e.target.value)}
                                    disabled={!iaHabilitada}
                                    className="w-32 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button type="button" onClick={() => navigate('/')} className="px-6 py-3 border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition flex items-center gap-2 text-sm"><X size={18} /> Cancelar</button>
                        <button type="submit" disabled={loading} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition flex items-center gap-2 text-sm disabled:opacity-70">
                            {loading ? <Loader2 className="animate-spin"/> : <><Save size={18} /> Salvar Preferências</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Configuracoes;