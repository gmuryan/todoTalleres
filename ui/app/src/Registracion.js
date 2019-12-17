import React, { Component } from 'react';
import {withRouter } from 'react-router-dom';
import {confirmAlert} from "react-confirm-alert";
import SignUp from "./SignUp";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";
import {Container} from "reactstrap";

class Registracion extends Component {


    emptyItem = {
        nombre: '',
        apellido: '',
        telefono: '',
        mail: '',
        password : '',
        repeatPassword: ''
    };


    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            errors: {},
            flag: false,
            formIsValid: true,
            mailCargado: '',
            openDialogExito: false
        };
        this.validateMailTaller = this.validateMailTaller.bind(this);
        this.validateMailCliente = this.validateMailCliente.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    handleClose(event) {
        this.setState({
            openDialogExito: false
        });
    }

    validateMailTaller() {
        let fields = this.state.item;
        console.log(this.state.item);
        return fetch(`/api/tallerByMail?mail=${encodeURIComponent(fields["mail"])}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    validateMailCliente(){
        let fields = this.state.item;
        console.log(this.state.item);
        return fetch(`/api/clienteByMail?mail=${encodeURIComponent(fields["mail"])}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    handleValidation(){
        let fields = this.state.item;
        let errors = {};
        this.setState({formIsValid: true});

        //Name
        if(!fields["nombre"]){
            this.setState({formIsValid: false});
            errors["nombre"] = "No puede estar vacío";
        }
        else if(typeof fields["nombre"] !== undefined){
            if(!fields["nombre"].match(/^[a-zA-Z]+$/)){
                this.setState({formIsValid: false});
                errors["nombre"] = "Solo letras";
            }
        }

        //Apellido
        if(!fields["apellido"]){
            this.setState({formIsValid: false});
            errors["apellido"] = "No puede estar vacío";
        }
        else if(typeof fields["apellido"] !== undefined){
            if(!fields["apellido"].match(/^[a-zA-Z]+$/)){
                this.setState({formIsValid: false});
                errors["apellido"] = "Solo letras";
            }
        }

        //Telefono
        if(!fields["telefono"]){
            this.setState({formIsValid: false});
            errors["telefono"] = "No puede estar vacío";
        }
        else if(typeof fields["telefono"] !== undefined){
            if(!fields["telefono"].match(/^[0-9]+$/)){
                this.setState({formIsValid: false});
                errors["telefono"] = "Solo números";
            }
        }

        //Contraseña
        if(!fields["password"]){
            this.setState({formIsValid: false});
            errors["password"] = "No puede estar vacío";
        }

        //RepetirContraseña
        if(!fields["repeatPassword"]){
            this.setState({formIsValid: false});
            errors["repeatPassword"] = "No puede estar vacío";
        }else if(fields["password"] !== fields["repeatPassword"]){
            this.setState({formIsValid: false});
            errors["repeatPassword"] = "Debe ser igual a la contraseña";
        }

        this.setState({errors: errors});

        //Email
        if (!fields["mail"]) {
            this.setState({formIsValid: false});
            errors["mail"] = "No puede estar vacío";
            this.setState({errors: errors});
        } else if (typeof fields["mail"] !== undefined) {
            let lastAtPos = fields["mail"].lastIndexOf('@');
            let lastDotPos = fields["mail"].lastIndexOf('.');
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["mail"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["mail"].length - lastDotPos) > 2)) {
                this.setState({formIsValid: false});
                errors["mail"] = "Mail inválido";
                this.setState({errors: errors});
            }
        }
        return this.validateMailTaller().then((response) => {
            if (response.ok && this.state.mailCargado !== fields["mail"]){
                console.log("aca");
                this.setState({formIsValid: false});
                errors["mail"] = "Este mail ya esta registrado";
                this.setState({errors: errors});
            }else{
                return this.validateMailCliente().then((response) => {
                    if (response.ok && this.state.mailCargado !== fields["mail"]){
                        this.setState({formIsValid: false});
                        errors["mail"] = "Este mail ya esta registrado";
                        this.setState({errors: errors});
                    }
                })
            }
        });


    }

    dialogCreado(){
        this.setState({openDialogExito: true});
    }


    async handleSubmit(event) {
        event.preventDefault();

        this.handleValidation().then((result) =>{
            if (this.state.formIsValid){
                const {item} = this.state;
                console.log(item);
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
        return(
            <div>
                <Dialog
                    open={this.state.openDialogExito}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Operación Exitosa"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Usuario creado correctamente.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.history.push('/')} color="primary">
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>
                <SignUp errores={this.state.errors} handleSubmit={this.handleSubmit} handleChange={this.handleChange.bind(this)}/>
            </div>
        );
    }
}

export default withRouter(Registracion);