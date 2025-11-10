import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import UserManagement from "../pages/admin/UserManagement";
import JournalistManagement from "../pages/admin/JournalistManagement";
import PostValidation from "../pages/admin/PostValidation";
import OrientationAssign from "../pages/admin/OrientationAssign";
import NotFound from "../pages/NotFound";
import JournalistStats from "../pages/admin/JournalistStats";
import MediaOutletManagement from "../pages/admin/MediaOutletManagement";
import MyProfile from "../pages/profile/MyProfile";
import ReportList from "../pages/admin/ReportList";
import ReportDetail from "../pages/admin/ReportDetail";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute roles={[1]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardAdmin />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="journalists/stats" element={<JournalistStats />} />
        <Route path="journalists" element={<JournalistManagement />} />
        <Route path="posts/validate" element={<PostValidation />} />
        <Route path="journalists/orientation" element={<OrientationAssign />} />
        <Route path="media" element={<MediaOutletManagement />} />
        <Route path="me" element={<MyProfile />} />
        <Route path="reports" element={<ReportList />} />
        <Route path="reports/:id" element={<ReportDetail />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
