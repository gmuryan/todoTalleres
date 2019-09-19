import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import ClientesNavbar from './ClientesNavbar';
import {confirmAlert} from "react-confirm-alert";

class MisDatos extends Component {


    emptyItem = {
        nombre: '',
        apellido: '',
        telefono: '',
        mail: '',
        password: '',
        repeatPassword: ''
    };


    constructor(props) {
        super(props);
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (cliente === null) {
            localStorage.clear();
            this.props.history.push('/')
        } else if (cliente.idCliente !== parseFloat(this.props.match.params.id)) {
            localStorage.clear();
            this.props.history.push('/');
        }
        this.state = {
            item: this.emptyItem,
            errors: {},
            flag: false,
            formIsValid: true,
            mailCargado: ''
        };
        this.validateMailTaller = this.validateMailTaller.bind(this);
        this.validateMailCliente = this.validateMailCliente.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        const usuario = JSON.parse(localStorage.getItem("clienteUser"));
        if (usuario !== null) {
            if (this.props.match.params.id !== 'new' && usuario.idCliente === parseFloat(this.props.match.params.id)) {
                const cliente = await (await fetch(`/api/cliente/${this.props.match.params.id}`)).json();
                this.setState({mailCargado: cliente.mail});
                this.setState({item: cliente});
            }
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    validateMailTaller() {
        let fields = this.state.item;
        return fetch(`/api/tallerByMail?mail=${encodeURIComponent(fields["mail"])}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    validateMailCliente() {
        let fields = this.state.item;
        return fetch(`/api/clienteByMail?mail=${encodeURIComponent(fields["mail"])}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    handleValidation() {
        let fields = this.state.item;
        let errors = {};
        this.setState({formIsValid: true});

        //Name
        if (fields["nombre"].length === 0) {
            this.setState({formIsValid: false});
            errors["nombre"] = "No puede estar vacio";
        } else if (typeof fields["nombre"] !== "undefined") {
            if (!fields["nombre"].match(/^[a-zA-Z]+$/)) {
                this.setState({formIsValid: false});
                errors["nombre"] = "Solo letras";
            }
        }

        //Apellido
        if (fields["apellido"].length === 0) {
            this.setState({formIsValid: false});
            errors["apellido"] = "No puede estar vacio";
        } else if (typeof fields["apellido"] !== "undefined") {
            if (!fields["apellido"].match(/^[a-zA-Z]+$/)) {
                this.setState({formIsValid: false});
                errors["apellido"] = "Solo letras";
            }
        }

        //Telefono
        if (fields["telefono"].length === 0) {
            this.setState({formIsValid: false});
            errors["telefono"] = "No puede estar vacio";
        } else if (typeof fields["telefono"] !== "undefined") {
            if (!fields["telefono"].match(/^[0-9]+$/)) {
                this.setState({formIsValid: false});
                errors["telefono"] = "Solo numeros";
            }
        }

        //Contraseña
        if (!fields["password"]) {
            this.setState({formIsValid: false});
            errors["password"] = "No puede estar vacio";
        }

        //RepetirContraseña
        if (!fields["repeatPassword"]) {
            this.setState({formIsValid: false});
            errors["repeatPassword"] = "No puede estar vacio";
        } else if (fields["password"] !== fields["repeatPassword"]) {
            this.setState({formIsValid: false});
            errors["repeatPassword"] = "Debe ser igual a la contraseña";
        }

        this.setState({errors: errors});

        //Email
        if (!fields["mail"]) {
            this.setState({formIsValid: false});
            errors["mail"] = "No puede estar vacio";
            this.setState({errors: errors});
        } else if (typeof fields["mail"] !== "undefined") {
            let lastAtPos = fields["mail"].lastIndexOf('@');
            let lastDotPos = fields["mail"].lastIndexOf('.');
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["mail"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["mail"].length - lastDotPos) > 2)) {
                this.setState({formIsValid: false});
                errors["mail"] = "Mail invalido";
                this.setState({errors: errors});
            }
        }
        return this.validateMailTaller().then((response) => {
            if (response.ok && this.state.mailCargado !== fields["mail"]) {
                console.log("aca");
                this.setState({formIsValid: false});
                errors["mail"] = "Este mail ya esta registrado";
                this.setState({errors: errors});
            } else {
                return this.validateMailCliente().then((response) => {
                    if (response.ok && this.state.mailCargado !== fields["mail"]) {
                        this.setState({formIsValid: false});
                        errors["mail"] = "Este mail ya esta registrado";
                        this.setState({errors: errors});
                    }
                })
            }
        });
    }

    dialogCreado() {
        confirmAlert({
            title: 'Operacion Exitosa',
            buttons: [
                {
                    label: 'Aceptar',
                    onClick: () => this.props.history.push('/homeCliente')
                }
            ]
        })
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.handleValidation().then((result) => {
            if (this.state.formIsValid) {
                const {item} = this.state;

                fetch('/api/cliente', {
                    method: (item.idCliente) ? 'PUT' : 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item),
                });
                this.dialogCreado();
            }
        })
    }

    render() {
        const {item, flag} = this.state;
        const title = <h2>{item.idCliente ? 'Editar Cliente' : 'Crear Cliente'}</h2>;

        if (flag == false && item.idCliente) {
            item.repeatPassword = item.password;
            this.setState({flag: !this.state.flag});
        }


        return <div>
            <ClientesNavbar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="nombre">Nombre</Label>
                            <Input type="text" name="nombre" id="nombre" value={item.nombre || ''}
                                   onChange={this.handleChange} autoComplete="nombre"/>
                            <span className="error">{this.state.errors["nombre"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="apellido">Apellido</Label>
                            <Input type="text" name="apellido" id="apellido" value={item.apellido || ''}
                                   onChange={this.handleChange} autoComplete="apellido"/>
                            <span className="error">{this.state.errors["apellido"]}</span>
                        </FormGroup>
                    </div>
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="telefono">Teléfono</Label>
                            <Input type="text" name="telefono" id="telefono" value={item.telefono || ''}
                                   onChange={this.handleChange} autoComplete="telefono"/>
                            <span className="error">{this.state.errors["telefono"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="mail">Mail</Label>
                            <Input type="text" name="mail" id="mail" value={item.mail || ''}
                                   onChange={this.handleChange} autoComplete="mail"/>
                            <span className="error">{this.state.errors["mail"]}</span>
                        </FormGroup>
                    </div>
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="password">Contraseña</Label>
                            <Input type="password" name="password" id="password" value={item.password || ''}
                                   onChange={this.handleChange} autoComplete="password"/>
                            <span className="error">{this.state.errors["password"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="repeatPassword">Repetir Contraseña</Label>
                            <Input type="password" name="repeatPassword" id="repeatPassword"
                                   value={item.repeatPassword || ''}
                                   onChange={this.handleChange} autoComplete="repeatPassword"/>
                            <span className="error">{this.state.errors["repeatPassword"]}</span>
                        </FormGroup>
                    </div>
                    <FormGroup>
                        <Button color="primary" type="submit">Guardar</Button>{' '}
                        <Button color="secondary" tag={Link} to="/homeCliente">Cancelar</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(MisDatos);