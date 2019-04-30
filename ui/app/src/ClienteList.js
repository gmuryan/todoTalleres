import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {Link} from 'react-router-dom';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import './App.css';

class ClienteList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clientes: [],
            isLoading: true,
            nombre: '',
            apellido: '',
            mail: '',
            currentPage: 1,
            todosPerPage: 10
        };
        this.handleClick = this.handleClick.bind(this);
        this.remove = this.remove.bind(this);
    }

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch('api/clientes')
            .then(response => response.json())
            .then(data => this.setState({clientes: data, isLoading: false}))

    }

    async remove(id) {
        await fetch(`/api/cliente/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedClientes = [...this.state.clientes].filter(i => i.idCliente !== id);
            this.setState({clientes: updatedClientes});
        });
    }

    dialog(cliente) {
        confirmAlert({
            title: 'Confirmar',
            message: 'Esta seguro de realizar esta accion?',
            buttons: [
                {
                    label: 'Si',
                    onClick: () => this.remove(cliente.idCliente)
                },
                {
                    label: 'No'
                }
            ]
        })
    };

    filterMail = e => {
        this.setState({mail: e.target.value});
    }

    filterNombre = e => {
        this.setState({nombre: e.target.value});
    }

    filterApellido = e => {
        this.setState({apellido: e.target.value});
    }

    render() {
        const {clientes, isLoading, nombre, apellido, mail, currentPage, todosPerPage} = this.state;
        let filterClientes = this.state.clientes.slice();
        if (this.state.nombre) {
            filterClientes = filterClientes.filter(cliente => cliente.nombre.toLowerCase().indexOf(nombre.toLowerCase()) !== -1);
        }
        if (this.state.apellido) {
            filterClientes = filterClientes.filter(cliente => cliente.apellido.toLowerCase().indexOf(apellido.toLowerCase()) !== -1);
        }
        if (this.state.mail) {
            filterClientes = filterClientes.filter(cliente => cliente.mail.toLowerCase().indexOf(mail.toLowerCase()) !== -1);
        }

        if (isLoading) {
            return <p>Loading...</p>;

        }

        // Logic for displaying current todos
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = filterClientes.slice(indexOfFirstTodo, indexOfLastTodo);

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(clientes.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    key={number}
                    id={number}
                    onClick={this.handleClick}
                >
                    [{number}]
                </li>
            );
        });

        const clienteList = currentTodos.map(cliente => {
            return <tr key={cliente.idCliente}>
                <td>{cliente.idCliente}</td>
                <td style={{whiteSpace: 'nowrap'}}>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.mail}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link}
                                to={"/clientes/" + cliente.idCliente}>Editar</Button>
                        &nbsp;&nbsp;
                        <Button size="sm" color="danger" onClick={() => this.dialog(cliente)}>Eliminar</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/clientes/new">Crear Cliente</Button>
                    </div>
                    <h3>Clientes</h3>
                    <input type="text" onChange={this.filterNombre} placeholder="Nombre..."></input>
                    &nbsp;&nbsp;
                    <input type="text" onChange={this.filterApellido} placeholder="Apellido..."></input>
                    &nbsp;&nbsp;
                    <input type="text" onChange={this.filterMail} placeholder="Mail..."></input>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="20%">Id</th>
                            <th width="20%">Nombre</th>
                            <th width="20%">Apellido</th>
                            <th width="20%">Telefono</th>
                            <th width="20%">Mail</th>
                            <th width="10%">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {clienteList}
                        </tbody>
                    </Table>
                    <ul id="page-numbers">
                        <Label>Paginas:</Label>
                        <span>&nbsp;&nbsp;</span>
                        {renderPageNumbers}
                    </ul>
                </Container>
            </div>
        );
    }
}

export default ClienteList