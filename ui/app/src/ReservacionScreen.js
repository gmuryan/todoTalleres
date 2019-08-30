import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import ClientesNavbar from "./ClientesNavbar";
import TalleresNavbar from "./TalleresNavbar";

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
        modeloAuto: ''
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
            endDate: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleMecanicos = this.handleMecanicos.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleMecanicos = (e) => {
        let options = e.target.options;
        console.log(options[0].value);
        let itemReparacionTaller = {...this.state.itemReparacionTaller};

        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                itemReparacionTaller.mecanicos.push(options[i].value);
            }
        }

        this.setState({itemReparacionTaller});
        console.log(this.state.itemReparacionTaller);
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
        const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
        this.setState({formIsValid: true});
        if (this.state.startDate != null) {
            if (diaActual.getDate() === this.state.startDate.getDate() && diaActual.getMonth() === this.state.startDate.getMonth() && diaActual.getTime() > this.state.startDate.getTime()) {
                this.setState({formIsValid: false});
                errors["hora"] = "Horario Invalido";
            } else if (this.state.startDate.getHours() === 0) {
                this.setState({formIsValid: false});
                errors["hora"] = "Debe seleccionar una hora";
            }
        } else {
            this.setState({formIsValid: false});
            errors["hora"] = "Debe seleccionar una fecha y hora";
        }
        if (this.state.startDate != null && this.state.endDate != null) {
            if ((this.state.endDate.getFullYear() > this.state.startDate.getFullYear())
                || (this.state.endDate.getFullYear() == this.state.startDate.getFullYear() && this.state.endDate.getMonth() < this.state.startDate.getMonth())
                || (this.state.endDate.getFullYear() == this.state.startDate.getFullYear() && this.state.endDate.getMonth() == this.state.startDate.getMonth() && this.state.endDate.getDate() < this.state.startDate.getDate())
                || (this.state.endDate.getFullYear() == this.state.startDate.getFullYear() && this.state.endDate.getMonth() == this.state.startDate.getMonth() && this.state.endDate.getDate() == this.state.startDate.getDate() && this.state.endDate.getTime() <= this.state.startDate.getTime())) {
                this.setState({formIsValid: false});
                errors["hora"] = "La fecha de devolución debe ser menor a la fecha de reservación";
            }
        }
        if (tallerUser !== null) {
            if (fields["estadoReparacion"] !== null) {
                let estado = JSON.parse(fields["estadoReparacion"]);
                console.log(estado.descripcion === "Listo para retirar");
            }
        }
        this.setState({errors: errors});
        return this.validateReservacion().then(response => response.json()).then((data) => {
            if (!data) {
                this.setState({formIsValid: false});
                errors["hora"] = "Ese horario no esta disponible";
            }
            this.setState({errors: errors});
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

    dialogCreadoTaller() {
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
        this.handleValidation().then((result) => {
            if (this.state.formIsValid) {
                const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
                const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
                if (clienteUser !== null) {
                    const {itemReparacion} = this.state;
                    itemReparacion.fechaReserva = this.state.startDate.getDate() + "-" + this.state.startDate.getMonth() + "-" + this.state.startDate.getFullYear();
                    if (this.state.startDate.getHours() === 9){
                        console.log("hola");
                        itemReparacion.horaReserva = "0" + this.state.startDate.getHours() + ":" + this.state.startDate.getMinutes() + "0";
                    }else{
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
                    if (this.state.startDate.getHours() === 9){
                        itemReparacionTaller.horaReserva = "0" + this.state.startDate.getHours() + ":" + this.state.startDate.getMinutes() + "0";
                    }else{
                        itemReparacionTaller.horaReserva = this.state.startDate.getHours() + ":" + this.state.startDate.getMinutes() + "0";
                    }
                    if (this.state.endDate !== null) {
                        itemReparacionTaller.fechaDevolucion = this.state.endDate.getDate() + "-" + this.state.endDate.getMonth() + "-" + this.state.endDate.getFullYear();
                        itemReparacionTaller.horaDevolucion = this.state.endDate.getHours() + ":" + this.state.endDate.getMinutes() + "0";
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
        let newOptionsEstados;
        let newOptionsMecanicos;
        if (tallerAux !== null) {
            newOptionsEstados = estados.map((estado) =>
                <option key={estado.idEstado} value={JSON.stringify(estado)}>{estado.descripcion}</option>
            );
            newOptionsMecanicos = mecanicos.map((mecanico) =>
                <option key={mecanico.idMecanico}
                        value={JSON.stringify(mecanico)}>{mecanico.nombre} {mecanico.apellido}</option>
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
                <h2>Información del Taller</h2>
                }
                <Form onSubmit={this.handleSubmit}>
                    {clienteAux !== null &&
                    <div className="row">
                        <FormGroup className="col-md-4 mb-3">
                            <Label for="nombre">Nombre</Label>
                            <Input readOnly type="text" name="nombre" id="nombre" value={item.nombre || ''}
                                   onChange={this.handleChange} autoComplete="nombre"/>
                        </FormGroup>
                        <FormGroup className="col-md-4 mb-3">
                            <Label for="barrio">Barrio</Label>
                            <Input readOnly type="text" name="barrio" id="barrio" value={item.barrio || ''}
                                   onChange={this.handleChange} autoComplete="barrio"/>
                        </FormGroup>
                        <FormGroup className="col-md-4 mb-3">
                            <Label for="telefono">Telefono</Label>
                            <Input readOnly type="text" name="telefono" id="telefono" value={item.telefono || ''}
                                   onChange={this.handleChange} autoComplete="telefono"/>
                        </FormGroup>
                    </div>
                    }
                    {clienteAux !== null &&
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="mail">Mail</Label>
                            <Input readOnly type="text" name="mail" id="mail" value={item.mail || ''}
                                   onChange={this.handleChange} autoComplete="mail"/>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="ubicacion">Ubicacion</Label>
                            <Input readOnly type="text" name="ubicacion" id="ubicacion" value={item.ubicacion || ''}
                                   onChange={this.handleChange} autoComplete="ubicacion"/>
                        </FormGroup>
                    </div>
                    }
                    {clienteAux !== null &&
                    <div>
                        <div className="row">
                            <FormGroup className="col-md-12 mb-3">
                                <Label for="descripcionTaller">Descripcion del Taller</Label>
                                <Input readOnly type="text" name="descripcionTaller" id="descripcionTaller"
                                       value={item.descripcionTaller || ''}
                                       onChange={this.handleChange} autoComplete="descripcionTaller"/>
                            </FormGroup>
                        </div>
                    </div>
                    }
                    {clienteAux !== null &&
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="marca">Marca</Label>
                            <Input readOnly type="text" name="marca" id="marca" value={item.marca.descripcion || ''}
                                   onChange={this.handleChange} autoComplete="mail"/>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="clasificacion">Especializacion</Label>
                            <Input readOnly type="text" name="clasificacion" id="clasificacion"
                                   value={item.clasificacion.descripcion || ''}
                                   onChange={this.handleChange} autoComplete="clasificacion"/>
                        </FormGroup>
                    </div>
                    }
                    {clienteAux !== null &&
                    <h2>Fecha de Reservación</h2>
                    }
                    {tallerAux !== null &&
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <h2>Fecha de Reservación</h2>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <h2>Fecha Devolución</h2>
                        </FormGroup>
                    </div>
                    }
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
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
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="Horario"
                            />
                            <br></br>
                            <span className="error">{this.state.errors["hora"]}</span>
                        </FormGroup>
                        {tallerAux !== null &&
                        <FormGroup className="col-md-6 mb-3">
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
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="Horario"
                            />
                        </FormGroup>
                        }
                        {clienteAux !== null &&
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="descripcionProblemaCliente">Descripcion del Problema</Label>
                            <textarea className="input-big" type="text" name="descripcionProblemaCliente"
                                      id="descripcionProblemaCliente"
                                      value={itemReparacion.descripcionProblemaCliente || ''}
                                      onChange={this.handleChange} autoComplete="descripcionProblemaCliente"/>
                        </FormGroup>
                        }
                    </div>
                    {tallerAux !== null &&
                    <h2>Datos del Auto</h2>
                    }
                    {tallerAux !== null &&
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="modeloAuto">Marca y Modelo del Auto</Label>
                            <Input type="text" name="modeloAuto" id="modeloAuto"
                                   value={itemReparacionTaller.modeloAuto || ''}
                                   onChange={this.handleChange} autoComplete="mail"/>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="patenteAuto">Patente del Auto</Label>
                            <Input type="text" name="patenteAuto" id="patenteAuto"
                                   value={itemReparacionTaller.patenteAuto || ''}
                                   onChange={this.handleChange} autoComplete="patenteAuto"/>
                        </FormGroup>
                    </div>
                    }
                    {tallerAux !== null &&
                    <h2>Información de la Reparación</h2>
                    }
                    {tallerAux !== null &&
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="descripcionProblemaTaller">Diagnostico del Taller</Label>
                            <textarea className="input-big" type="text" name="descripcionProblemaTaller"
                                      id="descripcionProblemaTaller"
                                      value={itemReparacionTaller.descripcionProblemaTaller || ''}
                                      onChange={this.handleChange} autoComplete="descripcionProblemaTaller"/>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="descripcionReparacion">Descripción de la Reparación</Label>
                            <textarea className="input-big" type="text" name="descripcionReparacion"
                                      id="descripcionReparacion"
                                      value={itemReparacionTaller.descripcionReparacion || ''}
                                      onChange={this.handleChange} autoComplete="descripcionReparacion"/>
                        </FormGroup>
                    </div>
                    }
                    {tallerAux !== null &&
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="estado">Estado</Label>
                            <br></br>
                            <div>
                                <select required="required" className="select" name="estadoReparacion"
                                        id="estadoReparacion"
                                        onChange={this.handleChange} autoComplete="estadoReparacion">
                                    <option value="" default>Seleccionar Estado...</option>
                                    {newOptionsEstados}
                                </select>
                            </div>
                            &nbsp;&nbsp;
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="importeTotal">Importe Total</Label>
                            <Input type="text" name="importeTotal" id="importeTotal"
                                   value={itemReparacionTaller.importeTotal || ''}
                                   onChange={this.handleChange} autoComplete="importeTotal"/>
                        </FormGroup>
                    </div>
                    }
                    {tallerAux !== null &&
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="cliente">Cliente</Label>
                            <Input readOnly type="text" name="cliente" id="cliente" value='Cliente Externo'
                                   onChange={this.handleChange} autoComplete="cliente"/>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="mecanico">Mecanico/s Asignados</Label>
                            <select multiple={true} /*disabled={true}*/ className="multi-select"
                                    name="mecanico" id="mecanico"
                                    onChange={this.handleMecanicos} autoComplete="mecanico">
                                {newOptionsMecanicos}
                            </select>
                        </FormGroup>
                        <br></br>
                        <br></br>
                    </div>
                    }
                    <FormGroup>
                        <Button color="primary" type="submit">Reservar</Button>{' '}
                        {clienteAux !== null &&
                        <Button color="secondary" tag={Link} to="/talleres">Cancelar</Button>
                        }
                        {tallerAux !== null &&
                        <Button color="secondary" tag={Link} to="/reparaciones">Cancelar</Button>
                        }
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(ReservacionScreen);