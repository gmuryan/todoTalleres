import React, {Component} from 'react';
import {Container} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';
import ClipLoader from 'react-spinners/ClipLoader';
import {css} from '@emotion/core';
import TextField from "@material-ui/core/TextField";
import ClientesEnhancedTable from "./ClientesSortableTable";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
            mail: '',
            activeId: '',
            openDialogHabilitadoExito: false,
            openDialogDeshabilitadoExito: false,
            openDialogHabilitar: false,
            openDialogDeshabilitar: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.dialogHabilitar = this.dialogHabilitar.bind(this);
        this.dialogDeshabilitar = this.dialogDeshabilitar.bind(this);
        this.dialogEliminado = this.dialogEliminado.bind(this);
        this.dialogHabilitado = this.dialogHabilitado.bind(this);
        this.handleClose = this.handleClose.bind(this);
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

    handleClose(event) {
        this.setState({
            openDialogHabilitadoExito: false,
            openDialogDeshabilitadoExito: false,
            openDialogDeshabilitar: false,
            openDialogHabilitar: false
        });
    }

    dialogHabilitado() {
        this.setState({openDialogHabilitar: false, openDialogHabilitadoExito: true});
    }


    dialogEliminado() {
        this.setState({openDialogDeshabilitar: false, openDialogDeshabilitadoExito: true});
    }

    dialogDeshabilitar = (cliente) => {
        this.setState({openDialogDeshabilitar: true, activeId: cliente.idCliente});
    }

    dialogHabilitar(cliente) {
        this.setState({openDialogHabilitar: true, activeId: cliente.idCliente});
    };

    edit(idCliente) {
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
        const {isLoading, nombre, apellido, mail} = this.state;
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
                    <div>
                        <Dialog
                            open={this.state.openDialogHabilitadoExito}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Operación Exitosa"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Cliente habilitado correctamente.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">
                                    Aceptar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div>
                        <Dialog
                            open={this.state.openDialogDeshabilitadoExito}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Operación Exitosa"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Cliente deshabilitado correctamente.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">
                                    Aceptar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div>
                        <Dialog
                            open={this.state.openDialogDeshabilitar}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Confirmar"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    ¿Esta seguro de realizar esta acción?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => this.remove(this.state.activeId)} color="primary">
                                    Si
                                </Button>
                                <Button onClick={this.handleClose} color="primary">
                                    No
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div>
                        <Dialog
                            open={this.state.openDialogHabilitar}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Confirmar"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    ¿Esta seguro de realizar esta acción?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => this.habilitar(this.state.activeId)} color="primary">
                                    Si
                                </Button>
                                <Button onClick={this.handleClose} color="primary">
                                    No
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div className="float-right">
                        <Button type="button" variant="contained" color="primary" className={classes.button}
                                onClick={() => this.props.history.push('/clientes/new')}>
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
                    <ClientesEnhancedTable rows={filterClientes} habilitarCliente={this.dialogHabilitar}
                                           deshabilitarCliente={this.dialogDeshabilitar} editar={this.edit}/>
                </Container>
            </div>
        );
    }
}

export default (ClienteList);