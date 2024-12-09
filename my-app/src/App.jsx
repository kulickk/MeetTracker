import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

// utils
import './App.css';
import routing from './routing.js';
import api from './api.js';

// pages
import AuthPage from './pages/AuthentificationPage/AuthentificationPage.jsx';
import Header from './components/Header/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import MainPage from './pages/MainPage/MainPage.jsx';
import MeetingPage from './pages/MeetingPage/MeetingPage.jsx';
import AdminPanelPage from './pages/AdminPanelPage/AdminPanelPage.jsx';


const App = () => {
  const [user, setUser] = useState(true);

  const handleLogOut = e => {
    setUser(false);
  };

  return (
    <Router>
      <Header />
      <Routes>
        {/* Аутентификация */}
        <Route exact path={ routing.authentidication } element={
          <AuthPage
          user={ user } />
        }/>

        {/* Главная страница */}
        <Route path={ routing.mainPage } >
            <Route path={ routing.index } element={
              <ProtectedRoute user={ user }>
                <MainPage />
              </ProtectedRoute>
            }/>
            <Route path={ routing.meeting } element={
              <ProtectedRoute user={ user }>
                <MeetingPage />
              </ProtectedRoute>
            } />
        </ Route>

        {/* Страница встречи */}
        

        {/* Админ-панель */}
        <Route path={ routing.admin } element={
          <ProtectedRoute user={ user }>
            <AdminPanelPage handleLogOut={handleLogOut}/>
          </ProtectedRoute>
        }/>
      </Routes>
    </Router>
  );
}

export default App;
