import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { DeclaracaoMatricula } from '../components/DeclaracaoMatricula';
import { ArrowLeft, Printer, FileSignature, Loader2 } from 'lucide-react';

function VisualizarDeclaracao() {
    const { alunoId } = useParams();
    const [aluno, setAluno] = useState(null);
    const componentRef = useRef();

    useEffect(() => {
        async function carregarAluno() {
            try {
                const res = await api.get('/alunos');
                const encontrado = res.data.find(a => a.id === Number(alunoId));
                setAluno(encontrado);
            } catch (error) {
                console.error("Erro ao carregar aluno:", error);
            }
        }
        carregarAluno();
    }, [alunoId]);

    const handlePrint = () => {
        window.print();
    };

    if (!aluno) return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white gap-3">
            <Loader2 className="animate-spin h-10 w-10 text-amber-500" />
            <p className="font-medium">Gerando documento...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col font-sans">

            <style>{`
        @media print {
          .no-print { display: none !important; }
          
          body, #root, .min-h-screen {
            background-color: white !important;
            height: auto !important;
          }

          #area-declaracao { 
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
            transform: scale(0.95);
            transform-origin: top center;
          }
          
          .overflow-auto { overflow: visible !important; }
          @page { margin: 0.5cm; size: A4; }
        }
      `}</style>

            {/* TOOLBAR */}
            <div className="no-print bg-gray-900 text-white shadow-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-500 p-2 rounded-lg shadow-lg text-gray-900">
                        <FileSignature size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-wide">{aluno.nome}</h1>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Declaração de Matrícula Oficial</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link to="/">
                        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-bold transition flex items-center gap-2 border border-gray-600">
                            <ArrowLeft size={16} /> Voltar
                        </button>
                    </Link>

                    <button
                        onClick={handlePrint}
                        className="px-6 py-2 bg-secondary-green hover:bg-green-600 text-white rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-lg hover:shadow-green-900/20"
                    >
                        <Printer size={18} /> Imprimir / PDF
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-800/50 backdrop-blur-sm">
                <div id="area-declaracao" className="bg-white shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }} ref={componentRef}>
                    <DeclaracaoMatricula aluno={aluno} />
                </div>
            </div>

        </div>
    );
}

export default VisualizarDeclaracao;