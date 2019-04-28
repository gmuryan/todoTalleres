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
            item: this.emptyItem
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

    async handleSubmit(event) {
        event.preventDefault();
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
                    </FormGroup>
                    <FormGroup>
                        <Label for="apellido">Apellido</Label>
                        <Input type="text" name="apellido" id="apellido" value={item.apellido || ''}
                               onChange={this.handleChange} autoComplete="apellido"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="telefono">Telefono</Label>
                        <Input type="text" name="telefono" id="telefono" value={item.telefono || ''}
                               onChange={this.handleChange} autoComplete="telefono"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="mail">Mail</Label>
                        <Input type="text" name="mail" id="mail" value={item.mail || ''}
                               onChange={this.handleChange} autoComplete="mail"/>
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