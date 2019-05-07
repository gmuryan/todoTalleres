import React, { Component } from "react";
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import './App.css';
import {Link, Redirect} from "react-router-dom";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
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
        const {email, password} = this.state;
        if (email == 'admin' && password == 'admin') {
            this.props.history.push('/home');
        }
        const cliente = await (await fetch(`/api/clienteByMail?mail=${encodeURIComponent(email)}`)).json();
        if (email == cliente.mail && password == cliente.password){
            localStorage.setItem("currentUser", JSON.stringify(cliente));
            this.props.history.push('/home');
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
                            {/*<span className="error">{this.state.errors["email"]}</span>*/}
                        </FormGroup>
                    </div>
                    <div className="row">
                        <FormGroup className="col-md-6 col-centered">
                            <Label for="password">Contraseña</Label>
                            <Input type="password" name="password" id="password"
                                   onChange={this.handleChange} autoComplete="password"/>
                            {/*<span className="error">{this.state.errors["password"]}</span>*/}
                        </FormGroup>
                    </div>
                    <FormGroup>
                        <Button className="button-allign" color="primary" type="submit">Login</Button>{' '}
                    </FormGroup>
                    &nbsp;&nbsp;
                    &nbsp;&nbsp;
                    &nbsp;&nbsp;
                    <FormGroup>
                        <Button className="button-allign"  color="secondary" tag={Link} to="/registracion">Registrarse</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }

}

export default Login;