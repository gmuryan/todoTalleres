import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

class ClienteEdit extends Component {


    emptyItem = {
        nombre: '',
        apellido: '',
        telefono: '',
        mail: '',
        reservas: []
    };


    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            errors: {}
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const cliente = await (await fetch(`/api/cliente/${this.props.match.params.id}`)).json();
            this.setState({item: cliente});
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

    handleValidation(){
        let fields = this.state.item;
        let errors = {};
        let formIsValid = true;

        //Name
        if(fields["nombre"].length === 0){
            formIsValid = false;
            errors["nombre"] = "No puede estar vacio";
        }
        else if(typeof fields["nombre"] !== "undefined"){
            if(!fields["nombre"].match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["nombre"] = "Solo letras";
            }
        }

        //Apellido
        if(fields["apellido"].length === 0){
            formIsValid = false;
            errors["apellido"] = "No puede estar vacio";
        }
        else if(typeof fields["apellido"] !== "undefined"){
            if(!fields["apellido"].match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["apellido"] = "Solo letras";
            }
        }

        //Telefono
        if(fields["telefono"].length === 0){
            formIsValid = false;
            errors["telefono"] = "No puede estar vacio";
        }
        else if(typeof fields["telefono"] !== "undefined"){
            if(!fields["telefono"].match(/^[0-9]+$/)){
                formIsValid = false;
                errors["telefono"] = "Solo numeros";
            }
        }

        //Email
        if(!fields["mail"]){
            formIsValid = false;
            errors["mail"] = "No puede estar vacio";
        }
        else if(typeof fields["mail"] !== "undefined"){
            let lastAtPos = fields["mail"].lastIndexOf('@');
            let lastDotPos = fields["mail"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["mail"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["mail"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["mail"] = "Mail invalido";
            }
        }

        this.setState({errors: errors});
        return formIsValid;
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (this.handleValidation()){
        const {item} = this.state;

        await fetch('/api/cliente', {
            method: (item.idCliente) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/clientes');
        }
    }

    render() {
        const {item} = this.state;
        const title = <h2>{item.idCliente ? 'Editar Cliente' : 'Crear Cliente'}</h2>;

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="nombre">Nombre</Label>
                        <Input type="text" name="nombre" id="nombre" value={item.nombre || ''}
                               onChange={this.handleChange} autoComplete="nombre"/>
                        <span className="error">{this.state.errors["nombre"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="apellido">Apellido</Label>
                        <Input type="text" name="apellido" id="apellido" value={item.apellido || ''}
                               onChange={this.handleChange} autoComplete="apellido"/>
                        <span className="error">{this.state.errors["apellido"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="telefono">Telefono</Label>
                        <Input type="text" name="telefono" id="telefono" value={item.telefono || ''}
                               onChange={this.handleChange} autoComplete="telefono"/>
                        <span className="error">{this.state.errors["telefono"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="mail">Mail</Label>
                        <Input type="text" name="mail" id="mail" value={item.mail || ''}
                               onChange={this.handleChange} autoComplete="mail"/>
                        <span className="error">{this.state.errors["mail"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Guardar</Button>{' '}
                        <Button color="secondary" tag={Link} to="/clientes">Cancelar</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(ClienteEdit);