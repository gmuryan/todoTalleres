import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ClienteList from './ClienteList';
import ClienteEdit from './ClienteEdit';
import TallerList from './TallerList';
import TallerEdit from './TallerEdit';
import Login from './Login'
import Registracion from './Registracion'
import HomeTaller from './HomeTaller'
import HomeCliente from './HomeCliente'
import MecanicoList from './MecanicoList'
import MecanicoEdit from './MecanicoEdit'
import MiTaller from './MiTaller'

class App extends Component {
    componentDidMount(){
        document.title = "Todo Talleres"
    }
  render() {
    return (
        <div><Home mssg = "I like cheese"/></div>,
      <Router>
        <Switch>
          <Route path='/home' exact={true} component={Home}/>
          <Route path='/homeTaller' exact={true} component={HomeTaller}/>
          <Route path='/homeCliente' exact={true} component={HomeCliente}/>
          <Route path='/clientes' exact={true} component={ClienteList}/>
          <Route path='/clientes/:id' component={ClienteEdit}/>
          <Route path='/talleres' exact={true} component={TallerList}/>
          <Route path='/talleres/:id' component={TallerEdit}/>
          <Route path='/' exact={true} component={Login}/>
          <Route path='/registracion' exact={true} component={Registracion}/>
          <Route path='/mecanicos' exact={true} component={MecanicoList}/>
          <Route path='/mecanicos/:id' component={MecanicoEdit}/>
          <Route path='/miTaller/:id' component={MiTaller}/>
        </Switch>
      </Router>
    )
  }
}

export default App;