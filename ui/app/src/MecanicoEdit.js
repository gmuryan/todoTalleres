import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {Container, Form, FormGroup} from 'reactstrap';
import TalleresNavbar from './TalleresNavbar';
import Typography from "@material-ui/core/Typography";
import ReparacionesEnhancedTable from "./ReparacionesSortableTable";
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";


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
            flag: false,
            openDialogExito: false
        };
        this.handleClose = this.handleClose.bind(this);
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

    handleClose(event) {
        this.setState({
            openDialogExito: false
        });
    }

    handleValidation(){
        let fields = this.state.item;
        let errors = {};
        let formIsValid = true;

        //Name
        if(fields["nombre"].length === 0){
            formIsValid = false;
            errors["nombre"] = "No puede estar vacío";
        }
        else if(typeof fields["nombre"] !== undefined){
            if(!fields["nombre"].match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["nombre"] = "Solo letras";
            }
        }

        //Apellido
        if(fields["apellido"].length === 0){
            formIsValid = false;
            errors["apellido"] = "No puede estar vacío";
        }
        else if(typeof fields["apellido"] !== undefined){
            if(!fields["apellido"].match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["apellido"] = "Solo letras";
            }
        }

        //Telefono
        if(fields["telefono"].length === 0){
            formIsValid = false;
            errors["telefono"] = "No puede estar vacío";
        }
        else if(typeof fields["telefono"] !== undefined){
            if(!fields["telefono"].match(/^[0-9]+$/)){
                formIsValid = false;
                errors["telefono"] = "Solo numeros";
            }
        }

        //Email
        if(!fields["mail"]){
            formIsValid = false;
            errors["mail"] = "No puede estar vacío";
        }
        else if(typeof fields["mail"] !== undefined){
            let lastAtPos = fields["mail"].lastIndexOf('@');
            let lastDotPos = fields["mail"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["mail"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["mail"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["mail"] = "Mail inválido";
            }
        }

        this.setState({errors: errors});
        return formIsValid;
    }

    dialogCreado(){
        this.setState({openDialogExito: true});
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
            this.dialogCreado();
        }
    }

    render() {
        const {item, reparaciones} = this.state;
        const tallerAux = JSON.parse(localStorage.getItem("tallerUser"));
        item.taller = JSON.stringify(tallerAux);

        return <div>
            <TalleresNavbar/>
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
                            <Button onClick={() => this.props.history.push('/mecanicos')} color="primary">
                                Aceptar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                {this.props.match.params.id !== 'new' &&
                <Typography variant="h4">Editar Mecánico</Typography>
                }
                {this.props.match.params.id === 'new' &&
                <Typography variant="h4">Crear Mecánico</Typography>
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
                    {this.props.match.params.id !== 'new' &&
                    <Typography variant="h4">
                        Reparaciones Asignadas
                    </Typography>
                    }
                    {this.props.match.params.id !== 'new' &&
                    <ReparacionesEnhancedTable rows={reparaciones} tallerUser={tallerAux} dense={true}  acciones={false}/>
                    }
                    <br></br>
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