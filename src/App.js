import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Skills from './pages/Skills';
import Journey from './pages/Journey';
import Certifications from './pages/Certifications';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import ManageSkills from './pages/admin/ManageSkills';
import ManageProjects from './pages/admin/ManageProjects';
import ManageJourney from './pages/admin/ManageJourney';
import ManageCertifications from './pages/admin/ManageCertifications';
import ViewMessages from './pages/admin/ViewMessages';
import ManageProfile from './pages/admin/ManageProfile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Dashboard />}>
                <Route path="/dashboard" element={<div className="p-4"><h2>Select a category to manage</h2></div>} />
                <Route path="/dashboard/skills" element={<ManageSkills />} />
                <Route path="/dashboard/projects" element={<ManageProjects />} />
                <Route path="/dashboard/journey" element={<ManageJourney />} />
                <Route path="/dashboard/certifications" element={<ManageCertifications />} />
                <Route path="/dashboard/messages" element={<ViewMessages />} />
                <Route path="/dashboard/profile" element={<ManageProfile />} />
              </Route>
            </Route>
          </Routes>
        </main>
        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Portfolio. Built with FastAPI & React.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
