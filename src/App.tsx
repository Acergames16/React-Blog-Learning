import {Routes, Route, BrowserRouter as Router } from "react-router-dom"
import { LoginPage } from "./pages/authpage/LoginPage"
import { RegisterPage } from "./pages/authpage/RegisterPage"
import LandingPage from "./pages/authpage/LandingPage"
// import HomePage from "./pages/protectedpage/HomePage"
import SettingsPage from "./pages/protectedpage/SettingsPage"
import FeedPage from "./pages/protectedpage/FeedPage"
import MyBlogListPage from "./pages/protectedpage/MyBlogListPage"
import { MainLayout } from "./components/layout/MainLayout"
import { ProtectedRoute } from "./features/auth/ProtectedRoute"
import { AuthListener } from "./features/auth/AuthListener"
import  PublishPage  from "./pages/protectedpage/PublishPage"
import ViewBlogPage from "./pages/protectedpage/ViewBlogPage"

function App() {


  return (
    <>
      <Router>
        <AuthListener />
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<LoginPage/>}/> 
          <Route path="/register" element={<RegisterPage/>}/> 

          <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout/>}>
            <Route path="/feed" element={<FeedPage/>}/>
            <Route path="/publish" element={<PublishPage/>}/>
            <Route path="/edit/:id" element={<PublishPage />} />
            <Route path="/view/:id" element={<ViewBlogPage />} />
            <Route path="/settings" element={<SettingsPage/>}/>
            <Route path="/my-blogs" element={<MyBlogListPage/>}/>
          </Route>
          </Route>

        </Routes>
        
      </Router>

    </>
  )
}

export default App
