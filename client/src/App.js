import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import DashBoard from './components/DashBoard';
import Home from './components/Home';
import Login from './components/Login';
import Maps from './components/Map';
import MyGrid from './components/mygrid';
import { Provider } from 'react-redux';
import store from './store/index';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
        <div>
            <Route path='/' exact={true} component={Home} />
            <Route path='/dashboard' exact={true} component={DashBoard}/>
            <Route path='/login' exact={true} component={Login}/>
            <Route path='/map' exact={true} component={Maps}/>
            <Route path="/grid" component={MyGrid} />
        </div>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
