import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { useContext } from 'react';

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
import MinhaCarteirinha from './pages/MinhaCarteirinha';
import MeusDocumentos from './pages/MeusDocumentos'; // NOVO
import MinhasTarefas from './pages/MinhasTarefas';   // NOVO
import Perfil from './pages/Perfil';
import Configuracoes from './pages/Configuracoes';

function PrivateRoute({ children }) {
    const { signed, loading } = useContext(AuthContext);
    if (loading) return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    return signed ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/avisos" element={<PrivateRoute><Avisos /></PrivateRoute>} />
                        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />

                        {/* Rotas para Pais/Alunos */}
                        <Route path="/minha-carteirinha" element={<PrivateRoute><MinhaCarteirinha /></PrivateRoute>} />
                        <Route path="/meus-documentos" element={<PrivateRoute><MeusDocumentos /></PrivateRoute>} />
                        <Route path="/minhas-tarefas" element={<PrivateRoute><MinhasTarefas /></PrivateRoute>} />

                        {/* Rotas de Gestão */}
                        <Route path="/matricula" element={<PrivateRoute><Matricula /></PrivateRoute>} />
                        <Route path="/grade" element={<PrivateRoute><GradeHoraria /></PrivateRoute>} />
                        <Route path="/tarefas" element={<PrivateRoute><Tarefas /></PrivateRoute>} />
                        <Route path="/chamada" element={<PrivateRoute><Chamada /></PrivateRoute>} />
                        <Route path="/desempenho" element={<PrivateRoute><Desempenho /></PrivateRoute>} />
                        <Route path="/nova-ocorrencia" element={<PrivateRoute><NovaOcorrencia /></PrivateRoute>} />
                        <Route path="/configuracoes" element={<PrivateRoute><Configuracoes /></PrivateRoute>} />

                        {/* Visualizações */}
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