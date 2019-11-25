import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import TalleresNavbar from './TalleresNavbar';
import {confirmAlert} from "react-confirm-alert";
import Typography from "@material-ui/core/Typography";
import ReparacionesEnhancedTable from "./ReparacionesSortableTable";
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";


class MecanicoEdit extends Component {


    emptyItem = {
        nombre: '',
        apellido: '',
        telefono: '',
        mail: '',
        taller: ''
    };


    constructor(props) {
        super(props);
        const taller = JSON.parse(localStorage.getItem("tallerUser"));
        console.log(taller);
        if (taller===null) {
            localStorage.clear();
            this.props.history.push('/');
        }
        this.state = {
            item: this.emptyItem,
            errors: {},
            reparaciones: [],
            flag: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const mecanico = await (await fetch(`/api/mecanico/${this.props.match.params.id}`)).json();
            this.setState({item: mecanico});
            const reps = await (await fetch(`/api/reparacionesMecanico/${this.props.match.params.id}`)).json();
            this.setState({reparaciones: reps});
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

    handleValidation(){
        let fields = this.state.item;
        let errors = {};
        let formIsValid = true;

        //Name
        if(fields["nombre"].length === 0){
            formIsValid = false;
            errors["nombre"] = "No puede estar vacio";
        }
        else if(typeof fields["nombre"] !== "undefined"){
            if(!fields["nombre"].match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["nombre"] = "Solo letras";
            }
        }

        //Apellido
        if(fields["apellido"].length === 0){
            formIsValid = false;
            errors["apellido"] = "No puede estar vacio";
        }
        else if(typeof fields["apellido"] !== "undefined"){
            if(!fields["apellido"].match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["apellido"] = "Solo letras";
            }
        }

        //Telefono
        if(fields["telefono"].length === 0){
            formIsValid = false;
            errors["telefono"] = "No puede estar vacio";
        }
        else if(typeof fields["telefono"] !== "undefined"){
            if(!fields["telefono"].match(/^[0-9]+$/)){
                formIsValid = false;
                errors["telefono"] = "Solo numeros";
            }
        }

        //Email
        if(!fields["mail"]){
            formIsValid = false;
            errors["mail"] = "No puede estar vacio";
        }
        else if(typeof fields["mail"] !== "undefined"){
            let lastAtPos = fields["mail"].lastIndexOf('@');
            let lastDotPos = fields["mail"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["mail"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["mail"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["mail"] = "Mail invalido";
            }
        }

        this.setState({errors: errors});
        return formIsValid;
    }

    dialogCreado(){
        confirmAlert({
            title: 'Operacion Exitosa',
            buttons: [
                {
                    label: 'Aceptar'
                }
            ]
        })
    }


    async handleSubmit(event) {
        event.preventDefault();
        if (this.handleValidation()){
            const {item} = this.state;

            await fetch('/api/mecanico', {
                method: (item.idMecanico) ? 'PUT' : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            });
            this.props.history.push('/mecanicos');
            this.dialogCreado();
        }
    }

    render() {
        const {item, flag, reparaciones} = this.state;
        const title = <h2>{item.idMecanico ? 'Editar Mecanico' : 'Crear Mecanico'}</h2>;
        const tallerAux = JSON.parse(localStorage.getItem("tallerUser"));
        item.taller = JSON.stringify(tallerAux);

        return <div>
            <TalleresNavbar/>
            <Container>
                {this.props.match.params.id !== 'new' &&
                <Typography variant="h4">Editar Mecanico</Typography>
                }
                {this.props.match.params.id === 'new' &&
                <Typography variant="h4">Crear Mecanico</Typography>
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
                        <Grid item xs={12} sm={6}>
                            <TextField id="outlined-basic"
                                // className={classes.textField}
                                       label="Apellido"
                                       margin="normal"
                                       variant="outlined"
                                       name="apellido"
                                       id="apellido"
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
                                       id="telefono"
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
                                       id="mail"
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
                    {this.props.match.params.id !== 'new' &&
                    <Typography variant="h4">
                        Reparaciones Asignadas
                    </Typography>
                    }
                    {this.props.match.params.id !== 'new' &&
                    <ReparacionesEnhancedTable rows={reparaciones} tallerUser={tallerAux} dense={true}  acciones={false}/>
                    }
                    {this.props.match.params.id !== 'new' &&
                    <br></br>
                    }
                    {this.props.match.params.id !== 'new' &&
                    <br></br>
                    }
                    <FormGroup>
                        <Button variant="contained" color="primary" type="submit">
                            Guardar
                        </Button>{' '}
                        <Link to='/mecanicos' style={{ textDecoration: 'none' }}>
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

export default withRouter(MecanicoEdit);