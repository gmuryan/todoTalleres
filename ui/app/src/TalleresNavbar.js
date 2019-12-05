import React, { Component } from 'react';
import MenuAppBar from "./AppBar";

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
        return <MenuAppBar tallerUser={taller} logout={this.logout}/>/*<Navbar color="dark" dark expand="md">
            <NavbarBrand tag={Link} to="/homeTaller">Home</NavbarBrand>
            <NavbarBrand tag={Link} to={"/miTaller/" + taller.idTaller}>Mi Taller</NavbarBrand>
            <NavbarBrand tag={Link} to={"/reseñas/" + taller.idTaller}>Mis Reseñas</NavbarBrand>
            <NavbarBrand tag={Link} to="/mecanicos">Mecánicos</NavbarBrand>
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
            return null;
        }
    }
}