import React, { Component } from 'react';
import './App.css';
import ClientesNavbar from './ClientesNavbar';
import {Link, withRouter} from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css


class HomeCliente extends Component {

    constructor(props) {
        super(props);
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (cliente === null){
            localStorage.clear();
            this.props.history.push('/');
        }
    }


    render() {
        return (
            <div>
                <ClientesNavbar/>
                <Container fluid>
                    {/*    <Button color="link"><Link to="/proveedores">Manage Suppliers</Link></Button>*/}
                    {/*          <div className="container">*/}
                    {/*  <button onClick={this.submit}>Confirm dialog</button>*/}
                    {/*  <p>My name is: {this.props.mssg}</p>*/}
                    {/*</div>*/}
                </Container>
            </div>
        );
    }
}

export default withRouter (HomeCliente);