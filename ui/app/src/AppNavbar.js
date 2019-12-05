import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import MenuAppBar from "./AppBar";

class AppNavbar extends Component {
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
    const admin = JSON.parse(localStorage.getItem("adminUser"));
    return <MenuAppBar logout={this.logout} adminUser={admin}/>/*<Navbar color="dark" dark expand="md">
      <NavbarBrand tag={Link} to="/home">Home</NavbarBrand>
      <NavbarBrand tag={Link} to="/clientes">Clientes</NavbarBrand>
      <NavbarBrand tag={Link} to="/talleres">Talleres</NavbarBrand>
      <NavbarToggler onClick={this.toggle}/>
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
              <Button onClick={this.logout} >Logout</Button>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>*/;
  }
}

export default withRouter(AppNavbar);