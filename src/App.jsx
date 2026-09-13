import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AnalysisProvider } from './context/AnalysisContext.jsx'
import { Layout } from './components/Layout.jsx'
import { AboutPage } from './pages/AboutPage.jsx'
import { AnalysisPage } from './pages/AnalysisPage.jsx'
import { DisclaimerPage } from './pages/DisclaimerPage.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { ResearchPage } from './pages/ResearchPage.jsx'
import { ResultsPage } from './pages/ResultsPage.jsx'

export default function App() {
  return (
    <AnalysisProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AnalysisProvider>
  )
}
