import { BrowserRouter, Route,Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ServiceBar from './components/ServiceBar';
import Auth from './pages/Auth';
import {AuthProvider, useAuth} from './context/AuthContext';

function App() {
  const {user}=useAuth();
  return (
   <>
   <Navbar />
      <div className="flex">
        <ServiceBar />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={user?<Home />:<Auth />} />
            <Route path='/auth' element={user?<Home />:<Auth />} />
          </Routes>
        </BrowserRouter>
      </div></>
      
    
  );
}

export default App;
