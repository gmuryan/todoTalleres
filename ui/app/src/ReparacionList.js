import React, {Component} from 'react';
import {Container} from 'reactstrap';
import TalleresNavbar from "./TalleresNavbar";
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import './App.css';
import ClientesNavbar from "./ClientesNavbar";
import "react-datepicker/dist/react-datepicker.css";
import ClipLoader from 'react-spinners/ClipLoader';
import {css} from "@emotion/core";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Typography from "@material-ui/core/Typography";
import ReparacionesEnhancedTable from "./ReparacionesSortableTable";
import Button from '@material-ui/core/Button';


const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    margin-top: 350px;
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
            estado: ''
        };
        this.handleClick = this.handleClick.bind(this);
        this.dialogCancelarTurno = this.dialogCancelarTurno.bind(this);
        this.edit = this.edit.bind(this);
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
            title: 'Operación Exitosa',
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
            message: '¿Esta seguro de realizar esta acción?',
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

    edit(idReparacion) {
        this.props.history.push('/reparaciones/' + idReparacion);
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
        const {isLoading, estado} = this.state;
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
                        <Button type="button" variant="contained" color="primary" className={classes.button} onClick={() => this.props.history.push('/reservacion/new')}>
                            Crear Reparación
                        </Button>
                    </div>
                    }
                    <Typography variant="h4">
                        Reparaciones
                    </Typography>
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

                    <ReparacionesEnhancedTable rows={filterReparaciones} cancelarTurno={this.dialogCancelarTurno}
                                               clienteUser={clienteUser} tallerUser={tallerUser} editar={this.edit} acciones={true}/>
                </Container>
            </div>
        );
    }
}

export default ReparacionList