import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {ButtonGroup, Container, Form, FormGroup} from 'reactstrap';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClientesNavbar from "./ClientesNavbar";
import TalleresNavbar from "./TalleresNavbar";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import es from "date-fns/locale/es";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputAdornment from "@material-ui/core/InputAdornment";
import MecanicosEnhancedTable from "./MecanicosSortableTable";
registerLocale("es", es);

class ReservacionScreen extends Component {


    emptyItem = {
        nombre: '',
        barrio: '',
        telefono: '',
        mail: '',
        ubicacion: '',
        marca: '',
        clasificacion: '',
        descripcionTaller: ''
    };

    emptyReparacionCliente = {
        fechaReserva: '',
        horaReserva: '',
        descripcionProblemaCliente: '',
        taller: '',
        cliente: ''
    };

    emptyReparacionTaller = {
        fechaReserva: '',
        horaReserva: '',
        taller: '',
        mecanicos: [],
        fechaDevolucion: '',
        horaDevolucion: '',
        importeTotal: '',
        estadoReparacion: '',
        descripcionProblemaTaller: '',
        descripcionReparacion: '',
        patenteAuto: '',
        modeloAuto: '',
        marcaAuto: ''
    };


    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            itemReparacion: this.emptyReparacionCliente,
            itemReparacionTaller: this.emptyReparacionTaller,
            estados: [],
            values: [],
            mecanicos: [],
            errors: {},
            formIsValid: true,
            startDate: null,
            flagMecanicos: null,
            endDate: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleMecanicos = this.handleMecanicos.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.asignarMecanico = this.asignarMecanico.bind(this);
        this.desasignarMecanico = this.desasignarMecanico.bind(this);
        this.validateReservacion = this.validateReservacion.bind(this);
        const taller = JSON.parse(localStorage.getItem("tallerUser"));
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (taller === null && cliente === null) {
            this.props.history.push('/');
            localStorage.clear();
        }
    }

    async componentDidMount() {
        const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
        const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
        if (clienteUser !== null || tallerUser !== null) {
            if (this.props.match.params.id !== 'new') {
                if (clienteUser !== null) {
                    const taller = await (await fetch(`/api/taller/${this.props.match.params.id}`)).json();
                    this.setState({item: taller});
                }
            } else {
                const mecs = await (await fetch(`/api/mecanicos`)).json();
                const ests = await (await fetch(`/api/estados`)).json();
                this.setState({mecanicos: mecs, estados: ests});
            }
        }
    }

    handleMecanicos = (e) => {
        let options = e.target.options;
        let itemReparacionTaller = {...this.state.itemReparacionTaller};

        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                itemReparacionTaller.mecanicos.push(options[i].value);
            }
        }

        this.setState({itemReparacionTaller});
        console.log(this.state.itemReparacionTaller);
    }

    asignarMecanico(mecanico){
        let itemReparacionTaller = {...this.state.itemReparacionTaller};
        itemReparacionTaller.mecanicos.push(mecanico);
        this.setState({itemReparacionTaller : itemReparacionTaller});
    }

    desasignarMecanico(mecanico){
        let itemReparacionTaller = {...this.state.itemReparacionTaller};
        itemReparacionTaller.mecanicos = itemReparacionTaller.mecanicos.filter(mec => mec.idMecanico !== mecanico.idMecanico);
        this.setState({itemReparacionTaller : itemReparacionTaller});
    }

    handleChange(event) {
        const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
        const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
        if (clienteUser !== null) {
            const target = event.target;
            const value = target.value;
            const name = target.name;
            let itemReparacion = {...this.state.itemReparacion};
            itemReparacion[name] = value;
            this.setState({itemReparacion});
        }
        if (tallerUser !== null) {
            const target = event.target;
            const value = target.value;
            const name = target.name;
            let itemReparacionTaller = {...this.state.itemReparacionTaller};
            itemReparacionTaller[name] = value;
            this.setState({itemReparacionTaller});
        }
        if (event.target.name === "estadoReparacion") {
            let estado = JSON.parse(event.target.value);
            if (estado.descripcion !== "Pendiente Diagnóstico") {
                this.setState({flagMecanicos: true});
            } else {
                this.setState({flagMecanicos: false});
            }
        }

    }

    handleDate(date) {
        this.setState({
            startDate: date
        });
    }

    handleEndDate(date) {
        this.setState({
            endDate: date
        });
    }

    validateReservacion() {
        let fechaReserva = '';
        let horaReserva = '';
        const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
        const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
        if (this.state.startDate != null) {
            fechaReserva = this.state.startDate.getDate() + "-" + this.state.startDate.getMonth() + "-" + this.state.startDate.getFullYear();
            horaReserva = this.state.startDate.getHours() + ":" + this.state.startDate.getMinutes() + "0";
        }
        if (clienteUser !== null) {
            return fetch(`/api/validarReparacion?id=${encodeURIComponent(this.props.match.params.id)}&fecha=${encodeURIComponent(fechaReserva)}&hora=${encodeURIComponent(horaReserva)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        }
        if (tallerUser !== null) {
            return fetch(`/api/validarReparacion?id=${encodeURIComponent(tallerUser.idTaller.toString())}&fecha=${encodeURIComponent(fechaReserva)}&hora=${encodeURIComponent(horaReserva)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        }
    }

    handleValidation() {
        let fields = this.state.itemReparacionTaller;
        let errors = {};
        let diaActual = new Date();
        const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
        this.setState({formIsValid: true});
        if (this.state.startDate != null) {
            if (diaActual.getDate() === this.state.startDate.getDate() && diaActual.getMonth() === this.state.startDate.getMonth() && diaActual.getTime() > this.state.startDate.getTime()) {
                this.setState({formIsValid: false});
                errors["hora"] = "Horario Inválido";
            } else if (this.state.startDate.getHours() === 0) {
                this.setState({formIsValid: false});
                errors["hora"] = "Debe seleccionar una hora";
            }
        } else {
            this.setState({formIsValid: false});
            errors["hora"] = "Debe seleccionar una fecha y hora";
        }
        if (this.state.startDate != null && this.state.endDate != null) {
            if ((this.state.endDate.getFullYear() < this.state.startDate.getFullYear())
                || (this.state.endDate.getFullYear() === this.state.startDate.getFullYear() && this.state.endDate.getMonth() < this.state.startDate.getMonth())
                || (this.state.endDate.getFullYear() === this.state.startDate.getFullYear() && this.state.endDate.getMonth() === this.state.startDate.getMonth() && this.state.endDate.getDate() < this.state.startDate.getDate())
                || (this.state.endDate.getFullYear() === this.state.startDate.getFullYear() && this.state.endDate.getMonth() === this.state.startDate.getMonth() && this.state.endDate.getDate() === this.state.startDate.getDate() && this.state.endDate.getTime() <= this.state.startDate.getTime())) {
                this.setState({formIsValid: false});
                errors["hora"] = "La fecha de devolución debe ser menor a la fecha de reservación";
            }
        }
        if (tallerUser !== null) {
            if (fields["estadoReparacion"]) {
                let estado = JSON.parse(fields["estadoReparacion"]);
                if (estado.descripcion === "Finalizado" || estado.descripcion === "Listo para retirar") {
                    if (fields["modeloAuto"].length === 0) {
                        this.setState({formIsValid: false});
                        errors["modeloAuto"] = "No puede estra vacío para el estado seleccionado";
                    }
                    if (fields["marcaAuto"].length === 0){
                        this.setState({formIsValid: false});
                        errors["marcaAuto"] = "No puede estra vacío para el estado seleccionado";
                    }
                    if (fields["patenteAuto"].length === 0) {
                        this.setState({formIsValid: false});
                        errors["patenteAuto"] = "No puede estra vacío para el estado seleccionado";
                    }
                    if (fields["descripcionProblemaTaller"].length === 0) {
                        this.setState({formIsValid: false});
                        errors["descripcionProblemaTaller"] = "No puede estra vacío para el estado seleccionado";
                    }
                    if (fields["descripcionReparacion"].length === 0) {
                        this.setState({formIsValid: false});
                        errors["descripcionReparacion"] = "No puede estra vacío para el estado seleccionado";
                    }
                    if (fields["importeTotal"].length === 0) {
                        this.setState({formIsValid: false});
                        errors["importeTotal"] = "No puede estra vacío para el estado seleccionado";
                    }
                    if (this.state.endDate != null) {
                        if (diaActual.getDate() === this.state.endDate.getDate() && diaActual.getMonth() === this.state.endDate.getMonth() && diaActual.getTime() > this.state.endDate.getTime()) {
                            this.setState({formIsValid: false});
                            errors["horaEnd"] = "Horario Inválido";
                        } else if (this.state.endDate.getHours() === 0) {
                            this.setState({formIsValid: false});
                            errors["horaEnd"] = "Debe seleccionar una hora";
                        }
                    } else {
                        this.setState({formIsValid: false});
                        errors["horaEnd"] = "Debe seleccionar una fecha y hora";
                    }
                    if(fields["mecanicos"].length === 0){
                        this.setState({formIsValid: false});
                        errors["mecanicos"] = "Debe asignarse al menos un mecánico";
                    }
                } else if (estado.descripcion === "En reparación" || estado.descripcion === "Pendiente Confirmación") {
                    if (fields["modeloAuto"].length === 0) {
                        this.setState({formIsValid: false});
                        errors["modeloAuto"] = "No puede estra vacío para el estado seleccionado";
                    }
                    if (fields["marcaAuto"].length === 0){
                        this.setState({formIsValid: false});
                        errors["marcaAuto"] = "No puede estra vacío para el estado seleccionado";
                    }
                    if (fields["patenteAuto"].length === 0) {
                        this.setState({formIsValid: false});
                        errors["patenteAuto"] = "No puede estra vacío para el estado seleccionado";
                    }
                    if (fields["descripcionProblemaTaller"].length === 0) {
                        this.setState({formIsValid: false});
                        errors["descripcionProblemaTaller"] = "No puede estra vacío para el estado seleccionado";
                    }
                    if (fields["importeTotal"].length === 0) {
                        this.setState({formIsValid: false});
                        errors["importeTotal"] = "No puede estra vacío para el estado seleccionado";
                    }
                    if (this.state.endDate != null) {
                        if (diaActual.getDate() === this.state.endDate.getDate() && diaActual.getMonth() === this.state.endDate.getMonth() && diaActual.getTime() > this.state.endDate.getTime()) {
                            this.setState({formIsValid: false});
                            errors["horaEnd"] = "Horario Inválido";
                        } else if (this.state.endDate.getHours() === 0) {
                            this.setState({formIsValid: false});
                            errors["horaEnd"] = "Debe seleccionar una hora";
                        }
                    } else {
                        this.setState({formIsValid: false});
                        errors["horaEnd"] = "Debe seleccionar una fecha y hora";
                    }
                    if(fields["mecanicos"].length === 0){
                        this.setState({formIsValid: false});
                        errors["mecanicos"] = "Debe asignarse al menos un mecánico";
                    }
                } else if (estado.descripcion === "En diagnóstico") {
                    if (fields["modeloAuto"].length === 0) {
                        this.setState({formIsValid: false});
                        errors["modeloAuto"] = "No puede estra vacío para el estado seleccionado";
                    }
                    if (fields["marcaAuto"].length === 0){
                        this.setState({formIsValid: false});
                        errors["marcaAuto"] = "No puede estra vacío para el estado seleccionado";
                    }
                    if (fields["patenteAuto"].length === 0) {
                        this.setState({formIsValid: false});
                        errors["patenteAuto"] = "No puede estra vacío para el estado seleccionado";
                    }
                    if(fields["mecanicos"].length === 0){
                        this.setState({formIsValid: false});
                        errors["mecanicos"] = "Debe asignarse al menos un mecánico";
                    }
                }
            }else{
                this.setState({formIsValid: false});
                errors["estadoReparacion"] = "Debe seleccionar algún estado";
            }
        }
        this.setState({errors: errors});
        return this.validateReservacion().then(response => response.json()).then((data) => {
            if (!data) {
                var idTaller;
                if (tallerUser !== null){
                    idTaller = tallerUser.idTaller;
                }else{
                    idTaller = this.props.match.params.id;
                }
                this.setState({formIsValid: false});
                errors["hora"] = "Ese horario no esta disponible";
                let fechaReservaAux = this.state.startDate.getDate() + "-" + this.state.startDate.getMonth() + "-" + this.state.startDate.getFullYear();
                let horaReservaAux = this.state.startDate.getHours() + ":" + this.state.startDate.getMinutes() + "0";
                fetch(`/api/getProximaFechaDisponible?idTaller=${encodeURIComponent(idTaller)}&fechaReserva=${encodeURIComponent(fechaReservaAux)}&hora=${encodeURIComponent(horaReservaAux)}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.text()).then((data) => {
                    let fechaSeparada = data.split("-");
                    let soloFecha = fechaSeparada[0] + "/" + fechaSeparada[1] + "/" + fechaSeparada[2];
                    let soloHora = fechaSeparada[3];
                    errors["proximoHorario"] = "La próxima fecha libre es el " + soloFecha + " a las " + soloHora;
                    this.setState({errors: errors});
                });
            }
            this.setState({errors: errors});
        });
    }

    dialogCreado() {
        confirmAlert({
            title: 'Operación Exitosa',
            buttons: [
                {
                    label: 'Aceptar',
                    onClick: () => this.props.history.push('/reparaciones')
                }
            ]
        })
    }

    dialogCreadoTaller() {
        confirmAlert({
            title: 'Operación Exitosa',
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
        this.handleValidation().then((result) => {
            if (this.state.formIsValid) {
                const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
                const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
                if (clienteUser !== null) {
                    const {itemReparacion} = this.state;
                    itemReparacion.fechaReserva = this.state.startDate.getDate() + "-" + this.state.startDate.getMonth() + "-" + this.state.startDate.getFullYear();
                    if (this.state.startDate.getHours() === 9) {
                        itemReparacion.horaReserva = "0" + this.state.startDate.getHours() + ":" + this.state.startDate.getMinutes() + "0";
                    } else {
                        itemReparacion.horaReserva = this.state.startDate.getHours() + ":" + this.state.startDate.getMinutes() + "0";
                    }
                    fetch('/api/reparacion', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(itemReparacion),
                    });
                    this.dialogCreado();
                }
                if (tallerUser !== null) {
                    const {itemReparacionTaller} = this.state;
                    itemReparacionTaller.fechaReserva = this.state.startDate.getDate() + "-" + this.state.startDate.getMonth() + "-" + this.state.startDate.getFullYear();
                    if (this.state.startDate.getHours() === 9) {
                        itemReparacionTaller.horaReserva = "0" + this.state.startDate.getHours() + ":" + this.state.startDate.getMinutes() + "0";
                    } else {
                        itemReparacionTaller.horaReserva = this.state.startDate.getHours() + ":" + this.state.startDate.getMinutes() + "0";
                    }
                    if (this.state.endDate !== null) {
                        itemReparacionTaller.fechaDevolucion = this.state.endDate.getDate() + "-" + this.state.endDate.getMonth() + "-" + this.state.endDate.getFullYear();
                        if (this.state.endDate.getHours() === 9) {
                            itemReparacionTaller.horaDevolucion = "0" + this.state.startDate.getHours() + ":" + this.state.startDate.getMinutes() + "0";
                        } else {
                            itemReparacionTaller.horaDevolucion = this.state.endDate.getHours() + ":" + this.state.endDate.getMinutes() + "0";
                        }
                    }
                    fetch('/api/reparacion', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(itemReparacionTaller),
                    });
                    console.log(itemReparacionTaller);
                    this.dialogCreadoTaller();
                }
            }
        })
    }

    isWeekday(date) {
        const day = date.getDay();
        return day !== 0 && day !== 6
    }

    render() {
        const {item, itemReparacion, itemReparacionTaller, estados, mecanicos} = this.state;
        const clienteAux = JSON.parse(localStorage.getItem("clienteUser"));
        const tallerAux = JSON.parse(localStorage.getItem("tallerUser"));
        var mecanicoList;
        if (tallerAux !== null) {
            mecanicoList = mecanicos.map(mecanico => {
                if (mecanico.activo){
                return <tr key={mecanico.idMecanico}>
                    <td>{mecanico.idMecanico}</td>
                    <td style={{whiteSpace: 'nowrap'}}>{mecanico.nombre}</td>
                    <td>{mecanico.apellido}</td>
                    <td>{mecanico.telefono}</td>
                    <td>{mecanico.mail}</td>
                    <td>
                        <ButtonGroup>
                            {!itemReparacionTaller.mecanicos.some(mec => (mec.idMecanico === mecanico.idMecanico)) &&
                            <Button size="sm" color="primary"
                                    onClick={() => this.asignarMecanico(mecanico)}>Asignar</Button>
                            }
                            &nbsp;&nbsp;
                            {itemReparacionTaller.mecanicos.some(mec => (mec.idMecanico === mecanico.idMecanico)) &&
                            <Button size="sm" color="danger" onClick={() => this.desasignarMecanico(mecanico)}>Desasignar</Button>
                            }
                        </ButtonGroup>
                    </td>
                </tr>
                }
            });
        }
        let newOptionsEstados;
        if (tallerAux !== null) {
            newOptionsEstados = estados.map((estado) =>
                <option key={estado.idEstado} value={JSON.stringify(estado)}>{estado.descripcion}</option>
            );
            itemReparacionTaller.taller = JSON.stringify(tallerAux);
        }
        if (clienteAux !== null) {
            itemReparacion.cliente = JSON.stringify(clienteAux);
            itemReparacion.taller = this.state.item;
        }
        return <div>
            {clienteAux !== null &&
            <ClientesNavbar/>
            }
            {tallerAux !== null &&
            <TalleresNavbar/>
            }
            <Container>
                {clienteAux !== null &&
                <Typography variant="h4">Información del Taller</Typography>
                }
                <Form onSubmit={this.handleSubmit} noValidate>
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
                                value={item.nombre || ''}
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
                                value={item.barrio || ''}
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
                                value={item.telefono || ''}
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
                                value={item.mail || ''}
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
                                value={item.ubicacion || ''}
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
                                value={item.descripcionTaller || ''}
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
                                value={item.marca.descripcion || ''}
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
                                value={item.clasificacion.descripcion || ''}
                                onChange={this.handleChange}
                                autoComplete="clasificacion"
                            />
                        </Grid>
                    </Grid>
                    }
                    {clienteAux !== null &&
                    <Typography variant="h4">Fecha de Reservación</Typography>
                    }
                    {tallerAux !== null &&
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Typography variant="h4">Fecha de Reservación</Typography>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Typography variant="h4">Fecha de Devolución</Typography>
                        </FormGroup>
                    </div>
                    }
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                inline
                                selected={this.state.startDate}
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
                            <br></br>
                            <span className="error">{this.state.errors["proximoHorario"]}</span>
                        </Grid>
                        {tallerAux !== null &&
                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                inline
                                selected={this.state.endDate}
                                onChange={this.handleEndDate.bind(this)}
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
                            <span className="error">{this.state.errors["horaEnd"]}</span>
                        </Grid>
                        }
                        {clienteAux !== null &&
                        <Grid item xs={12} sm={6}>
                        <TextField
                            id="descripcionProblemaCliente"
                            name="descripcionProblemaCliente"
                            autoComplete="comentario"
                            label="Descripción del Problema"
                            multiline
                            fullWidth
                            rows="4"
                            value={itemReparacion.descripcionProblemaCliente || ''}
                            margin="normal"
                            variant="outlined"
                            onChange={this.handleChange}
                        />
                        </Grid>
                        }
                    </Grid>
                    {tallerAux !== null &&
                    <Typography variant="h4">Datos del Auto</Typography>
                    }
                    {tallerAux !== null &&
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                id="outlined-basic"
                                label="Modelo del Auto"
                                margin="normal"
                                variant="outlined"
                                name="modeloAuto"
                                fullWidth
                                value={itemReparacionTaller.modeloAuto || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["modeloAuto"]}
                                helperText={this.state.errors["modeloAuto"]}
                                autoComplete="modeloAuto"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                id="outlined-basic"
                                label="Marca del Auto"
                                margin="normal"
                                variant="outlined"
                                name="marcaAuto"
                                fullWidth
                                value={itemReparacionTaller.marcaAuto || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["marcaAuto"]}
                                helperText={this.state.errors["marcaAuto"]}
                                autoComplete="marcaAuto"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                id="outlined-basic"
                                label="Patente del Auto"
                                margin="normal"
                                variant="outlined"
                                name="patenteAuto"
                                fullWidth
                                value={itemReparacionTaller.patenteAuto || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["patenteAuto"]}
                                helperText={this.state.errors["patenteAuto"]}
                                autoComplete="patenteAuto"
                            />
                        </Grid>
                    </Grid>
                    }
                    {tallerAux !== null &&
                    <Typography variant="h4">Información de la Reparación</Typography>
                    }
                    {tallerAux !== null &&
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-multiline-static"
                                name="descripcionProblemaTaller"
                                multiline
                                fullWidth
                                rows="4"
                                label="Diagnostico del Taller"
                                error={this.state.errors["descripcionProblemaTaller"]}
                                helperText={this.state.errors["descripcionProblemaTaller"]}
                                value={itemReparacionTaller.descripcionProblemaTaller || ''}
                                margin="normal"
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-multiline-static"
                                name="descripcionReparacion"
                                multiline
                                fullWidth
                                rows="4"
                                label="Reparaciones Realizadas"
                                error={this.state.errors["descripcionReparacion"]}
                                helperText={this.state.errors["descripcionReparacion"]}
                                value={itemReparacionTaller.descripcionReparacion || ''}
                                margin="normal"
                                variant="outlined"
                                onChange={this.handleChange}
                            />
                        </Grid>
                    </Grid>
                    }
                    {tallerAux !== null &&
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                label="Importe"
                                margin="normal"
                                variant="outlined"
                                name="importeTotal"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                                value={itemReparacionTaller.importeTotal || ''}
                                onChange={this.handleChange}
                                error={this.state.errors["importeTotal"]}
                                helperText={this.state.errors["importeTotal"]}
                                autoComplete="importeTotal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="outlined-basic"
                                label="Cliente"
                                margin="normal"
                                variant="outlined"
                                name="cliente"
                                fullWidth
                                style={{
                                    backgroundColor: "#e9ecef"
                                }}
                                InputProps={{
                                    readOnly: true,
                                }}
                                value='Cliente Externo'
                                onChange={this.handleChange}
                                autoComplete="patenteAuto"
                            />
                        </Grid>
                    </Grid>
                    }
                    {tallerAux !== null &&
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" required error={this.state.errors["estadoReparacion"]}>
                                <InputLabel id="demo-simple-select-outlined-label">
                                    Estado
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="estadoReparacion"
                                    name="estadoReparacion"
                                    value={itemReparacionTaller.estadoReparacion}
                                    onChange={this.handleChange}
                                    className="select-material-ui"
                                >
                                    {estados.map(estado => (
                                        <MenuItem key={estado.idEstado} value={JSON.stringify(estado)}>
                                            {estado.descripcion}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {this.state.errors["estadoReparacion"] && <FormHelperText>{this.state.errors["estadoReparacion"]}</FormHelperText>}
                            </FormControl>
                        </Grid>
                    </Grid>
                    }
                    {tallerAux !== null &&
                    <br></br>
                    }
                    {tallerAux !== null && this.state.flagMecanicos &&
                    <br></br>
                    }
                    {tallerAux !== null && this.state.flagMecanicos &&
                    <Typography variant="h4"> Asignación de mecanicos</Typography>
                    }
                    {tallerAux !== null && this.state.flagMecanicos &&
                    <MecanicosEnhancedTable rows={mecanicos} acciones={true}
                                            mecanicosEnReparacion={itemReparacionTaller.mecanicos} enReservacion={true}
                                            asignarMecanico={this.asignarMecanico}
                                            desasignarMecanico={this.desasignarMecanico} dense={true}/>
                    }
                    {tallerAux !== null && this.state.flagMecanicos &&
                    <span className="error">{this.state.errors["mecanicos"]}</span>
                    }
                    {tallerAux !== null && this.state.flagMecanicos &&
                    <br></br>
                    }
                    {tallerAux !== null && this.state.flagMecanicos &&
                    <br></br>
                    }
                    <FormGroup>
                        <Button variant="contained" color="primary" type="submit">
                            Reservar
                        </Button>
                        {' '}
                        <Link to={clienteAux ? '/talleres' : '/reparaciones'} style={{ textDecoration: 'none' }}>
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

export default withRouter(ReservacionScreen);