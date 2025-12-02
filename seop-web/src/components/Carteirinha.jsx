import React from 'react';
import { QrCode } from 'lucide-react';

export const Carteirinha = ({ aluno, fechar }) => {
    if (!aluno) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm" onClick={fechar}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-xs transform transition-all scale-100" onClick={e => e.stopPropagation()}>

                {/* Topo Azul */}
                <div className="bg-[#003366] p-6 text-center relative">
                    <h2 className="text-white font-bold text-lg tracking-wider">EduSync</h2>
                    <p className="text-blue-200 text-xs uppercase tracking-widest mt-1">Carteira Estudantil</p>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                        <div className="w-20 h-20 bg-gray-200 rounded-full border-4 border-white flex items-center justify-center text-2xl font-bold text-gray-400">
                            {/* Foto Fake */}
                            {aluno.nome[0]}
                        </div>
                    </div>
                </div>

                {/* Dados */}
                <div className="pt-12 pb-6 px-6 text-center">
                    <h3 className="font-bold text-xl text-gray-800 leading-tight">{aluno.nome}</h3>
                    <p className="text-sm text-gray-500 mt-1">{aluno.turma}</p>

                    <div className="mt-6 space-y-3 text-left bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-xs text-gray-400 uppercase font-bold">Matrícula</span>
                            <span className="text-sm font-mono font-bold text-gray-700">{aluno.matricula}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-xs text-gray-400 uppercase font-bold">Validade</span>
                            <span className="text-sm font-bold text-gray-700">12/2025</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-gray-400 uppercase font-bold">Nasc.</span>
                            <span className="text-sm font-bold text-gray-700">16/10/2008</span>
                        </div>
                    </div>

                    {/* QR Code Falso para visual */}
                    <div className="mt-6 flex flex-col items-center justify-center">
                        <QrCode size={64} className="text-gray-800" />
                        <p className="text-[10px] text-gray-400 mt-2">Uso exclusivo para identificação escolar.</p>
                    </div>
                </div>

                <button onClick={fechar} className="w-full py-4 bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition border-t border-gray-200">FECHAR</button>
            </div>
        </div>
    );
};