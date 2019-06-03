import React, { Component } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, Button } from 'reactstrap';
import {Link, withRouter} from 'react-router-dom';
import {confirmAlert} from "react-confirm-alert";

export default class AppNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  logout(){
    localStorage.clear();
  }



  render() {
    return <Navbar color="dark" dark expand="md">
      <NavbarBrand tag={Link} to="/home">Home</NavbarBrand>
      <NavbarBrand tag={Link} to="/clientes">Clientes</NavbarBrand>
      <NavbarBrand tag={Link} to="/talleres">Talleres</NavbarBrand>
      {/*<NavbarBrand tag={Link} to="/prendas">Prendas</NavbarBrand>*/}
      {/*<NavbarBrand tag={Link} to="/ordenesCompra">Ordenes de Compra</NavbarBrand>*/}
      <NavbarToggler onClick={this.toggle}/>
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
              <Button onClick={this.logout} tag={Link} to="/">Logout</Button>
          </NavItem>
        {/*  <NavItem>*/}
        {/*    <NavLink href="https://github.com/oktadeveloper/okta-spring-boot-react-crud-example">GitHub</NavLink>*/}
        {/*  </NavItem>*/}
        </Nav>
      </Collapse>
    </Navbar>;
  }
}