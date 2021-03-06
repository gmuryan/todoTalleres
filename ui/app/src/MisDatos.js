import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Container, Form, FormGroup} from 'reactstrap';
import ClientesNavbar from './ClientesNavbar';
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

class MisDatos extends Component {


    emptyItem = {
        nombre: '',
        apellido: '',
        telefono: '',
        mail: ''
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
            mailCargado: '',
            showPassword: false,
            openDialogExito: false
        };
        this.validateMailTaller = this.validateMailTaller.bind(this);
        this.validateMailCliente = this.validateMailCliente.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleMouseDownPassword = this.handleMouseDownPassword.bind(this);
        this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
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

    handleClose(event) {
        this.setState({
            openDialogExito: false
        });
    }

    handleMouseDownPassword(event){
        event.preventDefault();
    }

    handleClickShowPassword(event){
        this.setState({showPassword: !this.state.showPassword});
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
            errors["nombre"] = "No puede estar vacío";
        } else if (typeof fields["nombre"] !== undefined) {
            if (!fields["nombre"].match(/^[a-zA-Z]+$/)) {
                this.setState({formIsValid: false});
                errors["nombre"] = "Solo letras";
            }
        }

        //Apellido
        if (fields["apellido"].length === 0) {
            this.setState({formIsValid: false});
            errors["apellido"] = "No puede estar vacío";
        } else if (typeof fields["apellido"] !== undefined) {
            if (!fields["apellido"].match(/^[a-zA-Z]+$/)) {
                this.setState({formIsValid: false});
                errors["apellido"] = "Solo letras";
            }
        }

        //Telefono
        if (fields["telefono"].length === 0) {
            this.setState({formIsValid: false});
            errors["telefono"] = "No puede estar vacío";
        } else if (typeof fields["telefono"] !== undefined) {
            if (!fields["telefono"].match(/^[0-9]+$/)) {
                this.setState({formIsValid: false});
                errors["telefono"] = "Solo números";
            }
        }

        //Contraseña
        if (!fields["password"]) {
            this.setState({formIsValid: false});
            errors["password"] = "No puede estar vacío";
        }

        //RepetirContraseña
        if (!fields["repeatPassword"]) {
            this.setState({formIsValid: false});
            errors["repeatPassword"] = "No puede estar vacío";
        } else if (fields["password"] !== fields["repeatPassword"]) {
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
        this.setState({openDialogExito: true});
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
        const title = <Typography variant="h4">
            Editar Cliente
        </Typography>;

        if (flag === false && item.idCliente) {
            item.repeatPassword = item.password;
            this.setState({flag: !this.state.flag});
        }


        return <div>
            <ClientesNavbar/>
            <Container>
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
                                Cambios guardados correctamente.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.props.history.push('/homeCliente')} color="primary">
                                Aceptar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                {title}
                <Form onSubmit={this.handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                // className={classes.textField}
                                label="Nombre"
                                margin="normal"
                                variant="outlined"
                                name="nombre"
                                fullWidth
                                required
                                value={item.nombre || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["nombre"]}
                                helperText={this.state.errors["nombre"]}
                                autoComplete="nombre"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id="outlined-basic"
                                // className={classes.textField}
                                       label="Apellido"
                                       margin="normal"
                                       variant="outlined"
                                       name="apellido"
                                       required
                                       fullWidth
                                       value={item.apellido || ''}
                                       onChange={this.handleChange}
                                       error={this.state.errors["apellido"]}
                                       helperText={this.state.errors["apellido"]}
                                       autoComplete="apellido"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField id="outlined-basic"
                                // className={classes.textField}
                                       label="Teléfono"
                                       margin="normal"
                                       variant="outlined"
                                       name="telefono"
                                       required
                                       fullWidth
                                       value={item.telefono || ''}
                                       onChange={this.handleChange}
                                       error={this.state.errors["telefono"]}
                                       helperText={this.state.errors["telefono"]}
                                       autoComplete="telefono"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField id="outlined-basic"
                                // className={classes.textField}
                                       label="Mail"
                                       margin="normal"
                                       variant="outlined"
                                       name="mail"
                                       required
                                       fullWidth
                                       value={item.mail || ''}
                                       onChange={this.handleChange}
                                       error={this.state.errors["mail"]}
                                       helperText={this.state.errors["mail"]}
                                       autoComplete="mail"
                            />
                        </Grid>
                    </Grid>
                    <br></br>
                    <FormGroup>
                        <Button variant="contained" color="primary" type="submit">
                            Guardar
                        </Button>{' '}
                        <Link to='/homeCliente' style={{ textDecoration: 'none' }}>
                            <Button variant="contained" color="secondary">
                                Cancelar
                            </Button>
                        </Link>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(MisDatos);