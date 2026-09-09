import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageShell } from './components/layout/PageShell';
import { QynxLoading } from './components/shared/QynxLoading';
import { PageTransition } from './components/shared/PageTransition';

// Lazy load pages
const QuantumUniverse = lazy(() => import('./pages/QuantumUniverse').then(m => ({ default: m.QuantumUniverse })));
const GateVisualizer = lazy(() => import('./pages/GateVisualizer').then(m => ({ default: m.GateVisualizer })));
const ExperimentLab = lazy(() => import('./pages/ExperimentLab').then(m => ({ default: m.ExperimentLab })));
const EntanglementSimulator = lazy(() => import('./pages/EntanglementSimulator').then(m => ({ default: m.EntanglementSimulator })));
const CircuitBuilder = lazy(() => import('./pages/CircuitBuilder').then(m => ({ default: m.CircuitBuilder })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// Layout wrapper for routes
const RootLayout = () => {
  const location = useLocation();

  return (
    <PageShell>
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Suspense fallback={<QynxLoading message="Initializing Simulation Engine..." size={72} />}>
            <Outlet />
          </Suspense>
        </PageTransition>
      </AnimatePresence>
    </PageShell>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <QuantumUniverse />
      },
      {
        path: 'gate-visualizer',
        element: <GateVisualizer />
      },
      {
        path: 'experiment-lab',
        element: <ExperimentLab />
      },
      {
        path: 'entanglement-simulator',
        element: <EntanglementSimulator />
      },
      {
        path: 'circuit-builder',
        element: <CircuitBuilder />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
