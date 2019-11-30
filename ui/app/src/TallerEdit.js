import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'
import Typography from "@material-ui/core/Typography"; // Import css
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

class TallerEdit extends Component {


    emptyItem = {
        nombre: '',
        barrio: '',
        telefono: '',
        mail: '',
        ubicacion: '',
        marca: '',
        clasificacion: '',
        maximosVehiculos: '',
        retrasosContemplados: '',
        password: '',
        descripcionTaller: '',
        repeatPassword: ''
    };


    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            errors: {},
            marcas: [],
            clasificaciones: [],
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
            const taller = await (await fetch(`/api/taller/${this.props.match.params.id}`)).json();
            this.setState({mailCargado: taller.mail});
            const mrcs = await (await fetch(`/api/marcas`)).json();
            const clasifs = await (await fetch(`/api/clasificaciones`)).json();
            this.setState({item: taller, marcas: mrcs, clasificaciones: clasifs});
        } else {
            const mrcs = await (await fetch(`/api/marcas`)).json();
            const clasifs = await (await fetch(`/api/clasificaciones`)).json();
            this.setState({marcas: mrcs, clasificaciones: clasifs});
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
        }

        //Barrio
        if (fields["barrio"].length === 0) {
            this.setState({formIsValid: false});
            errors["barrio"] = "No puede estar vacio";
        } else if (typeof fields["barrio"] !== "undefined") {
            if (!fields["barrio"].match(/^[a-zA-Z ]+$/)) {
                this.setState({formIsValid: false});
                errors["barrio"] = "Solo letras";
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

        //Ubicacion
        if (!fields["ubicacion"]) {
            this.setState({formIsValid: false});
            errors["ubicacion"] = "No puede estar vacio";
        }

        //MaximosVehiculos
        if (fields["maximosVehiculos"].length === 0) {
            this.setState({formIsValid: false});
            errors["maximosVehiculos"] = "No puede estar vacio";
        } else if (typeof fields["maximosVehiculos"] !== "undefined") {
            if (!fields["maximosVehiculos"].toString().match(/^[0-9]+$/)) {
                this.setState({formIsValid: false});
                errors["maximosVehiculos"] = "Solo numeros";
            } else if (parseFloat(fields["retrasosContemplados"]) > parseFloat(fields["maximosVehiculos"])) {
                this.setState({formIsValid: false});
                errors["maximosVehiculos"] = "La cantidad de vehiculos debe ser mayor a los retrasos contemplados"
            }
        }


        //RetrasosContemplados
        if (fields["retrasosContemplados"].length === 0) {
            this.setState({formIsValid: false});
            errors["retrasosContemplados"] = "No puede estar vacio";
        } else if (typeof fields["retrasosContemplados"] !== "undefined") {
            if (!fields["retrasosContemplados"].toString().match(/^[0-9]+$/)) {
                this.setState({formIsValid: false});
                errors["retrasosContemplados"] = "Solo numeros";
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

        //Marca
        if (!fields["marca"]){
            this.setState({formIsValid: false});
            errors["marca"] = "No puede estar vacio";
        }

        //Clasificacion
        if (!fields["clasificacion"]){
            this.setState({formIsValid: false});
            errors["clasificacion"] = "No puede estar vacio";
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
                    onClick: () => this.props.history.push('/talleres')
                }
            ]
        })
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.handleValidation().then((result) => {
            if (this.state.formIsValid) {
                const {item} = this.state;

                fetch('/api/taller', {
                    method: (item.idTaller) ? 'PUT' : 'POST',
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
        const {item, marcas, clasificaciones, flag} = this.state;

        const classes = {
            formControl: {
                width: 1000,
            },
            selectEmpty: {
                marginTop: 100,
            },
        };

        if (flag == false && item.idTaller) {
            console.log(item);
            item.repeatPassword = item.password;
            this.setState({flag: !this.state.flag});
        }

        let optionItemsMarcas = marcas.map((marca) =>
            <option key={marca.idMarca} selected={item.marca.idMarca == marca.idMarca}
                    value={JSON.stringify(marca)}>{marca.descripcion}</option>
        );
        let newOptionsMarcas = marcas.map((marca) =>
            <option key={marca.idMarca} value={JSON.stringify(marca)}>{marca.descripcion}</option>
        );
        let optionItemsClasifs = clasificaciones.map((clasif) =>
            <option key={clasif.idClasificacion} selected={item.clasificacion.idClasificacion == clasif.idClasificacion}
                    value={JSON.stringify(clasif)}>{clasif.descripcion}</option>
        );
        let newOptionsClasifs = clasificaciones.map((clasif) =>
            <option key={clasif.idClasificacion} value={JSON.stringify(clasif)}>{clasif.descripcion}</option>
        );

        return <div>
            <AppNavbar/>
            <Container>
                {this.props.match.params.id !== 'new' &&
                <Typography variant="h4">Editar Taller</Typography>
                }
                {this.props.match.params.id === 'new' &&
                <Typography variant="h4">Crear Taller</Typography>
                }
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
                                id="nombre"
                                fullWidth
                                required
                                value={item.nombre || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["nombre"]}
                                helperText={this.state.errors["nombre"]}
                                autoComplete="nombre"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                id="outlined-basic"
                                // className={classes.textField}
                                label="Barrio"
                                margin="normal"
                                variant="outlined"
                                name="barrio"
                                id="barrio"
                                fullWidth
                                required
                                value={item.barrio || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["barrio"]}
                                helperText={this.state.errors["barrio"]}
                                autoComplete="barrio"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                id="outlined-basic"
                                // className={classes.textField}
                                label="Teléfono"
                                margin="normal"
                                variant="outlined"
                                name="telefono"
                                id="telefono"
                                fullWidth
                                required
                                value={item.telefono || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["telefono"]}
                                helperText={this.state.errors["telefono"]}
                                autoComplete="barrio"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                // className={classes.textField}
                                label="Mail"
                                margin="normal"
                                variant="outlined"
                                name="mail"
                                id="mail"
                                fullWidth
                                required
                                value={item.mail || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["mail"]}
                                helperText={this.state.errors["mail"]}
                                autoComplete="mail"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                // className={classes.textField}
                                label="Ubicación"
                                margin="normal"
                                variant="outlined"
                                name="ubicacion"
                                id="ubicacion"
                                fullWidth
                                required
                                value={item.ubicacion || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["ubicacion"]}
                                helperText={this.state.errors["ubicacion"]}
                                autoComplete="mail"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                id="outlined-basic"
                                // className={classes.textField}
                                label="Breve Descripción del Taller"
                                margin="normal"
                                variant="outlined"
                                name="descripcionTaller"
                                id="descripcionTaller"
                                fullWidth
                                value={item.descripcionTaller || ''}
                                onChange={this.handleChange}
                                autoComplete="descripcionTaller"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                // className={classes.textField}
                                label="Contraseña"
                                margin="normal"
                                variant="outlined"
                                name="password"
                                id="password"
                                type="password"
                                fullWidth
                                required
                                value={item.password || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["password"]}
                                helperText={this.state.errors["password"]}
                                autoComplete="password"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                // className={classes.textField}
                                label="Repetir Contraseña"
                                margin="normal"
                                variant="outlined"
                                name="repeatPassword"
                                id="repeatPassword"
                                type="password"
                                fullWidth
                                required
                                value={item.repeatPassword || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["repeatPassword"]}
                                helperText={this.state.errors["repeatPassword"]}
                                autoComplete="repeatPassword"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" required className={classes.formControl} error={this.state.errors["marca"]}>
                                <InputLabel id="demo-simple-select-outlined-label">
                                    Marca
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="marca"
                                    name="marca"
                                    value={item.marca}
                                    onChange={this.handleChange}
                                    className="select-material-ui"
                                >
                                    {marcas.map(marca => (
                                        <MenuItem key={marca.idMarca} value={JSON.stringify(marca)}>
                                            {marca.descripcion}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {this.state.errors["marca"] && <FormHelperText>{this.state.errors["marca"]}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" required className={classes.formControl} error={this.state.errors["clasificacion"]}>
                                <InputLabel id="demo-simple-select-outlined-label">
                                    Especialización
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="clasificacion"
                                    name="clasificacion"
                                    value={item.clasificacion}
                                    onChange={this.handleChange}
                                    className="select-material-ui"
                                >
                                    {clasificaciones.map(clasificacion => (
                                        <MenuItem key={clasificacion.idClasificacion} value={JSON.stringify(clasificacion)}>
                                            {clasificacion.descripcion}
                                        </MenuItem>
                                    ))}
                                </Select>
                            {this.state.errors["clasificacion"] && <FormHelperText>{this.state.errors["clasificacion"]}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    </Grid>
                    {item.idTaller && (
                        <FormGroup>
                            <Label for="marca">Marca</Label>
                            <br></br>
                            <div>
                                <select required="required" className="select" name="marca" id="marca"
                                        onChange={this.handleChange} autoComplete="marca">
                                    {optionItemsMarcas}
                                </select>
                            </div>
                            &nbsp;&nbsp;
                        </FormGroup>
                    )}
                    {item.idTaller == null && (
                        <FormGroup>
                            <br></br>
                            <div>
                                <select required="required" className="select" name="marca" id="marca"
                                        onChange={this.handleChange} autoComplete="marca">
                                    <option value="" default>Seleccionar Marca...</option>
                                    {newOptionsMarcas}
                                </select>
                            </div>
                            &nbsp;&nbsp;
                        </FormGroup>
                    )}
                    {item.idTaller && (
                        <FormGroup>
                            <Label for="clasificacion">Especialización</Label>
                            <br></br>
                            <div>
                                <select required="required" className="select" name="clasificacion" id="clasificacion"
                                        onChange={this.handleChange} autoComplete="clasificacion">
                                    {optionItemsClasifs}
                                </select>
                            </div>
                        </FormGroup>
                    )}
                    {item.idTaller == null && (
                        <FormGroup>
                            <div>
                                <select required="required" className="select" name="clasificacion" id="clasificacion"
                                        onChange={this.handleChange} autoComplete="clasificacion">
                                    <option value="" default>Seleccionar Especialización...</option>
                                    {newOptionsClasifs}
                                </select>
                            </div>
                        </FormGroup>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                // className={classes.textField}
                                label="Capacidad Maxima de Vehículos"
                                margin="normal"
                                variant="outlined"
                                name="maximosVehiculos"
                                id="maximosVehiculos"
                                fullWidth
                                required
                                value={item.maximosVehiculos || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["maximosVehiculos"]}
                                helperText={this.state.errors["maximosVehiculos"]}
                                autoComplete="maximosVehiculos"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                // className={classes.textField}
                                label="Espacios Reservados por Precaución"
                                margin="normal"
                                variant="outlined"
                                name="retrasosContemplados"
                                id="retrasosContemplados"
                                fullWidth
                                required
                                value={item.retrasosContemplados || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["retrasosContemplados"]}
                                helperText={this.state.errors["retrasosContemplados"]}
                                autoComplete="retrasosContemplados"
                            />
                        </Grid>
                    </Grid>
                    <br></br>
                    <FormGroup>
                        <Button variant="contained" color="primary" type="submit">
                            Guardar
                        </Button>
                        {' '}
                        <Link to='/talleres' style={{textDecoration: 'none'}}>
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

export default withRouter(TallerEdit);