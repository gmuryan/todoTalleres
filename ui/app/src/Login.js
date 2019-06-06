import React, {Component} from "react";
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import './App.css';
import {Link, Redirect} from "react-router-dom";

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
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        let errors = {};
        const {email, password} = this.state;
        if (email == 'admin' && password == 'admin') {
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
                if (response.ok){
                    response.json().then(json => {
                        if (email == json.mail && password == json.password) {
                            localStorage.setItem("tallerUser", JSON.stringify(json));
                            this.props.history.push('/homeTaller');
                        }
                    })
                }
            });

            await fetch(`/api/clienteByMail?mail=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok){
                    response.json().then(json => {
                        if (email == json.mail && password == json.password) {
                            localStorage.setItem("clienteUser", JSON.stringify(json));
                            this.props.history.push('/homeCliente');
                        }
                    })
                }else{
                    this.setState({formIsValid: false});
                }
            });

        }
        if (!this.state.formIsValid){
            errors["password"] = "Datos invalidos";
            this.setState({errors: errors});
        }


    }

    render() {
        const {email, password} = this.state;
        const title = <h2 className="headertekst">Ingreso al Sistema</h2>;


        return <div>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <FormGroup className="col-md-6 col-centered">
                            <Label for="email">Email</Label>
                            <Input type="text" name="email" id="email"
                                   onChange={this.handleChange} autoComplete="email"/>
                            <span className="error">{this.state.errors["email"]}</span>
                        </FormGroup>
                    </div>
                    <div className="row">
                        <FormGroup className="col-md-6 col-centered">
                            <Label for="password">Contraseña</Label>
                            <Input type="password" name="password" id="password"
                                   onChange={this.handleChange} autoComplete="password"/>
                            <span className="error-login">{this.state.errors["password"]}</span>
                        </FormGroup>
                    </div>
                    <FormGroup>
                        <Button className="button-allign" color="primary" type="submit">Login</Button>{' '}
                        <Button className="button-allign2" color="secondary" tag={Link}
                                to="/registracion">Registrarse</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }

}

export default Login;