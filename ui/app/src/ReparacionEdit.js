import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {confirmAlert} from "react-confirm-alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import TalleresNavbar from "./TalleresNavbar";
import ClientesNavbar from "./ClientesNavbar";

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
        modeloAuto: ''
    };


    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            errors: {},
            flagImporte: false,
            endDate: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        const taller = JSON.parse(localStorage.getItem("tallerUser"));
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (taller === null && cliente === null) {
            this.props.history.push('/');
            localStorage.clear();
        }
    }

    async componentDidMount() {
        const reparacion = await (await fetch(`/api/reparacion/${this.props.match.params.id}`)).json();
        this.setState({item: reparacion});
        if (this.state.item.importeTotal !== null)
            this.setState({flagImporte: true});
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    handleDate(date) {
        this.setState({
            endDate: date
        });
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

        if (fields["estadoReparacion"].descripcion === "Pendiente Diagnostico"){
            if (fields["modeloAuto"].length === 0){
                formIsValid = false;
                errors["modeloAuto"] = "No puede estar vacio";
            }
            if (fields["patenteAuto"].length === 0){
                formIsValid = false;
                errors["patenteAuto"] = "No puede estar vacio";
            }
        }

        if (fields["estadoReparacion"].descripcion === "En diagnostico"){
            if (fields["importeTotal"] === null || fields["importeTotal"] === ''){
                formIsValid = false;
                errors["importeTotal"] = "No puede estar vacio";
            }
            if (fields["descripcionProblemaTaller"] === null || fields["descripcionProblemaTaller"] === ''){
                formIsValid = false;
                errors["descripcionProblemaTaller"] = "No puede estar vacio";
            }
            if (this.state.endDate != null) {
                if (diaActual.getDate() === this.state.endDate.getDate() && diaActual.getMonth() === this.state.endDate.getMonth() && diaActual.getTime() > this.state.endDate.getTime()) {
                    formIsValid = false;
                    errors["hora"] = "Horario Invalido";
                } else if (this.state.endDate.getHours() === 0) {
                    formIsValid = false;
                    errors["hora"] = "Debe seleccionar una hora";
                }
            } else {
                formIsValid = false;
                errors["hora"] = "Debe seleccionar una fecha y hora";
            }
        }

        if (fields["estadoReparacion"].descripcion === "En reparacion"){
            if (fields["descripcionProblemaTaller"] === null || fields["descripcionProblemaTaller"] === ''){
                formIsValid = false;
                errors["descripcionProblemaTaller"] = "No puede estar vacio";
            }
            if (fields["descripcionReparacion"] === null || fields["descripcionReparacion"] === ''){
                formIsValid = false;
                errors["descripcionReparacion"] = "No puede estar vacio";
            }
        }


        this.setState({errors: errors});
        return formIsValid;
    }


    isWeekday(date) {
        const day = date.getDay();
        return day !== 0 && day !== 6
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
                if (this.state.endDate.getHours() === 9){
                    item.horaDevolucion = "0" + this.state.startDate.getHours() + ":" + this.state.startDate.getMinutes() + "0";
                }else{
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
        const {item, flagImporte} = this.state;
        const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
        const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
        const title = <h2>Detalles de la Reparacion</h2>;
        const descEstado = item.estadoReparacion.descripcion;
        const mecanicoList = item.mecanicos.map(mecanico =>{
            return <tr key={mecanico.idMecanico}>
                <td>{mecanico.idMecanico}</td>
                <td style={{whiteSpace: 'nowrap'}}>{mecanico.nombre}</td>
                <td>{mecanico.apellido}</td>
                <td>{mecanico.telefono}</td>
                <td>{mecanico.mail}</td>
            </tr>
        });
        return <div>
            {tallerUser !== null &&
            <TalleresNavbar/>
            }
            {clienteUser !== null &&
            <ClientesNavbar/>
            }
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="modeloAuto">Modelo Auto</Label>
                            <Input
                                readOnly={clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Confirmacion" || descEstado === "En diagnostico" || descEstado === "En reparacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado"}
                                type="text" name="modeloAuto"
                                id="modeloAuto"
                                value={item.modeloAuto || ''}
                                onChange={this.handleChange} autoComplete="modeloAuto"/>
                            <span className="error">{this.state.errors["modeloAuto"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="patenteAuto">Patente Auto</Label>
                            <Input
                                readOnly={clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Confirmacion" || descEstado === "En diagnostico" || descEstado === "En reparacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado"}
                                type="text" name="patenteAuto"
                                id="patenteAuto"
                                value={item.patenteAuto || ''}
                                onChange={this.handleChange} autoComplete="patenteAuto"/>
                            <span className="error">{this.state.errors["patenteAuto"]}</span>
                        </FormGroup>
                    </div>
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="fechaReserva">Fecha Reserva</Label>
                            <Input readOnly type="text" name="fechaReserva" id="fechaReserva"
                                   value={item.fechaReserva || ''}
                                   onChange={this.handleChange} autoComplete="fechaReserva"/>
                            <span className="error">{this.state.errors["fechaReserva"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="horaReserva">Hora Reserva</Label>
                            <Input readOnly type="text" name="horaReserva" id="horaReserva"
                                   value={item.horaReserva || ''}
                                   onChange={this.handleChange} autoComplete="horaReserva"/>
                            <span className="error">{this.state.errors["horaReserva"]}</span>
                        </FormGroup>
                    </div>
                    {clienteUser !== null || tallerUser !== null && item.fechaDevolucion !== null && item.horaDevolucion !== null &&
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="fechaDevolucion">Fecha Devolucion</Label>
                            <Input
                                readOnly={clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Confirmacion" || descEstado === "En reparacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado"}
                                type="text"
                                name="fechaDevolucion" id="fechaDevolucion"
                                value={item.fechaDevolucion || ''}
                                onChange={this.handleChange} autoComplete="fechaDevolucion"/>
                            <span className="error">{this.state.errors["fechaDevolucion"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="horaDevolucion">Hora Devolucion</Label>
                            <Input
                                readOnly={clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Confirmacion" || descEstado === "En reparacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado"}
                                type="text"
                                name="horaDevolucion" id="horaDevolucion"
                                value={item.horaDevolucion || ''}
                                onChange={this.handleChange} autoComplete="horaDevolucion"/>
                            <span className="error">{this.state.errors["horaDevolucion"]}</span>
                        </FormGroup>
                    </div>
                    }
                    <div className="row">
                        {this.state.flagImporte &&
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="importeTotal">Importe</Label>
                            <Input
                                readOnly={clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Diagnostico" || descEstado === "Pendiente Confirmacion" || descEstado === "En reparacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado"}
                                type="text" name="importeTotal" id="importeTotal"
                                value={item.importeTotal ? "$" + this.toCurrency(item.importeTotal) : ''}
                                onChange={this.handleChange} autoComplete="importeTotal"/>
                            <span className="error">{this.state.errors["importeTotal"]}</span>
                        </FormGroup>
                        }
                        {!this.state.flagImporte &&
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="importeTotal">Importe</Label>
                            <Input
                                readOnly={clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Diagnostico" || descEstado === "Pendiente Confirmacion" || descEstado === "En reparacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado"}
                                type="text" name="importeTotal" id="importeTotal"
                                value={item.importeTotal || ''}
                                onChange={this.handleChange} autoComplete="importeTotal"/>
                            <span className="error">{this.state.errors["importeTotal"]}</span>
                        </FormGroup>
                        }
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="estadoReparacion">Estado</Label>
                            <Input readOnly type="text" name="estadoReparacion" id="estadoReparacion"
                                   value={item.estadoReparacion.descripcion || ''}
                                   onChange={this.handleChange} autoComplete="estadoReparacion"/>
                            <span className="error">{this.state.errors["estadoReparacion"]}</span>
                        </FormGroup>
                    </div>
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="descripcionProblemaCliente">Descripcion del problema del cliente</Label>
                            <textarea readOnly className="input-big-readOnly" type="text"
                                      name="descripcionProblemaCliente"
                                      id="descripcionProblemaCliente"
                                      value={item.descripcionProblemaCliente || ''}
                                      onChange={this.handleChange} autoComplete="descripcionProblemaCliente"/>
                            <span className="error">{this.state.errors["descripcionProblemaCliente"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="descripcionProblemaTaller">Diagnostico del Taller</Label>
                            <textarea
                                readOnly={clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Diagnostico" || descEstado === "Pendiente Confirmacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado"}
                                className={clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Diagnostico" || descEstado === "Pendiente Confirmacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado" ? "input-big-readOnly" : "input-big"}
                                type="text"
                                name="descripcionProblemaTaller"
                                id="descripcionProblemaTaller"
                                value={item.descripcionProblemaTaller || ''}
                                onChange={this.handleChange} autoComplete="descripcionProblemaTaller"/>
                            <span className="error">{this.state.errors["descripcionProblemaTaller"]}</span>
                        </FormGroup>
                    </div>
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="descripcionReparacion">Reparaciones Realizadas</Label>
                            <textarea
                                readOnly={clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Diagnostico" || descEstado === "En diagnostico" || descEstado === "Pendiente Confirmacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado"}
                                className={clienteUser || descEstado === "Cancelado" || descEstado === "Pendiente Diagnostico" || descEstado === "En diagnostico" || descEstado === "Pendiente Confirmacion" || descEstado === "Listo para retirar" || descEstado === "Finalizado" ? "input-big-readOnly" : "input-big"}
                                type="text"
                                name="descripcionReparacion"
                                id="descripcionReparacion"
                                value={item.descripcionReparacion || ''}
                                onChange={this.handleChange} autoComplete="descripcionReparacion"/>
                            <span className="error">{this.state.errors["descripcionReparacion"]}</span>
                        </FormGroup>
                        {tallerUser !== null && item.fechaDevolucion === null && item.horaDevolucion === null && descEstado !== "Cancelado" && descEstado !== "Pendiente Diagnostico" &&
                        <FormGroup className="col-md-6 mb-3">
                            <div>
                                <Label for="fechaHoraDevolucion">Fecha y hora de devolucion</Label>
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
                                dateFormat="MMMM d, yyyy h:mm aa"
                                timeCaption="Horario"
                            />
                            <br></br>
                            <span className="error">{this.state.errors["hora"]}</span>
                        </FormGroup>
                        }
                    </div>
                    {tallerUser !== null &&
                    <h3> Mecanicos asignados</h3>
                    }
                    {tallerUser !== null &&
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="20%">ID</th>
                            <th width="20%">Nombre</th>
                            <th width="20%">Apellido</th>
                            <th width="20%">Telefono</th>
                            <th width="20%">Mail</th>
                            <th width="10%">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {mecanicoList}
                        </tbody>
                    </Table>
                    }
                    {tallerUser !== null &&
                    <br></br>
                    }
                    {tallerUser !== null &&
                    <br></br>
                    }
                    <FormGroup>
                        {tallerUser !== null && descEstado !== "Pendiente Confirmacion" && descEstado !== "Finalizado" && descEstado !== "Cancelado" &&
                        <Button color="primary" type="submit">Guardar</Button>
                        }{' '}
                        <Button color="secondary" tag={Link} to="/reparaciones">Cancelar</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(ReparacionEdit);