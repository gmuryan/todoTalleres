import React, { Component } from 'react';
import './App.css';
import ClientesNavbar from './ClientesNavbar';
import {withRouter} from 'react-router-dom';
import {Container } from 'reactstrap';
import Logo from "./logo.png";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

class HomeCliente extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nuevosPresupuestos: [],
            cancelacionesRecientes: [],
            openDialogExito: false,
            openDialogCancelaciones: false,
            stringFinal: '',
            stringFinalCancelaciones: ''
        };
        this.handleClose = this.handleClose.bind(this);
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (cliente === null){
            localStorage.clear();
            this.props.history.push('/');
        }
    }

    async componentDidMount() {
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (cliente !== null) {
            const nuevosPresups = await (await fetch(`/api/nuevoPresupuesto/${cliente.idCliente}`)).json();
            this.setState({nuevosPresupuestos: nuevosPresups});
            if (this.state.nuevosPresupuestos.length > 0){
                var nros = this.state.nuevosPresupuestos[0];
                for (const [index, value] of this.state.nuevosPresupuestos.entries()) {
                    if (index !== 0){
                        nros = nros + ", " + value;
                    }
                }
                this.setState({stringFinal: nros});
                this.dialogNuevoPresupuesto();
            }
            const cancRecientes = await (await fetch(`/api/cancelacionesRecientesCliente/${cliente.idCliente}`)).json();
            this.setState({cancelacionesRecientes: cancRecientes});
            if (this.state.cancelacionesRecientes.length > 0){
                var idsCancelaciones = this.state.cancelacionesRecientes[0];
                for (const [index, value] of this.state.cancelacionesRecientes.entries()){
                    if (index !== 0){
                        idsCancelaciones = idsCancelaciones + ", " + value;
                    }
                }
                this.setState({stringFinalCancelaciones: idsCancelaciones});
                this.dialogCancelacionesRecientes();
            }
        }
    }

    handleClose(event) {
        this.setState({
            openDialogExito: false,
            openDialogCancelaciones: false,
        });
    }

    async updateNuevoPresupuesto(value){
        this.handleClose();
        await fetch(`/api/updateNuevoPresupuesto/${value}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }

    async updateCancelacionesRecientes(value){
        this.handleClose();
        await fetch(`/api/updateCancelacionesRecientes/${value}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    }

    dialogNuevoPresupuesto(){
        this.setState({openDialogExito: true});
    }

    dialogCancelacionesRecientes(){
        this.setState({openDialogCancelaciones: true});
    }

    render() {
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        return (
            <div>
                <ClientesNavbar/>
                <Container fluid style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div>
                        <Dialog
                            open={this.state.openDialogExito}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Nuevo Presupuesto"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Hay nuevos presupuestos en la reparaciones con ID: {this.state.stringFinal}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => this.updateNuevoPresupuesto(cliente.idCliente)} color="primary">
                                    Aceptar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div>
                        <Dialog
                            open={this.state.openDialogCancelaciones}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Cancelaciones Recientes"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Las reparaciones con las siguientes IDs fueron canceladas recientemente: {this.state.stringFinalCancelaciones}. Ingrese a la reparación para conocer los motivos.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => this.updateCancelacionesRecientes(cliente.idCliente)} color="primary">
                                    Aceptar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div className="div-logo">
                        <img src={Logo} alt="logo"/>
                    </div>
                    <Typography variant="h4" align="center">¡Bienvenido a TodoTalleres!</Typography>
                </Container>
            </div>
        );
    }
}

export default withRouter (HomeCliente);