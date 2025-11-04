import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import PostList from "./pages/posts/PostList";
import ForumList from "./pages/forum/ForumList";
import ForumDetail from "./pages/forum/ForumDetail";
import PostDetail from "./pages/posts/PostDetail";
import ProtectedRoute from "./components/ProtectedRoute";

import HelpList from "./pages/help/HelpList";
import HelpDetail from "./pages/help/HelpDetail";
import EventList from "./pages/events/EventList";
import EventDetail from "./pages/events/EventDetail";

export default function App() {
  return (
    <Box>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/forum" element={<ForumList />} />
         <Route path="/forum/:id" element={<ForumDetail />} />
           <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/help" element={<HelpList />} />
        <Route path="/help/:id" element={<HelpDetail />} />
        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={[1, 2, 3]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
}
