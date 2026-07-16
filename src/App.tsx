import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "@/components/Layout";
import QAPage from "@/pages/QAPage";
import GraphPage from "@/pages/GraphPage";
import PathPage from "@/pages/PathPage";
import LabPage from "@/pages/LabPage";
import QuizPage from "@/pages/QuizPage";
import TeacherPage from "@/pages/TeacherPage";
import PhilosophyPage from "@/pages/PhilosophyPage";
import VideoPage from "@/pages/VideoPage";
import DemoPage from "@/pages/DemoPage";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/qa" replace />} />
            <Route path="qa" element={<QAPage />} />
            <Route path="graph" element={<GraphPage />} />
            <Route path="path" element={<PathPage />} />
            <Route path="lab" element={<LabPage />} />
            <Route path="quiz" element={<QuizPage />} />
            <Route path="teacher" element={<TeacherPage />} />
            <Route path="philosophy" element={<PhilosophyPage />} />
            <Route path="video" element={<VideoPage />} />
          </Route>
          <Route path="/demo" element={<DemoPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
