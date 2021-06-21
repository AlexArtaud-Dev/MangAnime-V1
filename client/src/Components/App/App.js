import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Home from "../../Pages/Home/Home";
import NotFoundPage from "../../Pages/NotFound/NotFoundPage";
import './App.less';
import { Button } from 'antd';
import NotFoundNotLoggedPage from "../../Pages/NotFoundNotLogged/NotFoundNotLoggedPage";
import HomeNotLoggedPage from "../../Pages/HomeNotLoggedPage/HomeNotLoggedPage";
function App() {
    const test = 15;
  return (
      <div>
          {test ? (
              <Router>
                  <Switch>
                      <Route exact path="/">
                          <Redirect to="/home"/>
                      </Route>
                      <Route exact path="/home">
                          <HomeNotLoggedPage/>
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
                      <Route exact path="/home/:id">
                          <Home/>
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