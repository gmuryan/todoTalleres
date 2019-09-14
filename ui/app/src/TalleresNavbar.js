import React, { Component } from 'react';
import {Button, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from 'reactstrap';
import { Link } from 'react-router-dom';

export default class TalleresNavbar extends Component {
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
        const taller = JSON.parse(localStorage.getItem("tallerUser"));
        if (taller !== null){
        return <Navbar color="dark" dark expand="md">
            <NavbarBrand tag={Link} to="/homeTaller">Home</NavbarBrand>
            <NavbarBrand tag={Link} to={"/miTaller/" + taller.idTaller}>Mi Taller</NavbarBrand>
            <NavbarBrand tag={Link} to={"/reseñas/" + taller.idTaller}>Mis Reseñas</NavbarBrand>
            <NavbarBrand tag={Link} to="/mecanicos">Mecanicos</NavbarBrand>
            <NavbarBrand tag={Link} to="/reparaciones">Reparaciones</NavbarBrand>
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
            return null;
        }
    }
}