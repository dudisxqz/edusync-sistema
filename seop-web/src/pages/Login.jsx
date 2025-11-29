import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function Login() {
    const { signIn, signed } = useContext(AuthContext);

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        try {
            await signIn(login, senha);
        } catch (error) {
            setErro("Login ou senha inválidos.");
        }
    }

    // Se já estiver logado, manda pro Dashboard
    if (signed) {
        return <Navigate to="/" />;
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>SEOP</h1>
                <p style={styles.subtitle}>Sistema Escolar de Ocorrências e Pedagogia</p>

                <form onSubmit={handleLogin} style={{ marginTop: '30px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={styles.label}>Usuário</label>
                        <input
                            type="text"
                            value={login}
                            onChange={e => setLogin(e.target.value)}
                            style={styles.input}
                            placeholder="Ex: diretor"
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={styles.label}>Senha</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            style={styles.input}
                            placeholder="••••••"
                        />
                    </div>

                    {erro && <p style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{erro}</p>}

                    <button type="submit" style={styles.button}>ENTRAR</button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#888' }}>
                    <p>Acesso restrito a funcionários e responsáveis.</p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #003366 0%, #0056b3 100%)' },
    card: { background: 'white', padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
    title: { textAlign: 'center', color: '#003366', margin: 0, fontSize: '32px' },
    subtitle: { textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '20px' },
    label: { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: '#333' },
    input: { width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', background: '#003366', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};

export default Login;