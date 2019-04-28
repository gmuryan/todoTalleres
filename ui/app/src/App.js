import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ClienteList from './ClienteList';
import ClienteEdit from './ClienteEdit';

class App extends Component {
    componentDidMount(){
        document.title = "Todo Talleres"
    }
  render() {
    return (
        <div><Home mssg = "I like cheese"/></div>,
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home}/>
          <Route path='/clientes' exact={true} component={ClienteList}/>
          <Route path='/clientes/:id' component={ClienteEdit}/>
        </Switch>
      </Router>
    )
  }
}

export default App;