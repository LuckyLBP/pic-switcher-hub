import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "@/components/RequireAuth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import CreateFolder from "./pages/CreateFolder";
import FolderPage from "./pages/FolderPage";
import SelectBackgrounds from "./pages/SelectBackgrounds";
import LoginForm from "./components/LoginForm";
import ManageBackgrounds from "./pages/ManageBackgrounds";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginForm />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/register"
            element={
              <RequireAuth>
                <Register />
              </RequireAuth>
            }
          />
          <Route
            path="/register/:linkId"
            element={
              <RequireAuth>
                <Register />
              </RequireAuth>
            }
          />
          <Route
            path="/gallery"
            element={
              <RequireAuth>
                <Gallery />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <Admin />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/create-folder"
            element={
              <RequireAuth>
                <CreateFolder />
              </RequireAuth>
            }
          />
          <Route
            path="/folder/:folderId"
            element={
              <RequireAuth>
                <FolderPage />
              </RequireAuth>
            }
          />
          <Route
            path="/select-backgrounds"
            element={
              <RequireAuth>
                <SelectBackgrounds />
              </RequireAuth>
            }
          />
          <Route
            path="/manage-backgrounds"
            element={
              <RequireAuth>
                <ManageBackgrounds />
              </RequireAuth>
            }
            />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
