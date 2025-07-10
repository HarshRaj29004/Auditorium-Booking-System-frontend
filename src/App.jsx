import { useState } from 'react';
import './App.css';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Request from './Pages/Request';
import ViewRequests from './Pages/ViewRequests';
import Home from './Pages/Home';
import { UserProvider } from './Pages/UserProvider';
import Navbar from "./Components/Navbar";

function App() {
  const [home, setHome] = useState(true);
  return (
    <UserProvider>
      <BrowserRouter>
      <Navbar home={home} setHome={setHome} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/request' element={<Request />} />
          <Route path='/viewrequest' element={<ViewRequests />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App
