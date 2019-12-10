import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Container, Form, FormGroup} from 'reactstrap';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import "react-datepicker/dist/react-datepicker.css";
import ClientesNavbar from "./ClientesNavbar";
import TalleresNavbar from "./TalleresNavbar";
import Comment from "./Comment";
import AppNavbar from "./AppNavbar";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

class ReseñaScreen extends Component {


    emptyTaller = {
        nombre: '',
        barrio: '',
        telefono: '',
        mail: '',
        ubicacion: '',
        marca: '',
        clasificacion: '',
        descripcionTaller: ''
    };

    emptyItem = {
        cliente: '',
        taller: '',
        comentario: '',
        fechaReseña: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            reseñas: [],
            taller: this.emptyTaller,
            errors: {},
            formIsValid: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
        const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
        const adminUser = JSON.parse(localStorage.getItem("adminUser"));
        if (clienteUser !== null || tallerUser !== null || adminUser !== null) {
            const res = await (await fetch(`/api/reseñas/${this.props.match.params.id}`)).json();
            this.setState({reseñas: res});
            if (clienteUser !== null) {
                const taller = await (await fetch(`/api/taller/${this.props.match.params.id}`)).json();
                this.setState({taller: taller});
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

    handleValidation() {
        let fields = this.state.item;
        let errors = {};
        let formIsValid = true;

        if (fields["comentario"] === null || fields["comentario"] === '') {
            formIsValid = false;
            errors["comentario"] = "No puede estar vacío";
        }

        this.setState({errors: errors});
        return formIsValid;
    }

    dialogCreado() {
        confirmAlert({
            title: 'Operación Exitosa',
            buttons: [
                {
                    label: 'Aceptar'
                }
            ]
        })
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (this.handleValidation()) {
            const {item} = this.state;
            console.log(item);

            await fetch('/api/reseña', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            });
            this.dialogCreado();
            const reseñasList = await (await fetch(`/api/reseñas/${this.props.match.params.id}`)).json();
            this.setState({reseñas: reseñasList});
            // this.setState(prevState => ({
            //     reseñas : [...prevState.reseñas, this.state.item]
            // }))
            this.setState({item: this.emptyItem});
            // this.forceUpdate();
        }
    }

    render() {
        const {item, reseñas, taller} = this.state;
        const title = <Typography variant="h4">
            Reseñas
        </Typography>;
        const tallerAux = JSON.parse(localStorage.getItem("tallerUser"));
        const clienteAux = JSON.parse(localStorage.getItem("clienteUser"));
        const adminAux = JSON.parse(localStorage.getItem("adminUser"));
        if (clienteAux !== null) {
            item.cliente = JSON.stringify(clienteAux);
            item.taller = taller;
        }
        const reseñasList = reseñas.map(reseña => {
            return (
                <Comment idReseña={reseña.idReseña} fecha={reseña.fechaReseña} nombre={reseña.cliente.nombre}
                         apellido={reseña.cliente.apellido}
                         comentario={reseña.comentario} adminAux={adminAux}/>
            );
        });
        return (
            <div>
                {tallerAux !== null &&
                <TalleresNavbar/>
                }
                {clienteAux !== null &&
                <ClientesNavbar/>
                }
                {adminAux !== null &&
                <AppNavbar/>
                }
                <Container>
                    {clienteAux !== null &&
                    <Typography variant="h4">Información del Taller</Typography>
                    }
                    <Form>
                        {clienteAux !== null &&
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
                                    style={{
                                        backgroundColor: "#e9ecef"
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={taller.nombre || ''}
                                    onChange={this.handleChange}
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
                                    fullWidth
                                    style={{
                                        backgroundColor: "#e9ecef"
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={taller.barrio || ''}
                                    onChange={this.handleChange}
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
                                    fullWidth
                                    style={{
                                        backgroundColor: "#e9ecef"
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={taller.telefono || ''}
                                    onChange={this.handleChange}
                                    autoComplete="barrio"
                                />
                            </Grid>
                        </Grid>
                        }
                        {clienteAux !== null &&
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="outlined-basic"
                                    // className={classes.textField}
                                    label="Mail"
                                    margin="normal"
                                    variant="outlined"
                                    name="mail"
                                    fullWidth
                                    style={{
                                        backgroundColor: "#e9ecef"
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={taller.mail || ''}
                                    onChange={this.handleChange}
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
                                    fullWidth
                                    style={{
                                        backgroundColor: "#e9ecef"
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={taller.ubicacion || ''}
                                    onChange={this.handleChange}
                                    autoComplete="mail"
                                />
                            </Grid>
                        </Grid>
                        }
                        {clienteAux !== null &&
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    id="outlined-basic"
                                    // className={classes.textField}
                                    label="Breve Descripción del Taller"
                                    margin="normal"
                                    variant="outlined"
                                    name="descripcionTaller"
                                    fullWidth
                                    style={{
                                        backgroundColor: "#e9ecef"
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={taller.descripcionTaller || ''}
                                    onChange={this.handleChange}
                                    autoComplete="descripcionTaller"
                                />
                            </Grid>
                        </Grid>
                        }
                        {clienteAux !== null &&
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="outlined-basic"
                                    // className={classes.textField}
                                    label="Marca"
                                    margin="normal"
                                    variant="outlined"
                                    name="marca"
                                    fullWidth
                                    style={{
                                        backgroundColor: "#e9ecef"
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={taller.marca.descripcion || ''}
                                    onChange={this.handleChange}
                                    autoComplete="marca"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    id="outlined-basic"
                                    // className={classes.textField}
                                    label="Especialización"
                                    margin="normal"
                                    variant="outlined"
                                    name="clasificacion"
                                    fullWidth
                                    style={{
                                        backgroundColor: "#e9ecef"
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={taller.clasificacion.descripcion || ''}
                                    onChange={this.handleChange}
                                    autoComplete="clasificacion"
                                />
                            </Grid>
                        </Grid>
                        }
                    </Form>
                    <br></br>
                    {title}
                    {reseñasList}
                    {reseñasList.length === 0 &&
                    <Typography variant="h6">
                        No hay reseñas disponibles
                    </Typography>
                    }
                    <Form onSubmit={this.handleSubmit}>
                        {clienteAux !== null &&
                        <TextField
                            id="comentario"
                            name="comentario"
                            autoComplete="comentario"
                            multiline
                            fullWidth
                            error={this.state.errors["comentario"]}
                            helperText={this.state.errors["comentario"]}
                            rows="4"
                            value={item.comentario || ''}
                            margin="normal"
                            variant="outlined"
                            placeholder="Deje su comentario aquí..."
                            onChange={this.handleChange}
                            />
                        }
                        <FormGroup>
                            {clienteAux !== null &&
                            <Button variant="contained" color="primary" type="submit">
                                Publicar
                            </Button>
                            }
                            {clienteAux !== null &&
                            ' '
                            }
                            {clienteAux !== null &&
                            <Link to='/talleres' style={{ textDecoration: 'none' }}>
                                <Button variant="contained" color="secondary">
                                    Cancelar
                                </Button>
                            </Link>
                            }
                            {adminAux !== null &&
                            <br></br>
                            }
                            {(tallerAux !== null || adminAux !== null) &&
                            <Link to={tallerAux !== null ? "/homeTaller" : "/talleres"} style={{ textDecoration: 'none' }}>
                                <Button variant="contained" color="primary">
                                    Volver
                                </Button>
                            </Link>
                            }
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        )
            ;
    }
}

export default withRouter(ReseñaScreen);