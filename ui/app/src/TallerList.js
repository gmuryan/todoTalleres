import React, {Component} from 'react';
import {Container} from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';
import ClientesNavbar from "./ClientesNavbar";
import ClipLoader from 'react-spinners/ClipLoader';
import {css} from "@emotion/core";
import TextField from "@material-ui/core/TextField";
import TalleresEnhancedTable from "./TalleresSortableTable";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    margin-top: 350px;
`;

class TallerList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            talleres: [],
            errors: {},
            isLoading: true,
            nombre: '',
            barrio: '',
            clasificacion: '',
            marca: '',
            activeId: '',
            newPassword: '',
            newPasswordRepeat: '',
            openDialogHabilitadoExito: false,
            openDialogDeshabilitadoExito: false,
            openDialogHabilitar: false,
            openDialogDeshabilitar: false,
            openDialogCambiarPw: false,
            openDialogExito: false,
            showPassword: false,
            showRepeatPassword: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.dialogHabilitar = this.dialogHabilitar.bind(this);
        this.dialogDeshabilitar = this.dialogDeshabilitar.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.edit = this.edit.bind(this);
        this.reviews = this.reviews.bind(this);
        this.remove = this.remove.bind(this);
        this.book = this.book.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.cambiarPassword = this.cambiarPassword.bind(this);
        this.cleanPassword = this.cleanPassword.bind(this);
        this.dialogCreado = this.dialogCreado.bind(this);
        this.handleMouseDownPassword = this.handleMouseDownPassword.bind(this);
        this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
        this.handleClickShowRepeatPassword = this.handleClickShowRepeatPassword.bind(this);
        const admin = JSON.parse(localStorage.getItem("adminUser"));
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (admin === null && cliente === null) {
            localStorage.clear();
            this.props.history.push('/');
        }
    }

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    handleClose(event) {
        this.setState({
            openDialogHabilitadoExito: false,
            openDialogDeshabilitadoExito: false,
            openDialogDeshabilitar: false,
            openDialogHabilitar: false,
            openDialogCambiarPw: false,
            openDialogExito: false
        });
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch('api/talleres')
            .then(response => response.json())
            .then(data => this.setState({talleres: data, isLoading: false}))

    }

    handleMouseDownPassword(event){
        event.preventDefault();
    }

    handleClickShowPassword(event){
        this.setState({showPassword: !this.state.showPassword});
    }

    handleClickShowRepeatPassword(event){
        this.setState({showRepeatPassword: !this.state.showRepeatPassword});
    }

    async remove(id) {
        await fetch(`/api/borrarTaller/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            fetch('api/talleres')
                .then(response => response.json())
                .then(data => this.setState({talleres: data}))
            this.dialogEliminado();
        });
    }

    async habilitar(id) {
        await fetch(`/api/habilitarTaller/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            fetch('api/talleres')
                .then(response => response.json())
                .then(data => this.setState({talleres: data}))
            this.dialogHabilitado();
        });
    }

    handleChange = event => {
        event.preventDefault();
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleValidation(){
        let errors = {};
        let formIsValid = true;

        //Contraseña
        if (!this.state.newPassword) {
            formIsValid = false;
            errors["password"] = "No puede estar vacío";
        }

        //RepetirContraseña
        if (!this.state.newPasswordRepeat) {
            formIsValid = false;
            errors["repeatPassword"] = "No puede estar vacío";
        } else if (this.state.newPassword !== this.state.newPasswordRepeat) {
            formIsValid = false;
            errors["repeatPassword"] = "Debe ser igual a la contraseña";
        }

        this.setState({errors: errors});
        return formIsValid;
    }

    async cambiarPassword(){
        if (this.handleValidation()){
            await fetch(`/api/updatePasswordTaller?id=${encodeURIComponent(this.state.activeId)}&nuevaPassword=${encodeURIComponent(this.state.newPassword)}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                this.handleClose();
                this.dialogCreado();
            });
        }
    }

    dialogHabilitado() {
        this.setState({openDialogHabilitar: false, openDialogHabilitadoExito: true});
    }

    dialogEliminado() {
        this.setState({openDialogDeshabilitar: false, openDialogDeshabilitadoExito: true});
    }

    dialogDeshabilitar(idTaller) {
        this.setState({openDialogDeshabilitar: true, activeId: idTaller});
    };

    dialogHabilitar(idTaller) {
        this.setState({openDialogHabilitar: true, activeId: idTaller});
    };

    dialogCreado() {
        this.setState({openDialogExito: true});
    }

    cleanPassword(idCliente){
        this.setState({activeId: idCliente, openDialogCambiarPw: true})
    }

    edit(idTaller) {
        this.props.history.push('/talleres/' + idTaller);
    }

    reviews(idTaller) {
        this.props.history.push('/reseñas/' + idTaller);
    }

    book(idTaller){
        this.props.history.push('/reservacion/' + idTaller);
    }

    filterBarrio = e => {
        this.setState({barrio: e.target.value});
    }

    filterNombre = e => {
        this.setState({nombre: e.target.value});
    }

    filterClasificacion = e => {
        this.setState({clasificacion: e.target.value});
    }

    filterMarca = e => {
        this.setState({marca: e.target.value});
    }

    render() {
        const  {isLoading, nombre, barrio, clasificacion, marca} = this.state;
        const adminUser = JSON.parse(localStorage.getItem("adminUser"));
        const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
        const classes = {
            textField: {
                width: 200,
            },
        };
        let filterTalleres = this.state.talleres.slice();
        if (this.state.nombre) {
            filterTalleres = filterTalleres.filter(taller => taller.nombre.toLowerCase().indexOf(nombre.toLowerCase()) !== -1);
        }
        if (this.state.barrio) {
            filterTalleres = filterTalleres.filter(taller => taller.barrio.toLowerCase().indexOf(barrio.toLowerCase()) !== -1);
        }
        if (this.state.clasificacion) {
            filterTalleres = filterTalleres.filter(taller => taller.clasificacion.descripcion.toLowerCase().indexOf(clasificacion.toLowerCase()) !== -1 || taller.clasificacion.descripcion.match("Todas"));
        }
        if (this.state.marca) {
            filterTalleres = filterTalleres.filter(taller => taller.marca.descripcion.toLowerCase().indexOf(marca.toLowerCase()) !== -1 || taller.marca.descripcion.match("Todas"));
        }

        if (isLoading) {
            return <div className='sweet-loading'>
                <ClipLoader
                    css={override}
                    sizeUnit={"px"}
                    size={35}
                    color={'#123abc'}
                    loading={this.state.isLoading}
                />
            </div>
        }

        return (
            <div>
                {adminUser !== null &&
                <AppNavbar/>
                }
                {clienteUser !== null &&
                <ClientesNavbar/>
                }
                <Container fluid>
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
                                <Button onClick={this.handleClose} color="primary">
                                    Aceptar
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            open={this.state.openDialogCambiarPw}
                            onClose={this.handleClose}
                            aria-labelledby="max-width-dialog-title"
                        >
                            <DialogTitle id="max-width-dialog-title">Blanquear Contraseña</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Ingrese la nueva contraseña
                                </DialogContentText>
                                <form className={classes.form} noValidate>
                                    <Grid container spacing={2}>
                                        <TextField id="newPassword"
                                                   label="Contraseña"
                                                   margin="normal"
                                                   variant="outlined"
                                                   name="newPassword"
                                                   type={this.state.showPassword ? 'text' : 'password'}
                                                   InputProps={{
                                                       endAdornment:
                                                           <InputAdornment position="end">
                                                               <IconButton
                                                                   aria-label="toggle password visibility"
                                                                   onClick={this.handleClickShowPassword}
                                                                   onMouseDown={this.handleMouseDownPassword}
                                                               >
                                                                   {this.state.showPassword ? <Visibility/> : <VisibilityOff/>}
                                                               </IconButton>
                                                           </InputAdornment>
                                                   }}
                                                   required
                                                   onChange={this.handleChange}
                                                   value={this.state.newPassword}
                                                   error={this.state.errors["password"]}
                                                   helperText={this.state.errors["password"]}
                                                   fullWidth/>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <TextField id="newPasswordRepeat"
                                                   label="Repetir Contraseña"
                                                   margin="normal"
                                                   variant="outlined"
                                                   name="newPasswordRepeat"
                                                   type={this.state.showRepeatPassword ? 'text' : 'password'}
                                                   InputProps={{
                                                       endAdornment:
                                                           <InputAdornment position="end">
                                                               <IconButton
                                                                   aria-label="toggle password visibility"
                                                                   onClick={this.handleClickShowRepeatPassword}
                                                                   onMouseDown={this.handleMouseDownPassword}
                                                               >
                                                                   {this.state.showRepeatPassword ? <Visibility/> : <VisibilityOff/>}
                                                               </IconButton>
                                                           </InputAdornment>
                                                   }}
                                                   required
                                                   onChange={this.handleChange}
                                                   value={this.state.newPasswordRepeat}
                                                   error={this.state.errors["repeatPassword"]}
                                                   helperText={this.state.errors["repeatPassword"]}
                                                   fullWidth/>
                                    </Grid>
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.cambiarPassword} color="primary">
                                    Aceptar
                                </Button>
                                <Button onClick={this.handleClose} color="primary">
                                    Cancelar
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            open={this.state.openDialogHabilitadoExito}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Operación Exitosa"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Taller habilitado correctamente.
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
                                    Taller deshabilitado correctamente.
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
                    {adminUser !== null &&
                    <div className="float-right">
                        <Button type="button" variant="contained" color="primary" className={classes.button} onClick={() => this.props.history.push('/talleres/new')}>
                            Crear Taller
                        </Button>
                    </div>
                    }
                    <Typography variant="h4">
                        Talleres
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
                        label="Barrio"
                        margin="normal"
                        onChange={this.filterBarrio}
                    />
                    &nbsp;&nbsp;
                    &nbsp;&nbsp;
                    <TextField
                        id="standard-basic"
                        className={classes.textField}
                        label="Marca"
                        margin="normal"
                        onChange={this.filterMarca}
                    />
                    &nbsp;&nbsp;
                    &nbsp;&nbsp;
                    <TextField
                        id="standard-basic"
                        className={classes.textField}
                        label="Especialización"
                        margin="normal"
                        onChange={this.filterClasificacion}
                    />
                    <TalleresEnhancedTable rows={filterTalleres} habilitarTaller={this.dialogHabilitar}
                                           deshabilitarTaller={this.dialogDeshabilitar} editar={this.edit}
                                           verReseñas={this.reviews} reservar={this.book} usuarioCliente={clienteUser} usuarioAdmin={adminUser} limpiarPassword={this.cleanPassword}/>
                </Container>
            </div>
        );
    }
}

export default TallerList