import React, {Component} from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container} from 'reactstrap';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import Logo from "./logo.png";
import Typography from "@material-ui/core/Typography";


class Home extends Component {

    constructor(props) {
        super(props);
        const admin = JSON.parse(localStorage.getItem("adminUser"));
        if (admin === null){
            localStorage.clear();
            this.props.history.push('/');
        }
    }

    render() {
        return (
            <div>
                <AppNavbar/>
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

export default withRouter(Home);