import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import HelpList from "../pages/help/HelpList";
import HelpDetail from "../pages/help/HelpDetail";
import ForumList from "../pages/forum/ForumList";
import ForumDetail from "../pages/forum/ForumDetail";
import EventList from "../pages/events/EventList";
import NotFound from "../pages/NotFound";
import EventDetail from "../pages/events/EventDetail";
import ArticleCreate from "../pages/articles/ArticleCreate";
import ArticleDetail from "../pages/articles/ArticleDetail";
import ArticleList from "../pages/articles/ArticleList";
import FriendSuggestions from "../pages/friends/FriendSuggestions";
import FriendsList from "../community/FriendsList";
import FriendRequests from "../community/FriendRequests";

export default function UserRoutes() {
  return (
    <Routes>
      <Route
        path="/help"
        element={
          <ProtectedRoute roles={[2]}>
            <HelpList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/help/:id"
        element={
          <ProtectedRoute roles={[2]}>
            <HelpDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/forum"
        element={
          <ProtectedRoute roles={[2]}>
            <ForumList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forum/:id"
        element={
          <ProtectedRoute roles={[2]}>
            <ForumDetail />
          </ProtectedRoute>
        }
      />

       {/* 📰 Artículos */}
      <Route
        path="/articles"
        element={
          <ProtectedRoute roles={[2]}>
            <ArticleList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles/:id"
        element={
          <ProtectedRoute roles={[2]}>
            <ArticleDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/articles/new"
        element={
          <ProtectedRoute roles={[2]}>
            <ArticleCreate />
          </ProtectedRoute>
        }
      />

      <Route
  path="/friends"
  element={
    <ProtectedRoute roles={[2]}>
      <FriendSuggestions />
    </ProtectedRoute>
  }
/>

<Route
        path="/friends/requests"
        element={
          <ProtectedRoute roles={[2]}>
            <FriendRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/friends/list"
        element={
          <ProtectedRoute roles={[2]}>
            <FriendsList />
          </ProtectedRoute>
        }
      />
    <Route path="/events" 
           element={
            <ProtectedRoute roles={[2]}>
              <EventList />
            </ProtectedRoute>
           } 
    />
                
    <Route path="/events/:id" 
        element={
        <ProtectedRoute roles={[2]}>
            <EventDetail />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={
        <ProtectedRoute roles={[2]}>
        <NotFound />
        </ProtectedRoute>
        } />

    </Routes>
  );
}
