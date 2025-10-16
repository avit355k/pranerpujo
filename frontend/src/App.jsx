import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './component/Navbar/Navbar'
import Footer from './component/Footer/Footer'
import PujaDetails from './component/PujacardDetails/PujacardDetails'
import Home from './pages/Home/Home'
import Map from './pages/Map/Map'
import Parikrama from './pages/Parikrama/Parikrama';
import Gallery from './pages/Gallery/Gallery';
import Awards from './pages/Awards/Awards';
import Schedule from './pages/Schedule/Schedule';
import CommiteePhotoGallery from './pages/Gallery/CommiteePhotoGallery'
import YearWisePhotoGallery from './pages/Gallery/YearWisePhotoGallery'
import CommitteeVideoGallery from './pages/Gallery/CommitteeVideoGallery'
import VideoGallery from './pages/Gallery/VideoGallery';
import NorthKolkataParikrama from './pages/Parikrama/NorthKolkataParikrama'
import SouthKolkataParikrama from './pages/Parikrama/SouthKolkataParikrama';
import NorthEastCityParikrama from './pages/Parikrama/NorthEastCityParikrama';
import BehalaParikrama from './pages/Parikrama/BehalaParikrama'
import Haridevpur from './pages/Parikrama/HaridevpurParikrama';
import SaltLakeParikrama from './pages/Parikrama/SaltLakeParikrama';
import BonediBariParikrama from './pages/Parikrama/BonediBariParikrama';
import AdminLogin from './pages/Admin/LogIn';
import AdminSignUp from './pages/Admin/SignUp';
import AdminDashboard from './pages/Admin/Dashboard';

const App = () => {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" exact={true} element={<Home />} />
        <Route path="/map" exact={true} element={<Map />} />
        <Route path="/parikrama" exact={true} element={<Parikrama />} />
        <Route path="/parikrama/by-zone/north-kolkata" exact={true} element={<NorthKolkataParikrama />} />
        <Route path="/parikrama/by-zone/South-kolkata" exact={true} element={<SouthKolkataParikrama />} />
        <Route path="/parikrama/by-zone/north-east-city" exact={true} element={<NorthEastCityParikrama />} />
        <Route path="/parikrama/by-zone/behala" exact={true} element={<BehalaParikrama />} />
        <Route path="/parikrama/by-zone/haridevpur" exact={true} element={<Haridevpur />} />
        <Route path="/parikrama/by-zone/SaltLake" exact={true} element={<SaltLakeParikrama />} />
        <Route path="/parikrama/bonedi-bari-pujas" exact={true} element={<BonediBariParikrama />} />
        <Route path="/puja-details/:id" exact={true} element={<PujaDetails />} />
        <Route path="/gallery/photos" exact={true} element={<Gallery />} />
        <Route path="/gallery/:Committees/photos" exact={true} element={<CommiteePhotoGallery />} />
        <Route path="/gallery/:Committees/:year/photos" exact={true} element={<YearWisePhotoGallery />} />
        <Route path="/gallery/videos" exact={true} element={<VideoGallery />} />
        <Route path="/gallery/:Committees/videos" exact={true} element={<CommitteeVideoGallery />} />
        <Route path="/awards" exact={true} element={<Awards />} />
        <Route path="/schedule" exact={true} element={<Schedule />} />
        <Route path="/admin/login" exact={true} element={<AdminLogin />} />
        <Route path="/admin/signup" exact={true} element={<AdminSignUp />} />
        <Route path="/admin/signup" exact={true} element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
