import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProveedorList from './ProveedorList';
import ProveedorEdit from './ProveedorEdit';
import MaterialList from './MaterialList';
import MaterialEdit from './MaterialEdit';

class App extends Component {
    componentDidMount(){
        document.title = "Fabrica React"
    }
  render() {
    return (
        <div><Home mssg = "I like cheese"/></div>,
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home}/>
          <Route path='/proveedores' exact={true} component={ProveedorList}/>
          <Route path='/proveedores/:id' component={ProveedorEdit}/>
          <Route path='/materiales' exact={true} component={MaterialList}/>
          <Route path='/materiales/:id' component={MaterialEdit}/>
        </Switch>
      </Router>
    )
  }
}

export default App;