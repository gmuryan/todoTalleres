import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {confirmAlert} from "react-confirm-alert";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

class ClienteEdit extends Component {


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
        const admin = JSON.parse(localStorage.getItem("adminUser"));
        if (admin === null) {
            localStorage.clear();
            this.props.history.push('/');
        }
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const cliente = await (await fetch(`/api/cliente/${this.props.match.params.id}`)).json();
            this.setState({mailCargado: cliente.mail});
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
                    onClick: () => this.props.history.push('/clientes')
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

        if (flag == false && item.idCliente) {
            item.repeatPassword = item.password;
            this.setState({flag: !this.state.flag});
        }


        return <div>
            <AppNavbar/>
            <Container>
                {this.props.match.params.id !== 'new' &&
                <Typography variant="h4">Editar Cliente</Typography>
                }
                {this.props.match.params.id === 'new' &&
                <Typography variant="h4">Crear Cliente</Typography>
                }
                <Form onSubmit={this.handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                id="outlined-basic"
                                // className={classes.textField}
                                label="Nombre"
                                margin="normal"
                                variant="outlined"
                                name="nombre"
                                id="nombre"
                                required
                                value={item.nombre || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["nombre"]}
                                helperText={this.state.errors["nombre"]}
                                autoComplete="nombre"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField id="outlined-basic"
                                // className={classes.textField}
                                       label="Apellido"
                                       margin="normal"
                                       variant="outlined"
                                       name="apellido"
                                       id="apellido"
                                       required
                                       value={item.apellido || ''}
                                       onChange={this.handleChange}
                                       error={this.state.errors["apellido"]}
                                       helperText={this.state.errors["apellido"]}
                                       autoComplete="apellido"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <TextField id="outlined-basic"
                                // className={classes.textField}
                                       label="Teléfono"
                                       margin="normal"
                                       variant="outlined"
                                       name="telefono"
                                       id="telefono"
                                       required
                                       value={item.telefono || ''}
                                       onChange={this.handleChange}
                                       error={this.state.errors["telefono"]}
                                       helperText={this.state.errors["telefono"]}
                                       autoComplete="telefono"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField id="outlined-basic"
                                // className={classes.textField}
                                       label="Mail"
                                       margin="normal"
                                       variant="outlined"
                                       name="mail"
                                       id="mail"
                                       required
                                       value={item.mail || ''}
                                       onChange={this.handleChange}
                                       error={this.state.errors["mail"]}
                                       helperText={this.state.errors["mail"]}
                                       autoComplete="mail"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <TextField id="outlined-basic"
                                // className={classes.textField}
                                       label="Contraseña"
                                       margin="normal"
                                       variant="outlined"
                                       name="password"
                                       id="password"
                                       type="password"
                                       required
                                       value={item.password || ''}
                                       onChange={this.handleChange}
                                       error={this.state.errors["password"]}
                                       helperText={this.state.errors["password"]}
                                       autoComplete="password"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField id="outlined-basic"
                                // className={classes.textField}
                                       label="Repetir Contraseña"
                                       margin="normal"
                                       variant="outlined"
                                       name="repeatPassword"
                                       id="repeatPassword"
                                       type="password"
                                       required
                                       value={item.repeatPassword || ''}
                                       onChange={this.handleChange}
                                       error={this.state.errors["repeatPassword"]}
                                       helperText={this.state.errors["repeatPassword"]}
                                       autoComplete="repeatPassword"
                            />
                        </Grid>
                    </Grid>
                    <br></br>
                    <FormGroup>
                        <Button variant="contained" color="primary" type="submit">
                            Guardar
                        </Button>
                        {' '}
                        <Link to='/clientes' style={{textDecoration: 'none'}}>
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

export default withRouter(ClienteEdit);