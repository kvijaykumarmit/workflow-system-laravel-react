import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/login/Login';
import { AuthProvider } from './context-providers/AuthContext';
import SideMenu from './components/SideMenu';
import ProtectedRoute from './context-providers/ProtectedRoute';
import Home from './pages/home/Home';

const MainLayout = () => {
  return (
    <div className="d-flex">
      <SideMenu />
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage/>}></Route>
        <Route element={<MainLayout />}>          
            <Route path="/home" element={<ProtectedRoute element={<Home />} />} />            
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
