import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageShell } from './components/layout/PageShell';
import { QuantumParticles } from './visualization/particles/QuantumParticles';

// Fallback for lazy loading
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--color-arctic)' }}>
    Loading Quantum State...
  </div>
);

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
      {/* Background particles only on the home page for performance, or everywhere if desired. 
          Let's put it globally behind everything but fade it. */}
      {location.pathname === '/' && <QuantumParticles />}
      
      <AnimatePresence mode="wait">
        {/* We use location.pathname as the key so Framer Motion knows when to animate out/in */}
        <React.Fragment key={location.pathname}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </React.Fragment>
      </AnimatePresence>
    </PageShell>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />, // Catch-all inside the app shell, or could be a raw page
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
