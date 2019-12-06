import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Container, Form, FormGroup, Input, Label} from 'reactstrap';
import {confirmAlert} from "react-confirm-alert";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TalleresNavbar from "./TalleresNavbar";
import ClientesNavbar from "./ClientesNavbar";
import Typography from "@material-ui/core/Typography";
import MecanicosEnhancedTable from "./MecanicosSortableTable";
import Button from '@material-ui/core/Button';
import es from "date-fns/locale/es";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";

registerLocale("es", es);

class ReparacionEdit extends Component {


    emptyItem = {
        fechaReserva: '',
        horaReserva: '',
        taller: '',
        mecanicos: [],
        fechaDevolucion: '',
        horaDevolucion: '',
        importeTotal: '',
        estadoReparacion: '',
        descripcionProblemaCliente: '',
        descripcionProblemaTaller: '',
        descripcionReparacion: '',
        patenteAuto: '',
        modeloAuto: '',
        nuevoPresupuesto: '',
        cliente: ''
    };


    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            errors: {},
            mecanicosTaller: [],
            flagImporte: false,
            endDate: null,
            flagMostrarPresupuesto: false,
            flagNuevoPresupuesto: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.guardarReparacion = this.guardarReparacion.bind(this);
        this.asignarMecanico = this.asignarMecanico.bind(this);
        this.desasignarMecanico = this.desasignarMecanico.bind(this);
        const taller = JSON.parse(localStorage.getItem("tallerUser"));
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (taller === null && cliente === null) {
            this.props.history.push('/');
            localStorage.clear();
        }
    }

    async componentDidMount() {
        const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
        const reparacion = await (await fetch(`/api/reparacion/${this.props.match.params.id}`)).json();
        this.setState({item: reparacion});
        if (this.state.item.estadoReparacion.descripcion === "En diagnostico" && tallerUser !== null) {
            this.setState({flagMostrarPresupuesto: true});
        }
        if (this.state.item.importeTotal !== null)
            this.setState({flagImporte: true});
        if (tallerUser !== null) {
            const mecs = await (await fetch(`/api/mecanicos/${tallerUser.idTaller}`)).json();
            this.setState({mecanicosTaller: mecs});
        }
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        let item = {...this.state.item};
        item[name] = value;
        if (name !== "nuevoPresupuesto") {
            this.setState({item});
        } else {
            this.setState(
                prevState => ({
                    item: {
                        ...prevState.item,
                        nuevoPresupuesto: value
                    }
                })
            );
        }
        if (name === 'nuevoPresupuesto') {
            this.setState({
                flagMostrarPresupuesto: !this.state.flagMostrarPresupuesto,
                flagNuevoPresupuesto: !this.state.flagNuevoPresupuesto
            });
        }
    }

    handleDate(date) {
        this.setState({
            endDate: date
        });
    }

    async guardarReparacion() {
        if (this.handleValidation()) {
            const {item} = this.state;
            await fetch('/api/reparacion', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            });
            this.dialogCreado();
        }
    }

    toCurrency(number) {
        const formatter = new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return formatter.format(number);
    }


    handleValidation() {
        let fields = this.state.item;
        let errors = {};
        let formIsValid = true;
        let diaActual = new Date();

        if (fields["estadoReparacion"].descripcion === "Pendiente Diagnostico") {
            if (fields["modeloAuto"] === null || fields["modeloAuto"] === '') {
                formIsValid = false;
                errors["modeloAuto"] = "No puede estar vacio";
            }
            if (fields["patenteAuto"] === null || fields["patenteAuto"] === '') {
                formIsValid = false;
                errors["patenteAuto"] = "No puede estar vacio";
            }
        }

        if (fields["estadoReparacion"].descripcion === "En diagnostico") {
            if (fields["importeTotal"] === null || fields["importeTotal"] === '') {
                formIsValid = false;
                errors["importeTotal"] = "No puede estar vacio";
            }
            if (fields["descripcionProblemaTaller"] === null || fields["descripcionProblemaTaller"] === '') {
                formIsValid = false;
                errors["descripcionProblemaTaller"] = "No puede estar vacio";
            }
            if (fields["mecanicos"].length === 0) {
                formIsValid = false;
                errors["mecanicos"] = "Debe asignarse al menos un mecanico";
            }
            if (this.state.endDate != null) {
                if (diaActual.getDate() === this.state.endDate.getDate() && diaActual.getMonth() === this.state.endDate.getMonth() && diaActual.getTime() > this.state.endDate.getTime()) {
                    formIsValid = false;
                    errors["hora"] = "Horario Invalido";
                } else if (this.state.endDate.getHours() === 0) {
                    formIsValid = false;
                    errors["hora"] = "Debe seleccionar una hora";
                }
                let fechaSeparada = fields["fechaReserva"].split("-");
                let fechaReOrdenada = fechaSeparada[2] + "-" + fechaSeparada[1] + "-" + fechaSeparada[0];
                if (Date.parse(fechaReOrdenada) - this.state.endDate > 0) {
                    formIsValid = false;
                    errors["hora"] = "La fecha de devolución debe ser mayor a la fecha de reserva";
                }
            } else {
                formIsValid = false;
                errors["hora"] = "Debe seleccionar una fecha y hora";
            }
        }

        if (fields["estadoReparacion"].descripcion === "En reparacion") {
            if (fields["descripcionProblemaTaller"] === null || fields["descripcionProblemaTaller"] === '') {
                formIsValid = false;
                errors["descripcionProblemaTaller"] = "No puede estar vacio";
            }
            if (fields["descripcionReparacion"] === null || fields["descripcionReparacion"] === '') {
                formIsValid = false;
                errors["descripcionReparacion"] = "No puede estar vacio";
            }
            if (fields["mecanicos"].length === 0) {
                formIsValid = false;
                errors["mecanicos"] = "Debe asignarse al menos un mecanico";
            }
        }


        this.setState({errors: errors});
        return formIsValid;
    }


    isWeekday(date) {
        const day = date.getDay();
        return day !== 0 && day !== 6
    }

    asignarMecanico(mecanico) {
        let itemReparacion = {...this.state.item};
        itemReparacion.mecanicos.push(mecanico);
        this.setState({item: itemReparacion});
        console.log(this.state.item);
    }

    desasignarMecanico(mecanico) {
        let itemReparacion = {...this.state.item};
        itemReparacion.mecanicos = itemReparacion.mecanicos.filter(mec => mec.idMecanico !== mecanico.idMecanico);
        this.setState({item: itemReparacion});
        console.log(this.state.item);
    }

    dialogCreado() {
        confirmAlert({
            title: 'Operacion Exitosa',
            buttons: [
                {
                    label: 'Aceptar',
                    onClick: () => this.props.history.push('/reparaciones')
                }
            ]
        })
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (this.handleValidation()) {
            const {item} = this.state;
            if (this.state.endDate !== null) {
                item.fechaDevolucion = this.state.endDate.getDate() + "-" + this.state.endDate.getMonth() + "-" + this.state.endDate.getFullYear();
                if (this.state.endDate.getHours() === 9) {
                    item.horaDevolucion = "0" + this.state.endDate.getHours() + ":" + this.state.endDate.getMinutes() + "0";
                } else {
                    item.horaDevolucion = this.state.endDate.getHours() + ":" + this.state.endDate.getMinutes() + "0";
                }
            }
            await fetch('/api/avanzarReparacion', {
                method: 'PUT',
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
        const {item, mecanicosTaller} = this.state;
        const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
        const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
        const descEstado = item.estadoReparacion.descripcion;
        const classes = {
            label: {
                top: "20px",
            },
        };
        return <div>
            {tallerUser !== null &&
            <TalleresNavbar/>
            }
            {clienteUser !== null &&
            <ClientesNavbar/>
            }
            <Container>
                <Typography variant="h4">
                    Detalles de la Reparación
                </Typography>
                <Form onSubmit={this.handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                label="Marca y Modelo del Auto"
                                margin="normal"
                                variant="outlined"
                                name="modeloAuto"
                                fullWidth
                                style={{
                                    backgroundColor: clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Confirmacion" || descEstado === "En diagnostico" || descEstado === "En reparacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado" ? "#e9ecef" : ""
                                }}
                                InputProps={{
                                    readOnly: clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Confirmacion" || descEstado === "En diagnostico" || descEstado === "En reparacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado",
                                }}
                                value={item.modeloAuto || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["modeloAuto"]}
                                helperText={this.state.errors["modeloAuto"]}
                                autoComplete="modeloAuto"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                label="Patente Auto"
                                margin="normal"
                                variant="outlined"
                                name="patenteAuto"
                                fullWidth
                                style={{
                                    backgroundColor: clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Confirmacion" || descEstado === "En diagnostico" || descEstado === "En reparacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado" ? "#e9ecef" : ""
                                }}
                                InputProps={{
                                    readOnly: clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Confirmacion" || descEstado === "En diagnostico" || descEstado === "En reparacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado",
                                }}
                                value={item.patenteAuto || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["patenteAuto"]}
                                helperText={this.state.errors["patenteAuto"]}
                                autoComplete="patenteAuto"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                label="Fecha Reserva"
                                margin="normal"
                                variant="outlined"
                                name="fechaReserva"
                                fullWidth
                                style={{
                                    backgroundColor: "#e9ecef",
                                }}
                                InputProps={{
                                    readOnly: true,
                                }}
                                value={item.fechaReserva || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["fechaReserva"]}
                                helperText={this.state.errors["fechaReserva"]}
                                autoComplete="fechaReserva"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                label="Hora Reserva"
                                margin="normal"
                                variant="outlined"
                                name="horaReserva"
                                fullWidth
                                style={{
                                    backgroundColor: "#e9ecef",
                                }}
                                InputProps={{
                                    readOnly: true,
                                }}
                                value={item.horaReserva || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["horaReserva"]}
                                helperText={this.state.errors["horaReserva"]}
                                autoComplete="horaReserva"
                            />
                        </Grid>
                    </Grid>
                    {(clienteUser !== null || tallerUser !== null) && item.fechaDevolucion !== null && item.horaDevolucion !== null &&
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                label="Fecha Devolución"
                                margin="normal"
                                variant="outlined"
                                name="fechaDevolucion"
                                fullWidth
                                style={{
                                    backgroundColor: clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Confirmacion" || descEstado === "En reparacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado" ? "#e9ecef" : "",
                                }}
                                InputProps={{
                                    readOnly: clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Confirmacion" || descEstado === "En reparacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado",
                                }}
                                value={item.fechaDevolucion || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["fechaDevolucion"]}
                                helperText={this.state.errors["fechaDevolucion"]}
                                autoComplete="fechaDevolucion"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                label="Hora Devolución"
                                margin="normal"
                                variant="outlined"
                                name="horaDevolucion"
                                fullWidth
                                style={{
                                    backgroundColor: clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Confirmacion" || descEstado === "En reparacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado" ? "#e9ecef" : "",
                                }}
                                InputProps={{
                                    readOnly: clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Confirmacion" || descEstado === "En reparacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado",
                                }}
                                value={item.horaDevolucion || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["horaDevolucion"]}
                                helperText={this.state.errors["horaDevolucion"]}
                                autoComplete="horaDevolucion"
                            />
                        </Grid>
                    </Grid>
                    }
                    <Grid container spacing={2}>
                        {this.state.flagImporte && !this.state.flagMostrarPresupuesto &&
                        <Grid item xs={12} sm={descEstado === "En reparacion" && tallerUser !== null ? 4 : 6}>
                            <TextField
                                id="outlined-basic"
                                label="Importe"
                                margin="normal"
                                variant="outlined"
                                name="importeTotal"
                                fullWidth
                                style={{
                                    backgroundColor: !this.state.flagMostrarPresupuesto ? "#e9ecef" : "",
                                }}
                                InputProps={{
                                    readOnly: !this.state.flagMostrarPresupuesto,
                                }}
                                value={item.importeTotal ? "$" + this.toCurrency(item.importeTotal) : ''}
                                onChange={this.handleChange}
                                error={this.state.errors["importeTotal"]}
                                helperText={this.state.errors["importeTotal"]}
                                autoComplete="importeTotal"
                            />
                        </Grid>
                        }
                        {(!this.state.flagImporte || this.state.flagMostrarPresupuesto) &&
                        <Grid item xs={12} sm={descEstado === "En reparacion" && tallerUser !== null ? 4 : 6}>
                            <TextField
                                id="outlined-basic"
                                label="Importe"
                                margin="normal"
                                variant="outlined"
                                name="importeTotal"
                                fullWidth
                                style={{
                                    backgroundColor: !this.state.flagMostrarPresupuesto ? "#e9ecef" : "",
                                }}
                                InputProps={{
                                    readOnly: !this.state.flagMostrarPresupuesto,
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                                value={item.importeTotal || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["importeTotal"]}
                                helperText={this.state.errors["importeTotal"]}
                                autoComplete="importeTotal"
                            />
                        </Grid>
                        }
                        {descEstado === "En reparacion" && tallerUser !== null &&
                            <Grid item xs={12} sm={descEstado === "En reparacion" && tallerUser !== null ? 4 : 6}>
                            <FormControlLabel
                            control={
                            <Checkbox
                                name="nuevoPresupuesto"
                                checked={this.state.flagNuevoPresupuesto}
                                onChange={this.handleChange}
                                value={this.state.flagNuevoPresupuesto}
                                className={classes.label}
                                color="primary"
                            />
                        }
                            label="Nuevo Presupuesto"
                            />
                            </Grid>
                        }
                        <Grid item xs={12} sm={descEstado === "En reparacion" && tallerUser !== null ? 4 : 6}>
                        <TextField
                            id="outlined-basic"
                            label="Estado"
                            margin="normal"
                            variant="outlined"
                            name="estadoReparacion"
                            fullWidth
                            style={{
                                backgroundColor: "#e9ecef",
                            }}
                            InputProps={{
                                readOnly: true,
                            }}
                            value={item.estadoReparacion.descripcion || ''}
                            onChange={this.handleChange}
                            error={this.state.errors["estadoReparacion"]}
                            helperText={this.state.errors["estadoReparacion"]}
                            autoComplete="estadoReparacion"
                        />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-multiline-static"
                                name="descripcionProblemaCliente"
                                multiline
                                fullWidth
                                rows="4"
                                label="Descripción del problema del cliente"
                                style={{
                                    backgroundColor: "#e9ecef"
                                }}
                                InputProps={{
                                    readOnly: true,
                                }}
                                value={item.descripcionProblemaCliente || ''}
                                error={this.state.errors["descripcionProblemaCliente"]}
                                helperText={this.state.errors["descripcionProblemaCliente"]}
                                margin="normal"
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-multiline-static"
                                name="descripcionProblemaTaller"
                                multiline
                                fullWidth
                                rows="4"
                                label="Diagnostico del Taller"
                                style={{
                                    backgroundColor: clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Diagnostico" || descEstado === "Pendiente Confirmacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado" ? "#e9ecef" : ''
                                }}
                                InputProps={{
                                    readOnly: clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Diagnostico" || descEstado === "Pendiente Confirmacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado",
                                }}
                                error={this.state.errors["descripcionProblemaTaller"]}
                                helperText={this.state.errors["descripcionProblemaTaller"]}
                                value={item.descripcionProblemaTaller || ''}
                                margin="normal"
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-multiline-static"
                                name="descripcionReparacion"
                                multiline
                                fullWidth
                                rows="4"
                                label="Reparaciones Realizadas"
                                style={{
                                    backgroundColor: clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Diagnostico" || descEstado === "En diagnostico" || descEstado === "Pendiente Confirmacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado" ? "#e9ecef" : ''
                                }}
                                InputProps={{
                                    readOnly: clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Diagnostico" || descEstado === "En diagnostico" || descEstado === "Pendiente Confirmacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado",
                                }}
                                error={this.state.errors["descripcionReparacion"]}
                                helperText={this.state.errors["descripcionReparacion"]}
                                value={item.descripcionReparacion || ''}
                                margin="normal"
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>

                        {tallerUser !== null && item.fechaDevolucion === null && item.horaDevolucion === null && descEstado !== "Cancelado" && descEstado !== "Pendiente Diagnostico" &&
                        <FormGroup className="col-md-6 mb-3">
                            <div>
                                <Label for="fechaHoraDevolucion">Fecha y hora de devolución</Label>
                            </div>
                            <DatePicker
                                inline
                                selected={this.state.endDate}
                                onChange={this.handleDate.bind(this)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={60}
                                minTime={new Date(new Date().setHours(9, 0, 0))}
                                maxTime={new Date(new Date().setHours(17, 0, 0))}
                                filterDate={this.isWeekday}
                                minDate={new Date()}
                                locale="es"
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="Horario"
                            />
                            <br></br>
                            <span className="error">{this.state.errors["hora"]}</span>
                        </FormGroup>
                        }
                    </Grid>
                    {tallerUser !== null && descEstado !== "En diagnostico" &&
                    <Typography variant="h4">
                        Mecanicos Asignados
                    </Typography>
                    }
                    {tallerUser !== null && descEstado === "En diagnostico" &&
                    <Typography variant="h4">
                        Asignación de Mecanicos
                    </Typography>
                    }
                    {tallerUser !== null && descEstado !== "En diagnostico" && descEstado !== "En reparacion" &&
                    <MecanicosEnhancedTable rows={item.mecanicos} acciones={false} dense={true}/>
                    }
                    {(tallerUser !== null && (descEstado === "En diagnostico" || descEstado === "En reparacion")) &&
                    <MecanicosEnhancedTable rows={mecanicosTaller} acciones={true}
                                            mecanicosEnReparacion={item.mecanicos} enReparacion={true}
                                            asignarMecanico={this.asignarMecanico}
                                            desasignarMecanico={this.desasignarMecanico} dense={true}/>
                    }
                    {tallerUser !== null &&
                    <span className="error">{this.state.errors["mecanicos"]}</span>
                    }
                    {tallerUser !== null &&
                    <br></br>
                    }
                    {tallerUser !== null &&
                    <br></br>
                    }
                    <FormGroup>
                        {((tallerUser !== null && descEstado !== "Pendiente Confirmacion" && descEstado !== "Finalizado" && descEstado !== "Cancelado") || (clienteUser !== null && descEstado === "Pendiente Confirmacion")) &&
                        <Button variant="contained" color="primary" type="submit">
                            Confirmar
                        </Button>
                        }{' '}
                        {tallerUser !== null && descEstado === "En reparacion" &&
                        <Button onClick={this.guardarReparacion} variant="contained" color="default">
                            Guardar
                        </Button>
                        }{' '}
                        <Link to='/reparaciones' style={{textDecoration: 'none'}}>
                            <Button variant="contained" color="secondary">
                                Volver
                            </Button>
                        </Link>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(ReparacionEdit);