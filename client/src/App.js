import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import DashBoard from './components/DashBoard';
import Home from './components/Home';
import Login from './components/Login';
//import Navbar from './components/NavBar';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
            <Route path='/' exact={true} component={Home} />
            <Route path='/dashboard' exact={true} component={DashBoard}/>
            <Route path='/Login' exact={true} component={Login}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
