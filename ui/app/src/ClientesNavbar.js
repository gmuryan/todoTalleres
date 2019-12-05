import React, { Component } from 'react';
import MenuAppBar from "./AppBar";

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
        return <MenuAppBar clienteUser={cliente} logout={this.logout}/>/*<Navbar color="dark" dark expand="md">
            <NavbarBrand tag={Link} to="/homeCliente">Home</NavbarBrand>
            <NavbarBrand tag={Link} to={"/misDatos/" + cliente.idCliente}>Mis Datos</NavbarBrand>
            <NavbarBrand tag={Link} to="/talleres">Talleres</NavbarBrand>
            <NavbarBrand tag={Link} to="/reparaciones">Reparaciones</NavbarBrand>
            <NavbarToggler onClick={this.toggle}/>
            <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <Button onClick={this.logout} tag={Link} to="/">Logout</Button>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>*/;
        }else{
            return  null;
        }
    }
}