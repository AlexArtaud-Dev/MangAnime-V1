import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import NotFoundPage from "../../Pages/NotFound/NotFoundPage";
import './App.less';
import NotFoundNotLoggedPage from "../../Pages/NotFoundNotLogged/NotFoundNotLoggedPage";
import HomeNotLoggedPage from "../../Pages/HomeNotLoggedPage/HomeNotLoggedPage";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import {checkToken} from "../../Functions/auth";
import HomePage from "../../Pages/HomePage/HomePage";
import RegisterPage from "../../Pages/RegisterPage/RegisterPage";
import QrLoginPage from "../../Pages/QrLoginPage/QrLoginPage";

function App() {
    const [logged, setLogged] = useState({
        loading: true,
        connected: false
    });
    const test = async () =>{
        return await checkToken();
    }
    if (logged.loading){
        test().then(data => {
            setLogged({
                loading: false,
                connected: data
            })
        })
    }

      return (
          <div>
              {!logged.connected || logged.connected.status === 1 ? (
                  <Router>
                      <Switch>
                          <Route exact path="/">
                              <Redirect to="/home"/>
                          </Route>
                          <Route exact path="/home">
                              <HomeNotLoggedPage/>
                          </Route>
                          <Route exact path="/qrlogin">
                              <QrLoginPage/>
                          </Route>
                          <Route exact path="/login">
                              <LoginPage/>
                          </Route>
                          <Route exact path="/register">
                              <RegisterPage/>
                          </Route>
                          <Route exact path="/404">
                              <NotFoundNotLoggedPage/>
                          </Route>
                          <Redirect to={"/404"}/>
                      </Switch>
                  </Router>
              ) : (
                  <Router>
                      <Switch>
                          <Route exact path="/qrlogin">
                              <Redirect to="/home"/>
                          </Route>
                          <Route exact path="/home">
                              <HomePage/>
                          </Route>
                          <Route path="/anime/:name">
                              <HomePage/>
                          </Route>
                          <Route exact path="/404">
                              <NotFoundPage/>
                          </Route>
                          <Redirect to={"/404"}/>
                      </Switch>
                  </Router>
              )}

          </div>
      );
}

export default App;