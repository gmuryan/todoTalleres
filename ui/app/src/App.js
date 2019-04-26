import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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
        </Switch>
      </Router>
    )
  }
}

export default App;