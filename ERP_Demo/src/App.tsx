import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ERPLayout from "@/components/ERPLayout";
import Dashboard from "@/pages/Dashboard";
import InventoryPage from "@/pages/InventoryPage";
import StockMovementsPage from "@/pages/StockMovementsPage";
import LocationsPage from "@/pages/LocationsPage";
import QuotationsPage from "@/pages/QuotationsPage";
import SalesOrdersPage from "@/pages/SalesOrdersPage";
import DeliveryCalendarPage from "@/pages/DeliveryCalendarPage";
import PurchaseRequestsPage from "@/pages/PurchaseRequestsPage";
import PurchaseOrdersPage from "@/pages/PurchaseOrdersPage";
import ReceiveCalendarPage from "@/pages/ReceiveCalendarPage";
import ARAPPage from "@/pages/ARAPPage";
import JournalPage from "@/pages/JournalPage";
import CostingPage from "@/pages/CostingPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ERPLayout><Dashboard /></ERPLayout>} />
          <Route path="/inventory" element={<ERPLayout><InventoryPage /></ERPLayout>} />
          <Route path="/inventory/movements" element={<ERPLayout><StockMovementsPage /></ERPLayout>} />
          <Route path="/inventory/locations" element={<ERPLayout><LocationsPage /></ERPLayout>} />
          <Route path="/sales/quotations" element={<ERPLayout><QuotationsPage /></ERPLayout>} />
          <Route path="/sales/orders" element={<ERPLayout><SalesOrdersPage /></ERPLayout>} />
          <Route path="/sales/calendar" element={<ERPLayout><DeliveryCalendarPage /></ERPLayout>} />
          <Route path="/purchase/requests" element={<ERPLayout><PurchaseRequestsPage /></ERPLayout>} />
          <Route path="/purchase/orders" element={<ERPLayout><PurchaseOrdersPage /></ERPLayout>} />
          <Route path="/purchase/calendar" element={<ERPLayout><ReceiveCalendarPage /></ERPLayout>} />
          <Route path="/accounting/arap" element={<ERPLayout><ARAPPage /></ERPLayout>} />
          <Route path="/accounting/journal" element={<ERPLayout><JournalPage /></ERPLayout>} />
          <Route path="/accounting/costing" element={<ERPLayout><CostingPage /></ERPLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
