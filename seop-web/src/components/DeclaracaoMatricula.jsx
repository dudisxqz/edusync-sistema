import React from 'react';

export const DeclaracaoMatricula = React.forwardRef(({ aluno }, ref) => {
    if (!aluno) return null;

    const dataHoje = new Date().toLocaleDateString('pt-BR', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <div ref={ref} style={styles.page}>
            {/* Cabeçalho Oficial */}
            <div style={styles.header}>
                <h2 style={{margin: 0, fontSize: '14px', textTransform: 'uppercase'}}>Governo do Estado de Rondônia</h2>
                <h3 style={{margin: 0, fontSize: '12px', fontWeight: 'normal'}}>Secretaria de Estado da Educação</h3>
                <h1 style={{marginTop: '20px', fontSize: '24px', textDecoration: 'underline'}}>DECLARAÇÃO DE MATRÍCULA</h1>
            </div>

            {/* Corpo do Texto */}
            <div style={styles.body}>
                <p style={styles.paragraph}>
                    Declaramos, para os devidos fins de comprovação junto a quem interessar possa, que o(a) estudante:
                </p>

                <div style={styles.studentBox}>
                    <p><strong>NOME:</strong> {aluno.nome.toUpperCase()}</p>
                    <p><strong>MATRÍCULA:</strong> {aluno.matricula}</p>
                    <p><strong>TURMA:</strong> {aluno.turma}</p>
                    <p><strong>SITUACÃO:</strong> <span style={{color: 'green'}}>ATIVO - CURSANDO</span></p>
                </div>

                <p style={styles.paragraph}>
                    Encontra-se regularmente matriculado(a) nesta instituição de ensino no ano letivo de 2025, frequentando o turno <strong>INTEGRAL</strong>.
                </p>

                <p style={styles.paragraph}>
                    Por ser verdade, firmamos a presente declaração.
                </p>
            </div>

            {/* Data e Assinatura */}
            <div style={styles.footer}>
                <p>Porto Velho - RO, {dataHoje}.</p>

                <div style={styles.signatureLine}>_________________________________________________</div>
                <p style={{fontSize: '12px', fontWeight: 'bold'}}>Secretaria Escolar</p>
                <p style={{fontSize: '10px'}}>EduSync - Sistema de Gestão</p>
            </div>
        </div>
    );
});

const styles = {
    page: { padding: '50px', fontFamily: '"Times New Roman", Times, serif', color: '#000', background: 'white', height: '100%' },
    header: { textAlign: 'center', marginBottom: '50px' },
    body: { fontSize: '16px', lineHeight: '1.8', marginBottom: '50px' },
    paragraph: { marginBottom: '20px', textIndent: '30px', textAlign: 'justify' },
    studentBox: { border: '1px solid #000', padding: '20px', margin: '20px 0', borderRadius: '5px', background: '#f9f9f9' },
    footer: { textAlign: 'center', marginTop: '100px' },
    signatureLine: { marginTop: '50px', marginBottom: '5px' }
};