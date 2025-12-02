import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { useContext } from 'react';

// IMPORTS DAS PÁGINAS
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NovaOcorrencia from './pages/NovaOcorrencia';
import Desempenho from './pages/Desempenho';
import Chamada from './pages/Chamada';
import VisualizarFrequencia from './pages/VisualizarFrequencia';
import VisualizarBoletim from './pages/VisualizarBoletim';
import VisualizarDeclaracao from './pages/VisualizarDeclaracao';
import Tarefas from './pages/Tarefas';
import VisualizarTarefas from './pages/VisualizarTarefas';
import GradeHoraria from './pages/GradeHoraria';
import Matricula from './pages/Matricula';
import Avisos from './pages/Avisos';
import MinhaCarteirinha from './pages/MinhaCarteirinha'; // <--- IMPORT NOVO

// O Porteiro (Rota Privada)
function PrivateRoute({ children }) {
    const { signed, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-primary-dark"></div>
            </div>
        );
    }

    if (!signed) {
        return <Navigate to="/login" />;
    }

    return children;
}

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Rota Pública */}
                        <Route path="/login" element={<Login />} />

                        {/* Rotas Privadas Gerais */}
                        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/avisos" element={<PrivateRoute><Avisos /></PrivateRoute>} />
                        <Route path="/minha-carteirinha" element={<PrivateRoute><MinhaCarteirinha /></PrivateRoute>} /> {/* <--- ROTA NOVA */}

                        {/* Rotas de Gestão (Staff) */}
                        <Route path="/matricula" element={<PrivateRoute><Matricula /></PrivateRoute>} />
                        <Route path="/grade" element={<PrivateRoute><GradeHoraria /></PrivateRoute>} />
                        <Route path="/tarefas" element={<PrivateRoute><Tarefas /></PrivateRoute>} />
                        <Route path="/chamada" element={<PrivateRoute><Chamada /></PrivateRoute>} />
                        <Route path="/desempenho" element={<PrivateRoute><Desempenho /></PrivateRoute>} />
                        <Route path="/nova-ocorrencia" element={<PrivateRoute><NovaOcorrencia /></PrivateRoute>} />

                        {/* Rotas de Visualização Específicas (Com ID do Aluno) */}
                        <Route path="/tarefas/aluno/:alunoId" element={<PrivateRoute><VisualizarTarefas /></PrivateRoute>} />
                        <Route path="/frequencia/aluno/:alunoId" element={<PrivateRoute><VisualizarFrequencia /></PrivateRoute>} />
                        <Route path="/boletim/aluno/:alunoId" element={<PrivateRoute><VisualizarBoletim /></PrivateRoute>} />
                        <Route path="/declaracao/aluno/:alunoId" element={<PrivateRoute><VisualizarDeclaracao /></PrivateRoute>} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;