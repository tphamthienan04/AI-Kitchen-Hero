import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FridgeProvider } from './context/FridgeContext'
import { RecipeProvider } from './context/RecipeContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import FridgePage from './pages/FridgePage'
import AIChefPage from './pages/AIChefPage'
import RecipesPage from './pages/RecipesPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FridgeProvider>
          <RecipeProvider>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/fridge"    element={<FridgePage />} />
                  <Route path="/ai-chef"   element={<AIChefPage />} />
                  <Route path="/recipes"   element={<RecipesPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </RecipeProvider>
        </FridgeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
