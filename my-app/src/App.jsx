import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import AuthPage from './pages/AuthentificationPage/AuthentificationPage.jsx';
import Header from './components/Header/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import MainPage from './pages/MainPage/MainPage.jsx';
import './App.css';
import routing from './routing.js';
import api from './api.js';


// fetch(api.logIn, {
//   method: "POST",
//   body: 'grant_type=password&username=lox%40example.com&password=123123123&scope=&client_id=string&client_secret=string',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'access': 'application/json'
//   }
// });

// fetch(api.users, {
//   method: 'GET',
//   headers: {
//     'accept': 'application/json',
//     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsb3hAZXhhbXBsZS5jb20iLCJleHAiOjE3Mjk3NjEzMjV9.O8hFAYztjhnV2htrXDa4bK4w6GFVvVrK9mn2uaTQ8KY'
//   }
// }).then((response) => response.json()).then((data) => console.log(data));


const App = () => {
  const [user, setUser] = useState(false);
  const [logIn, setLogIn] = useState('');
  const [jwt, setJwt] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const data = {
    // username: "LOXewqewq",
    username: "lox@example.com",
    password: "123123123"
  };

  const onChangeLogin = e => {
    setLogIn(e.target.value);
    console.log('Логин', e.target.value);
  };

  const onChangePassword = e => {
    setPassword(e.target.value);
    console.log('Пароль', e.target.value);
  };

  const onChangeNickname = e => {
    setNickname(e.target.value);
    console.log('Никнейм', e.target.value);
  };

  const handleLogIn = e => {
    fetch(api.logIn, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=password&username=${logIn.replaceAll('@', '%40')}&password=${password}&scope=&client_id=string&client_secret=string`
    }).then((response) => response.json()).then((data) => setJwt(data.access_token));
    setUser(true);
  };

  const handleLogOut = e => {
    setUser(false);
    setJwt('-');
  };

  const handleRegistration = e => {
    fetch(api.register, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: nickname, email: logIn, password: password})
    });
  };

  // EXAMPLE@example.com 123123123
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact props={ data } path={ routing.authentidication } element={
          <AuthPage data={ data } 
          handleLogIn={ handleLogIn } 
          user={ user } 
          token={ jwt }
          loginForm={ {login: {logIn: logIn, onChangeLogin: onChangeLogin}, pass: {password: password, onChangePassword: onChangePassword}, nickname: {onChangeNickname: onChangeNickname}} } 
          handleRegistration={ handleRegistration }
          />
        }/>
        <Route path={ routing.index } element={
          <ProtectedRoute user={ user }>
            <MainPage handleLogOut={handleLogOut} token={jwt} />
          </ProtectedRoute>
        } />
        <Route />
      </Routes>
    </Router>
  );
}

export default App;
