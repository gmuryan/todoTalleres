import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {Link} from 'react-router-dom';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import './App.css';
import ClipLoader from 'react-spinners/ClipLoader';
import {withStyles} from '@material-ui/core/styles';
import {css} from '@emotion/core';
import TextField from "@material-ui/core/TextField";
import ClientesEnhancedTable from "./ClientesSortableTable";
import Typography from "@material-ui/core/Typography";

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    margin-top: 300px;
`;

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
            todosPerPage: 5
        };
        this.handleClick = this.handleClick.bind(this);
        this.dialogHabilitar = this.dialogHabilitar.bind(this);
        this.dialogDeshabilitar = this.dialogDeshabilitar.bind(this);
        this.edit = this.edit.bind(this);
        this.remove = this.remove.bind(this);
        const admin = JSON.parse(localStorage.getItem("adminUser"));
        if (admin === null) {
            localStorage.clear();
            this.props.history.push('/');
        }
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
        await fetch(`/api/borrarCliente/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            fetch('api/clientes')
                .then(response => response.json())
                .then(data => this.setState({clientes: data}))
            this.dialogEliminado();
        });
    }

    async habilitar(id) {
        await fetch(`/api/habilitarCliente/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            fetch('api/clientes')
                .then(response => response.json())
                .then(data => this.setState({clientes: data}))
            this.dialogHabilitado();
        });
    }

    dialogHabilitado() {
        confirmAlert({
            title: 'Operacion Exitosa',
            message: 'Cliente Habilitado',
            buttons: [
                {
                    label: 'Aceptar'
                }
            ]
        })
    }


    dialogEliminado() {
        confirmAlert({
            title: 'Operacion Exitosa',
            message: 'Cliente Deshabilitado',
            buttons: [
                {
                    label: 'Aceptar'
                }
            ]
        })
    }

    dialogDeshabilitar(cliente) {
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

    dialogHabilitar(cliente) {
        confirmAlert({
            title: 'Confirmar',
            message: 'Esta seguro de realizar esta accion?',
            buttons: [
                {
                    label: 'Si',
                    onClick: () => this.habilitar(cliente.idCliente)
                },
                {
                    label: 'No'
                }
            ]
        })
    };

    edit(idCliente){
        this.props.history.push('/clientes/' + idCliente);
    }

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
        const classes = {
            textField: {
                width: 200,
            },
        };


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
            return (
                <div className='sweet-loading'>
                    <ClipLoader
                        css={override}
                        sizeUnit={"px"}
                        size={35}
                        color={'#123abc'}
                        loading={this.state.isLoading}
                    />
                </div>
            )
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
                <td>{cliente.activo ? "Si" : "No"}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" /*tag={Link}
                                to={"/clientes/" + cliente.idCliente}*/ onClick={() => this.edit(cliente.idCliente)}>Editar</Button>
                        &nbsp;&nbsp;
                        {cliente.activo &&
                        <Button size="sm" color="danger"
                                onClick={() => this.dialogDeshabilitar(cliente)}>Deshabilitar</Button>
                        }
                        {!cliente.activo &&
                        <Button size="sm" color="success"
                                onClick={() => this.dialogHabilitar(cliente)}>Habilitar</Button>
                        }
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
                    <Typography variant="h4">
                        Clientes
                    </Typography>
                    <TextField
                        id="standard-basic"
                        className={classes.textField}
                        label="Nombre"
                        margin="normal"
                        onChange={this.filterNombre}
                    />
                    &nbsp;&nbsp;
                    &nbsp;&nbsp;
                    <TextField
                        id="standard-basic"
                        className={classes.textField}
                        label="Apellido"
                        margin="normal"
                        onChange={this.filterApellido}
                    />
                    &nbsp;&nbsp;
                    &nbsp;&nbsp;
                    <TextField
                        id="standard-basic"
                        className={classes.textField}
                        label="Mail"
                        margin="normal"
                        onChange={this.filterMail}
                    />
                    {/*<input type="text" onChange={this.filterNombre} placeholder="Nombre..."></input>*/}
                    {/*&nbsp;&nbsp;*/}
                    {/*<input type="text" onChange={this.filterApellido} placeholder="Apellido..."></input>*/}
                    {/*&nbsp;&nbsp;*/}
                    {/*<input type="text" onChange={this.filterMail} placeholder="Mail..."></input>*/}
                    <ClientesEnhancedTable rows={filterClientes} habilitarCliente={this.dialogHabilitar} deshabilitarCliente={this.dialogDeshabilitar} editar={this.edit}/>
                    {/*<Table className="mt-4">*/}
                    {/*    <thead>*/}
                    {/*    <tr>*/}
                    {/*        <th width="20%">ID</th>*/}
                    {/*        <th width="20%">Nombre</th>*/}
                    {/*        <th width="20%">Apellido</th>*/}
                    {/*        <th width="20%">Teléfono</th>*/}
                    {/*        <th width="20%">Mail</th>*/}
                    {/*        <th width="10%">Habilitado</th>*/}
                    {/*        <th width="10%">Acciones</th>*/}
                    {/*    </tr>*/}
                    {/*    </thead>*/}
                    {/*    <tbody>*/}
                    {/*    {clienteList}*/}
                    {/*    </tbody>*/}
                    {/*</Table>*/}
                    {/*<ul id="page-numbers">*/}
                    {/*    <Label>Paginas:</Label>*/}
                    {/*    <span>&nbsp;&nbsp;</span>*/}
                    {/*    {renderPageNumbers}*/}
                    {/*</ul>*/}
                </Container>
            </div>
        );
    }
}

export default (ClienteList);