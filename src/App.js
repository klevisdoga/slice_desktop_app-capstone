import React from 'react';
import { Switch, Route, HashRouter } from 'react-router-dom';
import './App.scss';
import LoginPage from './Components/LoginPage/LoginPage';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Switch>
          <Route path={'/'} exact component={LoginPage}  />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
