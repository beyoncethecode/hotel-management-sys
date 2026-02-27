import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import ProfilePage from '@/components/pages/ProfilePage';
import DashboardPage from '@/components/pages/DashboardPage';
import RoomsPage from '@/components/pages/RoomsPage';
import ReservationsPage from '@/components/pages/ReservationsPage';
import GuestsPage from '@/components/pages/GuestsPage';
import StaffPage from '@/components/pages/StaffPage';
import ServicesPage from '@/components/pages/ServicesPage';
import PaymentsPage from '@/components/pages/PaymentsPage';
import HousekeepingPage from '@/components/pages/HousekeepingPage';
import MaintenancePage from '@/components/pages/MaintenancePage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "profile",
        element: (
          <MemberProtectedRoute>
            <ProfilePage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'profile',
        },
      },
      {
        path: "dashboard",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access your dashboard">
            <DashboardPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'dashboard',
        },
      },
      {
        path: "rooms",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to manage rooms">
            <RoomsPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'rooms',
        },
      },
      {
        path: "reservations",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to manage reservations">
            <ReservationsPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'reservations',
        },
      },
      {
        path: "guests",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to manage guests">
            <GuestsPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'guests',
        },
      },
      {
        path: "staff",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to manage staff">
            <StaffPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'staff',
        },
      },
      {
        path: "services",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to manage services">
            <ServicesPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'services',
        },
      },
      {
        path: "payments",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to manage payments">
            <PaymentsPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'payments',
        },
      },
      {
        path: "housekeeping",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to manage housekeeping">
            <HousekeepingPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'housekeeping',
        },
      },
      {
        path: "maintenance",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to manage maintenance">
            <MaintenancePage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'maintenance',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
