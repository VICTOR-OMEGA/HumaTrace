
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Sessions from "./pages/Sessions";
import Issues from "./pages/Issues";
import Diagnosis from "./pages/Diagnosis";
import Treatments from "./pages/Treatments";
import BirthRecords from "./pages/BirthRecords";
import PatientVitals from "./pages/PatientVitals";
import Medications from "./pages/Medications";
import MedicationHistory from "./pages/MedicationHistory";
import Tests from "./pages/Tests";
import TestResults from "./pages/TestResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="/patients" element={
            <MainLayout>
              <Patients />
            </MainLayout>
          } />
          <Route path="/doctors" element={
            <MainLayout>
              <Doctors />
            </MainLayout>
          } />
          <Route path="/appointments" element={
            <MainLayout>
              <Appointments />
            </MainLayout>
          } />
          <Route path="/sessions" element={
            <MainLayout>
              <Sessions />
            </MainLayout>
          } />
          <Route path="/issues" element={
            <MainLayout>
              <Issues />
            </MainLayout>
          } />
          <Route path="/diagnosis" element={
            <MainLayout>
              <Diagnosis />
            </MainLayout>
          } />
          <Route path="/treatments" element={
            <MainLayout>
              <Treatments />
            </MainLayout>
          } />
          <Route path="/birth-records" element={
            <MainLayout>
              <BirthRecords />
            </MainLayout>
          } />
          <Route path="/patient-vitals" element={
            <MainLayout>
              <PatientVitals />
            </MainLayout>
          } />
          <Route path="/medications" element={
            <MainLayout>
              <Medications />
            </MainLayout>
          } />
          <Route path="/medication-history" element={
            <MainLayout>
              <MedicationHistory />
            </MainLayout>
          } />
          <Route path="/tests" element={
            <MainLayout>
              <Tests />
            </MainLayout>
          } />
          <Route path="/test-results" element={
            <MainLayout>
              <TestResults />
            </MainLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Sonner />
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
