import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./Layout/AdminLayout";
import AddPandel from './pages/AddPandel';
import ManagePandel from './pages/ManagePandel';
import AddArtist from './pages/AddArtist';
import ManageArtist from './pages/ManageArtist';
import AddTheme from './pages/AddTheme';
import ManageTheme from './pages/ManageTheme';
import UploadGallery from './pages/UploadGallery';
import ManageGallery from './pages/ManageGallery';
import LogIn from './component/LogIn/LogIn';
import SignUp from './component/SignUp/SignUp';
import ProtectedRoute from './utils/ProtectedRoute';
import Profile from './pages/Profile/Profile';
import AddAwards from './pages/AddAwards';
import ManageAwards from './pages/ManageAwards';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<LogIn />} />
        <Route path="/admin/signup" element={<SignUp />} />

        <Route element={<ProtectedRoute> <AdminLayout /> </ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addpandals" element={<AddPandel />} />
          <Route path="/managepandals" element={<ManagePandel />} />
          <Route path='/artists/add' element={<AddArtist />} />
          <Route path='/artists/manage' element={<ManageArtist />} />
          <Route path='/themes/add' element={<AddTheme />} />
          <Route path='/themes/manage' element={<ManageTheme />} />
          <Route path='/gallery/upload' element={<UploadGallery />} />
          <Route path='/gallery/manage' element={<ManageGallery />} />
          <Route path='/awards/add' element={<AddAwards />} />
          <Route path='/awards/manage' element={<ManageAwards />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App