import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import Home from "../../Pages/Home/Home";
import NotFound from "../../Pages/NotFound/NotFound";
function App() {

  return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/home/:id">
                <Home/>
            </Route>
            <Route exact path="/404">
                <NotFound/>
            </Route>
            <Redirect to={"/404"}/>
          </Switch>
        </Router>
      </div>
  );
}

export default App;