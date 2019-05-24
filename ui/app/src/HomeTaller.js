import React, { Component } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import {Link, withRouter} from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css


class HomeTaller extends Component {

    constructor(props) {
        super(props);
        console.log(this.props);
        const taller = JSON.parse(localStorage.getItem("currentUser"));
        console.log(taller);
    }


    render() {
        return (
            <div>
                <AppNavbar/>
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

export default withRouter (HomeTaller);