import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// utils
import './App.css';
import routing from './utils/links/routing.js';

// pages
import AuthPage from './pages/AuthentificationPage/AuthentificationPage.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import MainPage from './pages/MainPage/MainPage.jsx';
import MeetingPage from './pages/MeetingPage/MeetingPage.jsx';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage.jsx';
import api from './utils/links/api.js';


const App = () => {
  const [user, setUser] = useState(true);
  const [userName, setUsername] = useState(window.localStorage.getItem('login'));
  const [isadmin, setIsAdmin] = useState(window.localStorage.getItem('is_admin') === 'true');

  const userData = {
    userName: {
      userName: userName,
      setUsername: setUsername
    },
    admin: {
      isAdmin: isadmin,
      setIsAdmin: setIsAdmin
    }
  };

  const handleLogOut = e => {
    setUser(false);
    setUsername('');
  };

  // const resetValuesList = {
  //   'boolean': false,
  //   'string': ''
  // }

  // Object.keys(userData).forEach((key) => {
  //   const category = userData[key]
  //   const [value, setter] = Object.values(category);
  //   // setter(resetValuesList[typeof value]);
  //   console.log(value, resetValuesList[typeof value]);
  // });

  return (
    <Router>
      {/* <Header userName={ userName }/> */}
      <Routes>
        {/* Аутентификация */}
        <Route exact path={ routing.authentidication } element={
          <AuthPage
          user={ user }
          userData={ userData } />
        }/>

        {/* Главная страница */}
        <Route path={ routing.mainPage } >
            <Route path={ routing.index } element={
              <ProtectedRoute user={ user }>
                <MainPage 
                userData={ userData }
                />
              </ProtectedRoute>
            }/>
            <Route path={ routing.meeting } element={
              <ProtectedRoute user={ user }>
                <MeetingPage 
                userData={ userData }
                />
              </ProtectedRoute>
            } />
        </ Route>

        {/* Профиль пользователя */}
        <Route path={ routing.profile } element={
          <ProtectedRoute user={ user }>
            <UserProfilePage 
            handleLogOut={handleLogOut}
            userData={ userData }
            />
          </ProtectedRoute>
        }/>

        {/* Контент не найден */}
        <Route path='/' element={
          <Navigate to={ routing.mainPage } />
        }
        />
      </Routes>
    </Router>
  );
}

export default App;
