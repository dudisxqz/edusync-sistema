import React from 'react';

export const Boletim = React.forwardRef(({ aluno, notas, frequencias, relatorioIA }, ref) => {

    const dadosAluno = aluno || { nome: "", matricula: "", turma: "", id: 0 };
    const materias = ["PORTUGUES", "MATEMATICA", "HISTORIA", "GEOGRAFIA", "CIENCIAS", "INGLES", "EDUCACAO_FISICA", "ARTE"];
    const safeNotas = notas || [];
    const safeFreq = frequencias || [];


    const totalFaltasGeral = safeFreq.filter(f => f.presente === false).length;

    const getNota = (materia, bim) => {
        const n = safeNotas.find(nota => nota.aluno?.id === dadosAluno.id && nota.materia === materia && nota.bimestre === bim);
        return n ? n.valor.toFixed(1) : "-";
    };

    const getMediaFinal = (materia) => {
        const notasDaMateria = safeNotas.filter(n => n.aluno?.id === dadosAluno.id && n.materia === materia);
        if (notasDaMateria.length === 0) return "-";
        const total = notasDaMateria.reduce((acc, n) => acc + n.valor, 0);
        return (total / notasDaMateria.length).toFixed(1);
    };

    const formatarTextoIA = (texto) => {
        if (!texto) return [];
        const textoLimpo = texto.replace(/\*\*/g, '').replace(/##/g, '');
        return textoLimpo.split('\n').filter(p => p.trim() !== '');
    };

    return (
        <div ref={ref} style={styles.page}>
            <div style={styles.header}>
                <div style={{fontSize:'10px', fontWeight:'bold', textTransform:'uppercase'}}>Secretaria de Estado da Educação</div>
                <h1 style={{margin: '5px 0', fontSize: '16px', color: '#003366', textTransform:'uppercase'}}>Governo do Estado de Rondônia</h1>
                <div style={{fontSize:'12px', borderTop:'1px solid #000', borderBottom:'1px solid #000', padding:'5px', marginTop:'10px'}}>
                    BOLETIM ESCOLAR - ANO LETIVO 2025
                </div>
            </div>

            <div style={styles.infoBox}>
                <div style={styles.row}>
                    <div style={styles.col}><strong>Escola:</strong> EEEM MAJOR GUAPINDAIA</div>
                    <div style={styles.col}><strong>Município:</strong> PORTO VELHO - RO</div>
                </div>
                <div style={styles.row}>
                    <div style={styles.col}><strong>Nome:</strong> {dadosAluno.nome}</div>
                    <div style={styles.col}><strong>Matrícula:</strong> {dadosAluno.matricula}</div>
                </div>
                <div style={styles.row}>
                    <div style={styles.col}><strong>Turma:</strong> {dadosAluno.turma}</div>
                    <div style={styles.col}><strong>Turno:</strong> INTEGRAL</div>
                </div>
            </div>

            <table style={styles.table}>
                <thead>
                <tr style={{background: '#f0f0f0'}}>
                    <th style={{...styles.th, width: '180px'}}>Componente Curricular</th>
                    <th style={styles.th}>1ºB</th> <th style={styles.th}>F.1</th>
                    <th style={styles.th}>2ºB</th> <th style={styles.th}>F.2</th>
                    <th style={styles.th}>3ºB</th> <th style={styles.th}>F.3</th>
                    <th style={styles.th}>4ºB</th> <th style={styles.th}>F.4</th>
                    <th style={styles.th}>M.F.</th>
                </tr>
                </thead>
                <tbody>
                {materias.map(mat => (
                    <tr key={mat}>
                        <td style={{...styles.td, textAlign: 'left', paddingLeft:'5px'}}>{mat}</td>
                        <td style={styles.td}>{getNota(mat, 1)}</td> <td style={styles.td}>-</td>
                        <td style={styles.td}>{getNota(mat, 2)}</td> <td style={styles.td}>-</td>
                        <td style={styles.td}>{getNota(mat, 3)}</td> <td style={styles.td}>-</td>
                        <td style={styles.td}>{getNota(mat, 4)}</td> <td style={styles.td}>-</td>
                        <td style={{...styles.td, fontWeight:'bold', background:'#e9ecef'}}>{getMediaFinal(mat)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div style={{marginTop:'10px', border:'1px solid #999', padding:'5px', display:'flex', justifyContent:'space-between', fontSize:'11px', fontWeight:'bold', background: '#f9f9f9'}}>
                <div>Situação da Turma: FECHADA</div>

                <div style={{color: totalFaltasGeral > 10 ? 'red' : 'black'}}>
                    Total de Faltas Registradas: {totalFaltasGeral}
                </div>

                <div>Situação: <span style={{color:'green'}}>CURSANDO</span></div>
            </div>

            {relatorioIA && (
                <div style={{marginTop: '20px', border:'1px solid #999', padding:'10px'}}>
                    <h4 style={{margin:'0 0 10px 0', fontSize:'12px', textTransform:'uppercase', borderBottom:'1px solid #eee', paddingBottom:'5px'}}>
                        OBSERVAÇÃO PEDAGÓGICA
                    </h4>
                    <div style={{fontSize:'11px', textAlign:'justify', lineHeight:'1.6', fontFamily:'Times New Roman, serif'}}>
                        {formatarTextoIA(relatorioIA).map((paragrafo, i) => (
                            <p key={i} style={{marginBottom: '8px', textIndent: '20px'}}>{paragrafo}</p>
                        ))}
                    </div>
                </div>
            )}

            <div style={{marginTop:'40px', display:'flex', justifyContent:'space-around', textAlign:'center', fontSize:'10px'}}>
                <div style={{borderTop:'1px solid #000', width:'200px', paddingTop:'5px'}}>Direção</div>
                <div style={{borderTop:'1px solid #000', width:'200px', paddingTop:'5px'}}>Secretaria</div>
            </div>
        </div>
    );
});

const styles = {
    page: { padding: '20px 30px', fontFamily: 'Arial, sans-serif', color: '#000', background: 'white', width: '100%', boxSizing: 'border-box' },
    header: { textAlign: 'center', marginBottom: '15px' },
    infoBox: { border: '1px solid #999', padding: '8px', marginBottom: '15px', fontSize: '11px' },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '3px' },
    col: { flex: 1 },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '10px', textAlign: 'center' },
    th: { border: '1px solid #666', padding: '3px', background: '#ddd', fontWeight: 'bold' },
    td: { border: '1px solid #666', padding: '3px' }
};