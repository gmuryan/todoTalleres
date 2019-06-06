import React, { Component } from 'react';
import {Button, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import { Link } from 'react-router-dom';

export default class ClientesNavbar extends Component {
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
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (cliente !== null){
        return <Navbar color="dark" dark expand="md">
            <NavbarBrand tag={Link} to="/homeCliente">Home</NavbarBrand>
            <NavbarBrand tag={Link} to={"/misDatos/" + cliente.idCliente}>Mis Datos</NavbarBrand>
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
        }else{
            return  null;
        }
    }
}