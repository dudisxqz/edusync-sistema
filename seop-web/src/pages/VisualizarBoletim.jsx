import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useReactToPrint } from 'react-to-print';
import { Boletim } from '../components/Boletim';

function VisualizarBoletim() {
    const { alunoId } = useParams();
    const [aluno, setAluno] = useState(null);
    const [notas, setNotas] = useState([]);
    const [frequencias, setFrequencias] = useState([]); // NOVO ESTADO
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

                    // 3. Busca Frequências (NOVO)
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

    if (!aluno) return <div className="min-h-screen bg-gray-800 flex items-center justify-center text-white">Carregando documento...</div>;

    return (
        <div className="min-h-screen bg-gray-700 flex flex-col font-sans">

            {/* CSS DE IMPRESSÃO BLINDADO */}
            <style>{`
        @media print {
          /* Esconde tudo */
          body * {
            visibility: hidden;
          }
          
          /* Mostra apenas a área do boletim e seus filhos */
          #area-do-boletim, #area-do-boletim * {
            visibility: visible !important;
          }

          /* Posiciona o boletim no topo absoluto da folha */
          #area-do-boletim {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            
            /* Ajuste de escala para caber na folha A4 */
            transform: scale(0.95);
            transform-origin: top left;
          }

          /* Remove margens do navegador */
          @page { margin: 0; size: auto; }
        }
      `}</style>

            {/* TOOLBAR */}
            <div className="bg-gray-900 text-white shadow-md p-4 flex flex-col md:flex-row justify-between items-center gap-4 no-print sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-white text-gray-900 p-2 rounded">📄</div>
                    <div>
                        <h1 className="font-bold text-lg">{aluno.nome}</h1>
                        <p className="text-xs text-gray-400">Visualização de Boletim Oficial</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link to="/">
                        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-bold transition">Voltar</button>
                    </Link>

                    <button
                        onClick={gerarParecer}
                        disabled={loadingIA || relatorioIA}
                        className={`px-4 py-2 rounded text-sm font-bold transition flex items-center gap-2 ${loadingIA || relatorioIA ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                    >
                        {loadingIA ? '🤖 Analisando...' : relatorioIA ? '✅ IA Gerada' : '✨ Gerar Parecer IA'}
                    </button>

                    <button onClick={handlePrint} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-bold transition flex items-center gap-2">
                        🖨️ Imprimir
                    </button>
                </div>
            </div>

            {/* PREVIEW */}
            <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-600">
                <div id="area-do-boletim" className="bg-white shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }} ref={componentRef}>
                    <Boletim
                        aluno={aluno}
                        notas={notas}
                        frequencias={frequencias} // Passamos as frequências aqui!
                        relatorioIA={relatorioIA}
                    />
                </div>
            </div>
        </div>
    );
}

export default VisualizarBoletim;