import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Toaster } from "react-hot-toast";

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
import AddTransistMode from './pages/AddTransistMode';
import ManageTransistMode from './pages/ManageTransistMode';
import AddTransistLine from './pages/AddTransistLine';
import ManageTransistLine from './pages/ManageTransistLine';
import AddStation from './pages/AddStation';
import ManageStation from './pages/ManageStation';
import AddStationPandel from './pages/AddStationPandel';
import ManageStationPandel from './pages/ManageStationPandel';

const App = () => {
  return (
    <BrowserRouter>

      <Toaster
        position="top-right"
        reverseOrder={false}
      />

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
          <Route path='/route-guide/transist-mode/add' element={<AddTransistMode />} />
          <Route path='/route-guide/transist-mode/manage' element={<ManageTransistMode />} />
          <Route path='/route-guide/transist-line/add' element={<AddTransistLine />} />
          <Route path='/route-guide/transist-line/manage' element={<ManageTransistLine />} />
          <Route path='/route-guide/station/add' element={<AddStation />} />
          <Route path='/route-guide/station/manage' element={<ManageStation />} />
          <Route path='/route-guide/station-pandels/add' element={<AddStationPandel />} />
          <Route path='/route-guide/station-pandels/manage' element={<ManageStationPandel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App