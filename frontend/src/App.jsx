import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'

function App() {
    return (
        <div className="min-h-screen">
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rotas Protegidas com Layout (Sidebar) */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Settings />
                            </Layout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </div>
    )
}

export default App
