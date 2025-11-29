import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NovaOcorrencia from './pages/NovaOcorrencia';
import Desempenho from './pages/Desempenho';

// Componente que protege as rotas (O Porteiro)
function PrivateRoute({ children }) {
    const { signed, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!signed) {
        return <Navigate to="/login" />;
    }

    return children;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Rota Pública */}
                    <Route path="/login" element={<Login />} />

                    {/* Rotas Privadas (Protegidas) */}
                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/nova-ocorrencia" element={<PrivateRoute><NovaOcorrencia /></PrivateRoute>} />
                    <Route path="/desempenho" element={<PrivateRoute><Desempenho /></PrivateRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;