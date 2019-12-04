import React, { Component } from 'react';
import './App.css';
import ClientesNavbar from './ClientesNavbar';
import {Link, withRouter} from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import Logo from "./logo.png";
import Typography from "@material-ui/core/Typography";

class HomeCliente extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nuevosPresupuestos: []
        };
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (cliente === null){
            localStorage.clear();
            this.props.history.push('/');
        }
    }

    async componentDidMount() {
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (cliente !== null) {
            const nuevosPresups = await (await fetch(`/api/nuevoPresupuesto/${cliente.idCliente}`)).json();
            this.setState({nuevosPresupuestos: nuevosPresups});
            if (this.state.nuevosPresupuestos.length > 0){
                for (const [index, value] of this.state.nuevosPresupuestos.entries()) {
                    this.dialogNuevoPresupuesto(value);
                }
            }
        }
    }

    async updateNuevoPresupuesto(value){
        await fetch(`/api/updateNuevoPresupuesto/${value}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }

    dialogNuevoPresupuesto(value){
        confirmAlert({
            title: 'Nuevo Presupuesto',
            message: 'Hay un nuevo presupuesto en la reparación con ID ' + value,
            buttons: [
                {
                    label: 'Aceptar',
                    onClick: () => this.updateNuevoPresupuesto(value)
                }
            ]
        })
    }

    render() {
        return (
            <div>
                <ClientesNavbar/>
                <Container fluid style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div className="div-logo">
                        <img src={Logo} />
                    </div>
                    <Typography variant="h4" align="center">¡Bienvenido a TodoTalleres!</Typography>
                </Container>
            </div>
        );
    }
}

export default withRouter (HomeCliente);