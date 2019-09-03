import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
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
            formIsValid: true,
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

    handleValidation() {
        let fields = this.state.item;
        let errors = {};
        this.setState({formIsValid: true});

        //Name
        if (fields["nombre"].length === 0) {
            this.setState({formIsValid: false});
            errors["nombre"] = "No puede estar vacio";
        } else if (typeof fields["nombre"] !== "undefined") {
            if (!fields["nombre"].match(/^[a-zA-Z]+$/)) {
                this.setState({formIsValid: false});
                errors["nombre"] = "Solo letras";
            }
        }

        //Apellido
        if (fields["apellido"].length === 0) {
            this.setState({formIsValid: false});
            errors["apellido"] = "No puede estar vacio";
        } else if (typeof fields["apellido"] !== "undefined") {
            if (!fields["apellido"].match(/^[a-zA-Z]+$/)) {
                this.setState({formIsValid: false});
                errors["apellido"] = "Solo letras";
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
                console.log("aca");
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
                    onClick: () => this.props.history.push('/clientes')
                }
            ]
        })
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.handleValidation().then((result) => {
            if (this.state.formIsValid) {
                const {item} = this.state;

                fetch('/api/cliente', {
                    method: (item.idCliente) ? 'PUT' : 'POST',
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
        const {item} = this.state;
        const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
        const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
        const title = <h2>Detalles de la Reparacion</h2>;

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
                            <Input readOnly={clienteUser} type="text" name="modeloAuto" id="modeloAuto"
                                   value={item.modeloAuto || ''}
                                   onChange={this.handleChange} autoComplete="modeloAuto"/>
                            <span className="error">{this.state.errors["modeloAuto"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="patenteAuto">Patente Auto</Label>
                            <Input readOnly={clienteUser} type="text" name="patenteAuto" id="patenteAuto"
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
                            <Input readOnly={clienteUser} type="text" name="fechaDevolucion" id="fechaDevolucion"
                                   value={item.fechaDevolucion || ''}
                                   onChange={this.handleChange} autoComplete="fechaDevolucion"/>
                            <span className="error">{this.state.errors["fechaDevolucion"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="horaDevolucion">Hora Devolucion</Label>
                            <Input readOnly={clienteUser} type="text" name="horaDevolucion" id="horaDevolucion"
                                   value={item.horaDevolucion || ''}
                                   onChange={this.handleChange} autoComplete="horaDevolucion"/>
                            <span className="error">{this.state.errors["horaDevolucion"]}</span>
                        </FormGroup>
                    </div>
                    }
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="importeTotal">Importe</Label>
                            <Input readOnly={clienteUser} type="text" name="importeTotal" id="importeTotal"
                                   value={item.importeTotal || ''}
                                   onChange={this.handleChange} autoComplete="importeTotal"/>
                            <span className="error">{this.state.errors["importeTotal"]}</span>
                        </FormGroup>
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
                            <textarea readOnly className="input-big" type="text" name="descripcionProblemaCliente"
                                      id="descripcionProblemaCliente"
                                      value={item.descripcionProblemaCliente || ''}
                                      onChange={this.handleChange} autoComplete="descripcionProblemaCliente"/>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="descripcionProblemaTaller">Diagnostico del Taller</Label>
                            <textarea readOnly={clienteUser} className="input-big" type="text"
                                      name="descripcionProblemaTaller"
                                      id="descripcionProblemaTaller"
                                      value={item.descripcionProblemaTaller || ''}
                                      onChange={this.handleChange} autoComplete="descripcionProblemaTaller"/>
                        </FormGroup>
                    </div>
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="descripcionReparacion">Reparaciones Realizadas</Label>
                            <textarea readOnly={clienteUser} className="input-big" type="text"
                                      name="descripcionReparacion"
                                      id="descripcionReparacion"
                                      value={item.descripcionReparacion || ''}
                                      onChange={this.handleChange} autoComplete="descripcionReparacion"/>
                        </FormGroup>
                        {tallerUser !== null && item.fechaDevolucion === null && item.horaDevolucion === null &&
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
                    <FormGroup>
                        <Button color="primary" type="submit">Guardar</Button>{' '}
                        <Button color="secondary" tag={Link} to="/reparaciones">Cancelar</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(ReparacionEdit);