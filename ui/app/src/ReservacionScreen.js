import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'

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

    emptyReparaciom = {
        fechaReserva: '',
        horaReserva: '',
        descripcionProblemaCliente: '',
        taller: '',
        cliente: ''
    }


    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            itemReparacion: this.emptyReparaciom,
            errors: {},
            // formIsValid: true,
            startDate: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (cliente === null) {
            localStorage.clear();
            this.props.history.push('/');
        }
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const taller = await (await fetch(`/api/taller/${this.props.match.params.id}`)).json();
            this.setState({item: taller});
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let itemReparacion = {...this.state.itemReparacion};
        itemReparacion[name] = value;
        this.setState({itemReparacion});
    }

    handleDate(date) {
        this.setState({
            startDate: date
        });
    }


    handleValidation() {
        let fields = this.state.item;
        let errors = {};
        let formIsValid = true;
        let diaActual = new Date();
        // this.setState({formIsValid: true});
        //QUERY PARA VALIDACION DE AUTOS
        //select count(*) from reparacion where (fecha_devolucion >= ?1 and hora_devolucion > ?2 and id_estado = EN_REPARACION and id_taller = ?3)
        //or (fecha_reserva == ?1 and hora_reserva == ?2 and id_taller = ?3 and id_estado = DIAGNOSTICO)
        //QUERY PARA VALIDACION DE MECANICOS DISPONIBLES
        //select * from reparacion r
        // inner join reparacion_mecanicos rm ON r.id_reparacion = rm.id_reparacion
        // outer join mecanico m ON rm.id_mecanico = m.id_mecanico
        // where id_estado = EN_REPARACON and id_taller = ?1 and fecha_devolucion >= ?2 and hora_devolucion > ?3
        if (diaActual.getDate() === this.state.startDate.getDate() && diaActual.getMonth() === this.state.startDate.getMonth() && diaActual.getTime() > this.state.startDate.getTime()) {
            formIsValid = false;
            errors["hora"] = "Horario Invalido";
        }
        this.setState({errors: errors});
        return formIsValid;
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

        if (this.handleValidation()) {
            const {itemReparacion} = this.state;
            itemReparacion.fechaReserva = this.state.startDate.getDate() + "-" + this.state.startDate.getMonth() + "-" + this.state.startDate.getFullYear();
            itemReparacion.horaReserva = this.state.startDate.getHours() + ":" + this.state.startDate.getMinutes() + "0";

            fetch('/api/reparacion', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemReparacion),
            });
            console.log(this.state.itemReparacion);
            this.dialogCreado();
        }
    }

    isWeekday(date) {
        const day = date.getDay();
        return day !== 0 && day !== 6
    }

    render() {
        const {item, itemReparacion} = this.state;
        const clienteAux = JSON.parse(localStorage.getItem("clienteUser"));
        itemReparacion.cliente = JSON.stringify(clienteAux);
        itemReparacion.taller = this.state.item;
        const title = <h2>Información del Taller</h2>;
        const title2 = <h2>Fecha de Reservacion</h2>

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
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
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="marca">Marca</Label>
                            <Input readOnly type="text" name="marca" id="marca" value={item.marca.descripcion || ''}
                                   onChange={this.handleChange} autoComplete="mail"/>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="clasificacion">Clasificacion</Label>
                            <Input readOnly type="text" name="clasificacion" id="clasificacion"
                                   value={item.clasificacion.descripcion || ''}
                                   onChange={this.handleChange} autoComplete="clasificacion"/>
                        </FormGroup>
                    </div>
                    {title2}
                    <br></br>
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
                            <span className="error">{this.state.errors["hora"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="descripcionProblemaCliente">Descripcion del Problema</Label>
                            <textarea className="input-big" type="text" name="descripcionProblemaCliente"
                                      id="descripcionProblemaCliente"
                                      value={itemReparacion.descripcionProblemaCliente || ''}
                                      onChange={this.handleChange} autoComplete="descripcionProblemaCliente"/>
                        </FormGroup>
                    </div>
                    <br></br>
                    <FormGroup>
                        <Button color="primary" type="submit">Reservar</Button>{' '}
                        <Button color="secondary" tag={Link} to="/talleres">Cancelar</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(ReservacionScreen);