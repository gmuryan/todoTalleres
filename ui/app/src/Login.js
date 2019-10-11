import React, {Component} from "react";
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import './App.css';
import {Link, Redirect} from "react-router-dom";
import {useState} from "react";

const imgTaller = require('./taller.jpg');
const divStyle = {
    width: '100%',
    height: '800px',
    backgroundImage: `url(${imgTaller})`,
    backgroundSize: 'cover'
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errors: {},
            formIsValid: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = event => {
        event.preventDefault();
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        let errors = {};
        const {email, password} = this.state;
        if (email == 'admin' && password == 'admin') {
            localStorage.clear();
            localStorage.setItem("adminUser", JSON.stringify(this.state));
            this.props.history.push('/home');
        } else {
            await fetch(`/api/tallerByMail?mail=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        if (email === json.mail && password === json.password && json.activo) {
                            localStorage.clear();
                            localStorage.setItem("tallerUser", JSON.stringify(json));
                            this.props.history.push('/homeTaller');
                        }
                    })
                }
            });

            console.log("test");
            await fetch(`/api/clienteByMail?mail=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        if (email === json.mail && password === json.password && json.activo) {
                            localStorage.clear();
                            localStorage.setItem("clienteUser", JSON.stringify(json));
                            this.props.history.push('/homeCliente');
                        }else{
                            this.setState({formIsValid: false});
                            errors["password"] = "Datos invalidos";
                            this.setState({errors: errors});
                        }
                    })
                } else {
                    this.setState({formIsValid: false});
                }
            });
        }

        if (!this.state.formIsValid) {
            errors["password"] = "Datos invalidos";
            this.setState({errors: errors});
        }


    }

    render() {
        return <div className="img-login" style={divStyle}>
            <Container>
                <Form className="login-form" onSubmit={this.handleSubmit}>
                    <h1 className="text-center">
                        <span className="font-weight-bold">TodoTalleres</span>
                    </h1>
                    <h2 className="text-center">Bienvenido</h2>
                    <FormGroup>
                        <Input type="text" name="email" id="email" placeholder="Email"
                               onChange={this.handleChange} autoComplete="email"/>
                    </FormGroup>
                    <FormGroup>
                        <Input type="password" name="password" id="password" placeholder="Contraseña"
                               onChange={this.handleChange} autoComplete="password"/>
                    </FormGroup>
                    <span className="error-login">{this.state.errors["password"]}</span>
                    <Button className="btn-lg btn-block" color="success" type="submit">Ingresar</Button>
                    <Button className="btn-lg btn-block" color="primary" tag={Link} to="/registracion">Registrarse</Button>
                </Form>
            </Container>
        </div>
    }

}

export default Login;