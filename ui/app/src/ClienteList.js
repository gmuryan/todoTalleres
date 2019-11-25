import React, {Component} from 'react';
import {Container, Label, Table} from 'reactstrap';
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
import Button from '@material-ui/core/Button';
import MenuAppBar from "./AppBar";

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    margin-top: 350px;
`;

class ClienteList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clientes: [],
            isLoading: true,
            nombre: '',
            apellido: '',
            mail: ''
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
            title: 'Operación Exitosa',
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
            title: 'Operación Exitosa',
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
            message: '¿Esta seguro de realizar esta acción?',
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
            message: '¿Esta seguro de realizar esta acción?',
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
        const {clientes, isLoading, nombre, apellido, mail} = this.state;
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

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button type="button" variant="contained" color="primary" className={classes.button} onClick={() => this.props.history.push('/clientes/new')}>
                            Crear Cliente
                        </Button>
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
                    <ClientesEnhancedTable rows={filterClientes} habilitarCliente={this.dialogHabilitar} deshabilitarCliente={this.dialogDeshabilitar} editar={this.edit}/>
                </Container>
            </div>
        );
    }
}

export default (ClienteList);