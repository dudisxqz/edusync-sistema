import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Save, ArrowLeft, Bot, Sparkles, Loader2 } from 'lucide-react';

function NovaOcorrencia() {
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState([]);

    const [alunoId, setAlunoId] = useState('');
    const [turmaDisplay, setTurmaDisplay] = useState('');
    const [tipo, setTipo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [carregandoIA, setCarregandoIA] = useState(false);

    useEffect(() => {
        api.get('/alunos').then(res => setAlunos(res.data));
    }, []);

    function handleAlunoChange(e) {
        const id = e.target.value;
        setAlunoId(id);
        const aluno = alunos.find(a => a.id == id);
        setTurmaDisplay(aluno ? aluno.turma : '');
    }

    async function handleMelhorarTexto() {
        if (!descricao) {
            alert('⚠️ Escreva algo na descrição primeiro para a IA melhorar!');
            return;
        }

        try {
            setCarregandoIA(true);
            const resp = await api.post('/ocorrencias/ia/melhorar-texto', descricao, {
                headers: { 'Content-Type': 'text/plain' }
            });
            setDescricao(resp.data);
        } catch (erro) {
            console.error(erro);
            alert('❌ Erro ao consultar a IA.');
        } finally {
            setCarregandoIA(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.post('/ocorrencias', { alunoId, tipo, descricao });
            alert('✅ Ocorrência registrada com sucesso!');
            navigate('/');
        } catch (erro) {
            console.error(erro);
            alert('❌ Erro ao salvar!');
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">

                <div className="bg-white px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-primary-dark">Registrar Ocorrência</h2>
                        <p className="text-sm text-gray-500">Formalização de evento disciplinar</p>
                    </div>
                    <Link to="/">
                        <button className="text-gray-400 hover:text-gray-600 font-medium text-sm transition flex items-center gap-1">
                            <ArrowLeft size={16} /> Cancelar
                        </button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Estudante</label>
                        <select
                            value={alunoId}
                            onChange={handleAlunoChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-dark focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50 outline-none transition bg-white"
                        >
                            <option value="" disabled>Selecione na lista...</option>
                            {alunos.map(a => (
                                <option key={a.id} value={a.id}>{a.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Turma</label>
                            <input
                                type="text"
                                value={turmaDisplay}
                                disabled
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                placeholder="Automático"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Classificação</label>
                            <select
                                value={tipo}
                                onChange={e => setTipo(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-dark focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50 outline-none transition bg-white"
                            >
                                <option value="" disabled>Selecione...</option>
                                <option value="COMPORTAMENTO">Comportamento</option>
                                <option value="ATRASO">Atraso</option>
                                <option value="TAREFA">Tarefa não realizada</option>
                                <option value="AGRESSAO">Agressão Física/Verbal</option>
                                <option value="OUTROS">Outros</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Descrição Detalhada</label>

                            <button
                                type="button"
                                onClick={handleMelhorarTexto}
                                disabled={carregandoIA}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md transition transform active:scale-95 ${carregandoIA ? 'bg-gray-400 cursor-wait' : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'}`}
                            >
                                {carregandoIA ? (
                                    <><Loader2 size={12} className="animate-spin" /> Processando...</>
                                ) : (
                                    <><Sparkles size={12} /> Melhorar com IA</>
                                )}
                            </button>
                        </div>

                        <textarea
                            rows="6"
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-dark focus:ring-2 focus:ring-primary-dark focus:ring-opacity-50 outline-none transition text-gray-700 leading-relaxed resize-y"
                            placeholder="Descreva o fato ocorrido de forma objetiva..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-8 py-3 bg-primary-dark hover:bg-opacity-90 text-white font-bold rounded-lg shadow-md transition transform hover:-translate-y-0.5"
                        >
                            <Save size={18} /> Salvar Registro
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default NovaOcorrencia;