import "./index.css";

import ErrorHandling from "./assets/components/ErrorHandling";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "./assets/contexts/ContextProvider";
import { useEffect } from "react";
import axiosClient from "./axios-client";
import { Spin } from "antd";
import { Navigate, createBrowserRouter } from "react-router-dom";
import Landing from "./assets/views/Landing";
import MainLayout from "./assets/layout/MainLayout";
import JoinerLayout from "./assets/layout/JoinerLayout";
import Users from "./assets/views/Users";
import Wilayas from "./assets/views/Wilayas";
import Communes from "./assets/views/Communes";
import Etablissements from "./assets/views/Etablissements";
import EtablissementSettings from "./assets/views/EtablissementSettings";
import EtablissementParameters from "./assets/views/EtablissementParameters";
import Dashboard from './assets/views/Dashboard';
import DashboardNew from './assets/views/DashboardNew';
import JoinerDashboard from './assets/views/JoinerDashboard';
import JoinerSignup from './assets/views/JoinerSignup';
import Joiners from './assets/views/Joiners';
import JoinerRequests from './assets/views/JoinerRequests';
import Payments from './assets/views/Payments';
import JoiningTypes from './assets/views/JoiningTypes';
import JoinerPayments from './assets/views/JoinerPayments';
import DocumentTypes from './assets/views/DocumentTypes';
import Documents from './assets/views/Documents';
import GuestLayout from "./assets/auth/GuestLayout";
import Login from "./assets/auth/Login";
import Forbidden from "./assets/views/Forbidden";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, setUser, token, setToken } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have user in local storage
    const storedUser = localStorage.getItem('user');

    if (storedUser && !user?.id) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }

    if (token) {
      axiosClient.get("/user").then(({ data }) => {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      }).catch(() => {
        // Optional: clear on error
        localStorage.removeItem('user');
      });
    }
  }, [token]);

  // If there's no token, redirect to login immediately
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If there's a token but no user ID yet, show loading (user is being fetched)
  if (!user?.id) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Check if user's role is in the allowed roles array
  if (!allowedRoles.includes(user?.role_id)) {
    setUser(null);
    setToken(null);
    navigate("/forbidden")
  }

  return children;
};

const DefaultRedirect = () => {
  const { user } = useStateContext();

  if (!user?.id || !user?.role_id) {
    return <Navigate to="/login" />;
  }

  // Redirect based on user role
  switch (user?.role_id) {
    case "admin":
    case "national":
    case "wilaya":
      return <Navigate to="/mainLayout/users" />;
    case "baladi":
    case "printer":
      return <Navigate to="/mainLayout/joiners" />;
    case "joiner":
      return <Navigate to="/joiner-layout" />;
    default:
      console.warn("Unknown user role:", user?.role_id);
      return <Navigate to="/mainLayout/users" />;
  }
};

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },

  {
    path: "/joiner-signup",
    element: <JoinerSignup />,
  },

  {
    path: "/joiner-layout",
    element: (
      <ProtectedRoute allowedRoles={["joiner"]}>
        <JoinerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={["joiner"]}>
            <JoinerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/joiner-layout/profile",
        element: (
          <ProtectedRoute allowedRoles={["joiner"]}>
            <div>Joiner Profile (Coming Soon)</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "/joiner-layout/payments",
        element: (
          <ProtectedRoute allowedRoles={["joiner"]}>
            <JoinerPayments />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/mainLayout",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DefaultRedirect />,
      },
      {
        path: "/mainLayout/dashboard-new",
        element: (
          <ProtectedRoute allowedRoles={["admin", "national", "wilaya", "baladi"]}>
            <DashboardNew />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mainLayout/users",
        element: (
          <ProtectedRoute allowedRoles={["admin", "national", "wilaya", "baladi", "printer"]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mainLayout/wilayas",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Wilayas />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mainLayout/communes",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Communes />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mainLayout/etablissements",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Etablissements />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mainLayout/etablissement-settings",
        element: (
          <ProtectedRoute allowedRoles={["admin", "national", "wilaya", "baladi"]}>
            <EtablissementSettings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mainLayout/etablissement-parameters",
        element: (
          <ProtectedRoute allowedRoles={["national", "wilaya", "baladi"]}>
            <EtablissementParameters />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mainLayout/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["national", "wilaya", "baladi"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mainLayout/joiners",
        element: (
          <ProtectedRoute allowedRoles={["national", "wilaya", "baladi", "printer"]}>
            <Joiners />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mainLayout/joiner-requests",
        element: (
          <ProtectedRoute allowedRoles={["national", "wilaya", "baladi", "printer"]}>
            <JoinerRequests />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mainLayout/payments",
        element: (
          <ProtectedRoute allowedRoles={["national"]}>
            <Payments />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mainLayout/joining-types",
        element: (
          <ProtectedRoute allowedRoles={["admin", "national"]}>
            <JoiningTypes />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mainLayout/document-types",
        element: (
          <ProtectedRoute allowedRoles={["admin", "national"]}>
            <DocumentTypes />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mainLayout/documents",
        element: (
          <ProtectedRoute allowedRoles={["admin", "national", "wilaya", "baladi"]}>
            <Documents />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/joiner-signup",
        element: <JoinerSignup />,
      },
    ],
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export default Routes;
