import React from 'react';

export const DeclaracaoMatricula = React.forwardRef(({ aluno, tipo = 'matricula', dadosExtras = {} }, ref) => {
    if (!aluno) return <div ref={ref} className="p-10 text-center">Dados do aluno não carregados.</div>;

    const dataHoje = new Date().toLocaleDateString('pt-BR', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const isFrequencia = tipo === 'frequencia';
    const titulo = isFrequencia ? "ATESTADO DE FREQUÊNCIA" : "DECLARAÇÃO DE MATRÍCULA";

    const nomeAluno = aluno.nome ? aluno.nome.toUpperCase() : "NOME NÃO INFORMADO";
    const matricula = aluno.matricula || "---";
    const turma = aluno.turma || "---";

    return (
        <div ref={ref} style={styles.page}>

            <div style={styles.header}>
                <div style={{fontSize:'11px', fontWeight:'bold', textTransform:'uppercase', letterSpacing: '1px'}}>Secretaria de Estado da Educação</div>
                <h1 style={{margin: '5px 0', fontSize: '18px', color: '#003366', textTransform:'uppercase', fontWeight: '800'}}>Governo do Estado de Rondônia</h1>

                <div style={{marginTop: '30px', fontSize: '22px', fontWeight: 'bold', textDecoration: 'underline', fontFamily: 'Times New Roman, serif'}}>
                    {titulo}
                </div>
            </div>

            <div style={styles.body}>
                <p style={styles.paragraph}>
                    {isFrequencia
                        ? "Atestamos, para os devidos fins de comprovação, que o(a) estudante:"
                        : "Declaramos, para os devidos fins de comprovação junto a quem interessar possa, que o(a) estudante:"}
                </p>

                <div style={styles.studentBox}>
                    <div style={styles.studentRow}><span style={styles.label}>NOME:</span> {nomeAluno}</div>
                    <div style={styles.studentRow}><span style={styles.label}>MATRÍCULA:</span> {matricula}</div>
                    <div style={styles.studentRow}><span style={styles.label}>TURMA:</span> {turma}</div>
                    <div style={styles.studentRow}>
                        <span style={styles.label}>SITUAÇÃO:</span>
                        <span style={{color: '#28a745', fontWeight:'bold'}}>ATIVO - CURSANDO</span>
                    </div>
                </div>

                {isFrequencia ? (
                    <>
                        <p style={styles.paragraph}>
                            Obteve frequência regular nas atividades escolares no período de <strong>{dadosExtras?.inicio || '---'}</strong> a <strong>{dadosExtras?.fim || '---'}</strong>.
                        </p>
                        <div style={{margin: '20px 0', padding: '15px', background: '#f8f9fa', border: '1px dashed #ccc', textAlign: 'center'}}>
                            <p style={{fontSize: '18px', fontWeight: 'bold', color: '#003366'}}>
                                Frequência Global: {dadosExtras?.percentual || 'Calculando...'}
                            </p>
                        </div>
                    </>
                ) : (
                    <p style={styles.paragraph}>
                        Encontra-se regularmente matriculado(a) nesta instituição de ensino no ano letivo de 2025, frequentando o turno <strong>INTEGRAL</strong>.
                    </p>
                )}

                <p style={styles.paragraph}>
                    A presente declaração tem validade de 30 (trinta) dias a partir da data de sua emissão.
                </p>

                <p style={styles.paragraph}>
                    Por ser verdade, firmamos o presente documento.
                </p>
            </div>

            <div style={styles.footer}>
                <p>Porto Velho - RO, {dataHoje}.</p>

                <div style={{marginTop: '60px'}}>
                    <div style={styles.signatureLine}>_________________________________________________</div>
                    <p style={{fontSize: '12px', fontWeight: 'bold', margin: '5px 0'}}>Secretaria Escolar</p>
                    <p style={{fontSize: '10px', color: '#666'}}>EEEM MAJOR GUAPINDAIA</p>
                </div>
            </div>
        </div>
    );
});

const styles = {
    page: { padding: '40px 60px', fontFamily: '"Times New Roman", Times, serif', color: '#000', background: 'white', width: '100%', boxSizing: 'border-box', lineHeight: '1.6' },
    header: { textAlign: 'center', marginBottom: '40px' },
    body: { fontSize: '16px', marginBottom: '40px' },
    paragraph: { marginBottom: '20px', textIndent: '40px', textAlign: 'justify' },
    studentBox: { border: '2px solid #000', padding: '20px', margin: '30px 0', borderRadius: '0px', background: '#fff' },
    studentRow: { marginBottom: '8px', borderBottom: '1px dashed #ccc', paddingBottom: '4px' },
    label: { fontWeight: 'bold', width: '100px', display: 'inline-block' },
    footer: { textAlign: 'center', marginTop: '60px' },
    signatureLine: { marginBottom: '5px', fontWeight: 'bold' }
};