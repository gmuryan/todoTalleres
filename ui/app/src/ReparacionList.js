import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Label, Table} from 'reactstrap';
import TalleresNavbar from "./TalleresNavbar";
import {Link} from 'react-router-dom';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import './App.css';
import ClientesNavbar from "./ClientesNavbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ClipLoader from 'react-spinners/ClipLoader';
import {css} from "@emotion/core";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Typography from "@material-ui/core/Typography";

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    margin-top: 300px;
`;

class ReparacionList extends Component {

    constructor(props) {
        super(props);
        const taller = JSON.parse(localStorage.getItem("tallerUser"));
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (taller === null && cliente === null) {
            this.props.history.push('/');
            localStorage.clear();
        }
        this.state = {
            filtroFechaReservaDesde: null,
            filtroFechaReservaHasta: null,
            filtroFechaDevolucionDesde: null,
            filtroFechaDevolucionHasta: null,
            reparaciones: [],
            isLoading: true,
            fechaDevolucion: '',
            horaDevolucion: '',
            fechaReserva: '',
            horaReserva: '',
            importeTotal: '',
            estadoReparacion: '',
            descripcionProblema: '',
            descripcionReparacion: '',
            taller: '',
            cliente: '',
            estado: '',
            currentPage: 1,
            todosPerPage: 5
        };
        this.handleClick = this.handleClick.bind(this);
        this.remove = this.remove.bind(this);
    }

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    componentDidMount() {
        this.setState({isLoading: true});
        const taller = JSON.parse(localStorage.getItem("tallerUser"));
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (taller !== null || cliente !== null) {
            if (taller !== null) {
                fetch(`api/reparacionesTaller/${taller.idTaller}`)
                    .then(response => response.json())
                    .then(data => this.setState({reparaciones: data, isLoading: false}))
            }
            if (cliente !== null) {
                fetch(`api/reparacionesCliente/${cliente.idCliente}`)
                    .then(response => response.json())
                    .then(data => this.setState({reparaciones: data, isLoading: false}))
            }
        }
    }

    async remove(id) {
        await fetch(`/api/reparacion/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedReparaciones = [...this.state.reservas].filter(i => i.idReparacion !== id);
            this.setState({reparaciones: updatedReparaciones});
            this.dialogEliminado();
        });
    }

    async cancelarTurno(idReparacion) {
        await fetch(`/api/cancelarTurno/${idReparacion}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(idReparacion),
        });
        this.dialogCancelacionCorrecta();
    }

    dialogCancelacionCorrecta() {
        confirmAlert({
            title: 'Operacion Exitosa',
            buttons: [
                {
                    label: 'Aceptar',
                    onClick: () => window.location.reload()
                }
            ]
        })
    }

    dialogCancelarTurno(idReparacion) {
        confirmAlert({
            title: 'Confirmar',
            message: 'Esta seguro de realizar esta accion?',
            buttons: [
                {
                    label: 'Si',
                    onClick: () => this.cancelarTurno(idReparacion)
                },
                {
                    label: 'No'
                }
            ]
        })
    }

    filterEstado = e => {
        this.setState({estado: e.target.value});
    }

    filterFechaReservaDesde(date) {
        this.setState({filtroFechaReservaDesde: date});
    }

    filterFechaReservaHasta(date) {
        this.setState({filtroFechaReservaHasta: date})
    }

    filterFechaDevolucionDesde(date) {
        this.setState({filtroFechaDevolucionDesde: date})
    }

    filterFechaDevolucionHasta(date) {
        this.setState({filtroFechaDevolucionHasta: date})
    }

    esFechaReservaMenor(value) {
        let fechaSeparada = value.split("-");
        let fechaReOrdenada = fechaSeparada[2] + "-" + fechaSeparada[1] + "-" + fechaSeparada[0];
        return this.state.filtroFechaReservaDesde - Date.parse(fechaReOrdenada) < 0;
    }

    esFechaReservaMayor(value) {
        let fechaSeparada = value.split("-");
        let fechaReOrdenada = fechaSeparada[2] + "-" + fechaSeparada[1] + "-" + fechaSeparada[0];
        return this.state.filtroFechaReservaHasta - Date.parse(fechaReOrdenada) > 0;
    }

    esFechaDevolucionMenor(value) {
        if (value !== "0") {
            let fechaSeparada = value.split("-");
            let fechaReOrdenada = fechaSeparada[2] + "-" + fechaSeparada[1] + "-" + fechaSeparada[0];
            return this.state.filtroFechaDevolucionDesde - Date.parse(fechaReOrdenada) < 0;
        } else {
            return false;
        }
    }


    esFechaDevolucionMayor(value) {
        if (value !== "0") {
            let fechaSeparada = value.split("-");
            let fechaReOrdenada = fechaSeparada[2] + "-" + fechaSeparada[1] + "-" + fechaSeparada[0];
            return this.state.filtroFechaDevolucionHasta - Date.parse(fechaReOrdenada) > 0;
        } else {
            return false;
        }
    }

    render() {
        const {reparaciones, isLoading, fechaDevolucion, horaDevolucion, fechaReserva, horaReserva, importeTotal, estadoReparacion, descripcionProblema, descripcionReparacion, taller, cliente, currentPage, todosPerPage, estado} = this.state;
        const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
        const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
        const classes = {
            textField: {
                width: 200,
            },
        };
        let filterReparaciones = this.state.reparaciones.slice();
        if (this.state.estado) {
            filterReparaciones = filterReparaciones.filter(reparacion => reparacion.estadoReparacion.descripcion.toLowerCase().indexOf(estado.toLowerCase()) !== -1);
        }
        if (this.state.filtroFechaReservaDesde) {
            filterReparaciones = filterReparaciones.filter(reparacion => this.esFechaReservaMenor(reparacion.fechaReserva));
        }
        if (this.state.filtroFechaReservaHasta) {
            filterReparaciones = filterReparaciones.filter(reparacion => this.esFechaReservaMayor(reparacion.fechaReserva));
        }
        if (this.state.filtroFechaDevolucionDesde) {
            filterReparaciones = filterReparaciones.filter(reparacion => this.esFechaDevolucionMenor(reparacion.fechaDevolucion ? reparacion.fechaDevolucion : "0"));
        }
        if (this.state.filtroFechaDevolucionHasta) {
            filterReparaciones = filterReparaciones.filter(reparacion => this.esFechaDevolucionMayor(reparacion.fechaDevolucion ? reparacion.fechaDevolucion : "0"));
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

        // Logic for displaying current todos
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = filterReparaciones.slice(indexOfFirstTodo, indexOfLastTodo);

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(reparaciones.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    key={number}
                    id={number}
                    onClick={this.handleClick}
                >
                    [{number}]
                </li>
            );
        });

        const reparacionesList = currentTodos.map(reparacion => {
            return <tr key={reparacion.idReparacion}>
                <td>{reparacion.idReparacion}</td>
                <td>{reparacion.fechaReserva}</td>
                <td style={{whiteSpace: 'nowrap'}}>{reparacion.horaReserva.substring(0, 5)}</td>
                <td>{reparacion.fechaDevolucion}</td>
                <td>{reparacion.horaDevolucion ? reparacion.horaDevolucion.substring(0, 5) : reparacion.horaDevolucion}</td>
                <td>{reparacion.estadoReparacion.descripcion}</td>
                {reparacion.importeTotal &&
                <td> ${new Intl.NumberFormat('de-DE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(reparacion.importeTotal)}</td>
                }
                {!reparacion.importeTotal &&
                <td>{reparacion.importeTotal}</td>
                }
                {tallerUser !== null &&
                <td>{reparacion.cliente.nombre + " " + reparacion.cliente.apellido}</td>
                }
                {clienteUser !== null &&
                <td>{reparacion.taller.nombre}</td>
                }
                <td>
                    <ButtonGroup>
                        {tallerUser !== null &&
                        <Button size="sm" color="primary" tag={Link}
                                to={"/reparaciones/" + reparacion.idReparacion}>Editar</Button>
                        }
                        {clienteUser !== null &&
                        <Button size="sm" color="info" tag={Link}
                                to={"/reparaciones/" + reparacion.idReparacion}>Ver más</Button>
                        }
                        &nbsp;&nbsp;
                        {reparacion.estadoReparacion.descripcion !== "Cancelado" &&
                        <Button size="sm" color="danger"
                                onClick={() => this.dialogCancelarTurno(reparacion.idReparacion)}>Cancelar
                            Turno</Button>
                        }
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                {clienteUser !== null &&
                <ClientesNavbar/>
                }
                {tallerUser !== null &&
                <TalleresNavbar/>
                }
                <Container fluid>
                    {tallerUser !== null &&
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/reservacion/new">Crear Reparacion</Button>
                    </div>
                    }
                    <Typography variant="h4">
                        Reparaciones
                    </Typography>
                    {/*<input type="text" onChange={this.filterEstado} placeholder="Estado..."></input>*/}
                    <TextField
                        id="standard-basic"
                        className={classes.textField}
                        label="Estado"
                        margin="normal"
                        onChange={this.filterEstado}
                    />
                    &nbsp;&nbsp;
                    &nbsp;&nbsp;
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Fecha Reserva Desde"
                            value={this.state.filtroFechaReservaDesde}
                            onChange={(date) => this.filterFechaReservaDesde(date)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        &nbsp;&nbsp;
                        &nbsp;&nbsp;
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Fecha Reserva Hasta"
                            value={this.state.filtroFechaReservaHasta}
                            onChange={(date) => this.filterFechaReservaHasta(date)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        &nbsp;&nbsp;
                        &nbsp;&nbsp;
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Fecha Devolución Desde"
                            value={this.state.filtroFechaDevolucionDesde}
                            onChange={(date) => this.filterFechaDevolucionDesde(date)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        &nbsp;&nbsp;
                        &nbsp;&nbsp;
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Fecha Devolución Hasta"
                            value={this.state.filtroFechaDevolucionHasta}
                            onChange={(date) => this.filterFechaDevolucionHasta(date)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>

                    {/*<DatePicker placeholderText="Fecha Reserva Desde" dateFormat="dd/MM/yyyy"*/}
                    {/*            selected={this.state.filtroFechaReservaDesde}*/}
                    {/*            onChange={(date) => this.filterFechaReservaDesde(date)}/>*/}
                    {/*&nbsp;&nbsp;*/}
                    {/*<DatePicker placeholderText="Fecha Reserva Hasta" dateFormat="dd/MM/yyyy"*/}
                    {/*            selected={this.state.filtroFechaReservaHasta}*/}
                    {/*            onChange={(date) => this.filterFechaReservaHasta(date)}/>*/}
                    {/*&nbsp;&nbsp;*/}
                    {/*<DatePicker placeholderText="Fecha Devolución Desde" dateFormat="dd/MM/yyyy"*/}
                    {/*            selected={this.state.filtroFechaDevolucionDesde}*/}
                    {/*            onChange={(date) => this.filterFechaDevolucionDesde(date)}/>*/}
                    {/*&nbsp;&nbsp;*/}
                    {/*<DatePicker placeholderText="Fecha Devolución Hasta" dateFormat="dd/MM/yyyy"*/}
                    {/*            selected={this.state.filtroFechaDevolucionHasta}*/}
                    {/*            onChange={(date) => this.filterFechaDevolucionHasta(date)}/>*/}
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="5%">ID</th>
                            <th width="10%">Fecha Reserva</th>
                            <th width="10%">Horario Reserva</th>
                            <th width="10%">Fecha Devolución</th>
                            <th width="10%">Horario Devolución</th>
                            <th width="10%">Estado</th>
                            <th width="10%">Importe</th>
                            {tallerUser !== null &&
                            <th width="10%">Cliente</th>
                            }
                            {clienteUser !== null &&
                            <th width="10%">Taller</th>
                            }
                            <th width="10%">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reparacionesList}
                        </tbody>
                    </Table>
                    <ul id="page-numbers">
                        <Label>Paginas:</Label>
                        <span>&nbsp;&nbsp;</span>
                        {renderPageNumbers}
                    </ul>
                </Container>
            </div>
        );
    }
}

export default ReparacionList