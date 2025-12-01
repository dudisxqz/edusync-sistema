import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Boletim } from '../components/Boletim';
import { ArrowLeft, Printer, Sparkles, CheckCircle2, Loader2, FileText } from 'lucide-react';

function VisualizarBoletim() {
    const { alunoId } = useParams();
    const [aluno, setAluno] = useState(null);
    const [notas, setNotas] = useState([]);
    const [frequencias, setFrequencias] = useState([]); // Estado para as faltas
    const [relatorioIA, setRelatorioIA] = useState('');
    const [loadingIA, setLoadingIA] = useState(false);

    const componentRef = useRef();

    useEffect(() => {
        async function carregarDados() {
            if (alunoId) {
                try {
                    // 1. Busca Aluno
                    const resAlunos = await api.get('/alunos');
                    const encontrado = resAlunos.data.find(a => a.id === Number(alunoId));
                    setAluno(encontrado);

                    // 2. Busca Notas
                    const resNotas = await api.get('/notas');
                    setNotas(resNotas.data);

                    // 3. Busca Frequências (Para contar as faltas no boletim)
                    const resFreq = await api.get(`/frequencias/aluno/${alunoId}`);
                    setFrequencias(resFreq.data || []);

                } catch (error) {
                    console.error("Erro ao carregar dados:", error);
                }
            }
        }
        carregarDados();
    }, [alunoId]);

    const handlePrint = () => {
        console.log("Iniciando impressão...");
        window.print();
    };

    async function gerarParecer() {
        setLoadingIA(true);
        try {
            const resp = await api.get(`/relatorios/gerar/${alunoId}`);
            setRelatorioIA(resp.data);
        } catch (erro) {
            alert("Erro ao gerar parecer.");
        } finally {
            setLoadingIA(false);
        }
    }

    if (!aluno) return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white gap-3">
            <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
            <p className="font-medium">Carregando documento...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col font-sans">

            {/* --- CSS DE IMPRESSÃO SIMPLIFICADO E FUNCIONAL --- */}
            <style>{`
        @media print {
          /* 1. Esconde a barra de topo e botões */
          .no-print { display: none !important; }

          /* 2. Reseta cores de fundo para branco (economia de tinta e visual limpo) */
          body, #root, .min-h-screen {
            background-color: white !important;
            color: black !important;
            height: auto !important;
            overflow: visible !important;
          }

          /* 3. Ajusta o container do papel para ocupar a folha toda */
          #area-do-boletim {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: none !important;
            transform: scale(0.95); /* Leve zoom out para garantir margens */
            transform-origin: top center;
          }
          
          /* 4. Remove scrollbars na impressão */
          .overflow-auto { overflow: visible !important; }
          
          @page { margin: 0.5cm; size: A4; }
        }
      `}</style>

            {/* TOOLBAR (Com a classe no-print para sumir na impressão) */}
            <div className="no-print bg-gray-900 text-white shadow-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
                        <FileText size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-wide">{aluno.nome}</h1>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Boletim Oficial</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/">
                        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-bold transition flex items-center gap-2 border border-gray-600">
                            <ArrowLeft size={16} /> Voltar
                        </button>
                    </Link>

                    <button
                        onClick={gerarParecer}
                        disabled={loadingIA || relatorioIA}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-lg ${loadingIA || relatorioIA ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'}`}
                    >
                        {loadingIA ? <><Loader2 className="animate-spin" size={16} /> Analisando...</> : relatorioIA ? <><CheckCircle2 size={16} /> IA Gerada</> : <><Sparkles size={16} /> Gerar Parecer IA</>}
                    </button>

                    <button
                        onClick={handlePrint}
                        className="px-5 py-2 bg-secondary-green hover:bg-green-600 text-white rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-lg hover:shadow-green-900/20"
                    >
                        <Printer size={18} /> Imprimir
                    </button>
                </div>
            </div>

            {/* ÁREA DE VISUALIZAÇÃO */}
            <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-800/50 backdrop-blur-sm">
                {/* Container branco que simula o papel */}
                <div id="area-do-boletim" className="bg-white shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }} ref={componentRef}>
                    <Boletim
                        aluno={aluno}
                        notas={notas}
                        frequencias={frequencias} // Passando as faltas para o componente
                        relatorioIA={relatorioIA}
                    />
                </div>
            </div>

        </div>
    );
}

export default VisualizarBoletim;