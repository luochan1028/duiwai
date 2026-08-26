import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "@/components/Layout";
import { RequireAuth, RoleGuard } from "@/components/Auth/guards";
import LoginPage from "@/pages/LoginPage";
import QAPage from "@/pages/QAPage";
import GraphPage from "@/pages/GraphPage";
import PathPage from "@/pages/PathPage";
import LabPage from "@/pages/LabPage";
import QuizPage from "@/pages/QuizPage";
import TeacherPage from "@/pages/TeacherPage";
import PhilosophyPage from "@/pages/PhilosophyPage";
import VideoPage from "@/pages/VideoPage";
import RedEducationPage from "@/pages/RedEducationPage";
import DemoPage from "@/pages/DemoPage";
import UserProfilePage from "@/pages/UserProfilePage";
import UserListPage from "@/pages/UserListPage";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* 登录页（公开） */}
          <Route path="/login" element={<LoginPage />} />

          {/* 受保护区域：需登录 */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/qa" replace />} />

            {/* 学生端功能（学生和老师都能访问） */}
            <Route path="red-education" element={<RedEducationPage />} />
            <Route path="qa" element={<QAPage />} />
            <Route path="graph" element={<GraphPage />} />
            <Route path="path" element={<PathPage />} />
            <Route path="lab" element={<LabPage />} />
            <Route path="video" element={<VideoPage />} />
            <Route path="quiz" element={<QuizPage />} />

            {/* 个人中心（所有角色可访问自己的信息） */}
            <Route path="profile" element={<UserProfilePage />} />

            {/* 教师端功能（仅老师/管理员） */}
            <Route
              path="philosophy"
              element={
                <RoleGuard allowed={['teacher']}>
                  <PhilosophyPage />
                </RoleGuard>
              }
            />
            <Route
              path="teacher"
              element={
                <RoleGuard allowed={['teacher']}>
                  <TeacherPage />
                </RoleGuard>
              }
            />
            <Route
              path="users"
              element={
                <RoleGuard allowed={['teacher']}>
                  <UserListPage />
                </RoleGuard>
              }
            />
          </Route>

          {/* 演示页（公开） */}
          <Route path="/demo" element={<DemoPage />} />

          {/* 兜底 */}
          <Route path="*" element={<Navigate to="/qa" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
