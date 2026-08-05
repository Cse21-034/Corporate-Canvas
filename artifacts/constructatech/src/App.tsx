import React from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import NotFound from './pages/not-found';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import { PortalGuard } from './components/PortalGuard';
import { AdminGuard } from './components/AdminGuard';
import { PortalLayout } from './components/PortalLayout';
import { AdminLayout } from './components/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Solutions from './pages/Solutions';
import SolutionDetail from './pages/SolutionDetail';
import Industries from './pages/Industries';
import Contact from './pages/Contact';
import PortalLogin from './pages/PortalLogin';

// Portal Pages
import Dashboard from './pages/portal/Dashboard';
import Projects from './pages/portal/Projects';
import ProjectDetail from './pages/portal/ProjectDetail';
import Tickets from './pages/portal/Tickets';
import NewTicket from './pages/portal/NewTicket';
import TicketDetail from './pages/portal/TicketDetail';
import Invoices from './pages/portal/Invoices';
import Account from './pages/portal/Account';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import QuoteRequests from './pages/admin/QuoteRequests';
import Customers from './pages/admin/Customers';
import AdminServices from './pages/admin/Services';
import AdminTicketDetail from './pages/admin/AdminTicketDetail';
import AdminProjects from './pages/admin/AdminProjects';
import AdminTickets from './pages/admin/AdminTickets';
import AdminInvoices from './pages/admin/AdminInvoices';

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/solutions" component={Solutions} />
      <Route path="/solutions/:slug" component={SolutionDetail} />
      <Route path="/industries" component={Industries} />
      <Route path="/contact" component={Contact} />
      <Route path="/portal/login" component={PortalLogin} />
      
      {/* Portal (Guarded) */}
      <Route path="/portal" component={() => <PortalGuard><PortalLayout><Dashboard /></PortalLayout></PortalGuard>} />
      <Route path="/portal/projects" component={() => <PortalGuard><PortalLayout><Projects /></PortalLayout></PortalGuard>} />
      <Route path="/portal/projects/:id" component={() => <PortalGuard><PortalLayout><ProjectDetail /></PortalLayout></PortalGuard>} />
      <Route path="/portal/tickets" component={() => <PortalGuard><PortalLayout><Tickets /></PortalLayout></PortalGuard>} />
      <Route path="/portal/tickets/new" component={() => <PortalGuard><PortalLayout><NewTicket /></PortalLayout></PortalGuard>} />
      <Route path="/portal/tickets/:id" component={() => <PortalGuard><PortalLayout><TicketDetail /></PortalLayout></PortalGuard>} />
      <Route path="/portal/invoices" component={() => <PortalGuard><PortalLayout><Invoices /></PortalLayout></PortalGuard>} />
      <Route path="/portal/account" component={() => <PortalGuard><PortalLayout><Account /></PortalLayout></PortalGuard>} />

      {/* Admin (Guarded) */}
      <Route path="/admin" component={() => <AdminGuard><AdminLayout><AdminDashboard /></AdminLayout></AdminGuard>} />
      <Route path="/admin/quotes" component={() => <AdminGuard><AdminLayout><QuoteRequests /></AdminLayout></AdminGuard>} />
      <Route path="/admin/customers" component={() => <AdminGuard><AdminLayout><Customers /></AdminLayout></AdminGuard>} />
      <Route path="/admin/projects" component={() => <AdminGuard><AdminLayout><AdminProjects /></AdminLayout></AdminGuard>} />
      <Route path="/admin/tickets" component={() => <AdminGuard><AdminLayout><AdminTickets /></AdminLayout></AdminGuard>} />
      <Route path="/admin/invoices" component={() => <AdminGuard><AdminLayout><AdminInvoices /></AdminLayout></AdminGuard>} />
      <Route path="/admin/services" component={() => <AdminGuard><AdminLayout><AdminServices /></AdminLayout></AdminGuard>} />
      <Route path="/admin/tickets/:id" component={() => <AdminGuard><AdminLayout><AdminTicketDetail /></AdminLayout></AdminGuard>} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
