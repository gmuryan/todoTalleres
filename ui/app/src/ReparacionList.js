import React, {Component} from 'react';
import {Container} from 'reactstrap';
import TalleresNavbar from "./TalleresNavbar";
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
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";


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
            errors: {},
            isLoading: true,
            fechaDevolucion: '',
            horaDevolucion: '',
            fechaReserva: '',
            horaReserva: '',
            importeTotal: '',
            estadoReparacion: '',
            descripcionProblema: '',
            descripcionReparacion: '',
            motivoCancelacion: '',
            taller: '',
            cliente: '',
            estado: '',
            id: '',
            activeId: '',
            openDialogCancelar: false,
            openDialogCanceladoExito: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.dialogCancelarTurno = this.dialogCancelarTurno.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.edit = this.edit.bind(this);
        this.remove = this.remove.bind(this);
    }

    handleClose(event) {
        this.setState({
            openDialogCancelar: false,
            openDialogCanceladoExito: false
        });
    }

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    handleChange(event) {
        this.setState({motivoCancelacion: event.target.value});
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

    handleValidation() {
        let errors = {};
        let formIsValid = true;

        //Contraseña
        if (!this.state.motivoCancelacion) {
            formIsValid = false;
            errors["motivo"] = "No puede estar vacío";
        }

        this.setState({errors: errors});
        return formIsValid;
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
        if (this.handleValidation()) {
            const cliente = JSON.parse(localStorage.getItem("clienteUser"));
            const canceladoPorTaller = cliente === null;
            await fetch(`/api/cancelarTurno?id=${encodeURIComponent(idReparacion)}&motivo=${encodeURIComponent(this.state.motivoCancelacion)}&canceladoPorTaller=${encodeURIComponent(canceladoPorTaller)}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            this.dialogCancelacionCorrecta();
        }
    }

    dialogCancelacionCorrecta() {
        this.setState({openDialogCancelar: false, openDialogCanceladoExito: true});
    }

    dialogCancelarTurno(idReparacion) {
        this.setState({openDialogCancelar: true, activeId: idReparacion});
    }

    edit(idReparacion) {
        this.props.history.push('/reparaciones/' + idReparacion);
    }

    filterEstado = e => {
        this.setState({estado: e.target.value});
    }

    filterId = e => {
        this.setState({id: e.target.value});
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
        const {isLoading, estado, id} = this.state;
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
        if (this.state.id) {
            filterReparaciones = filterReparaciones.filter(reparacion => reparacion.idReparacion.toString().indexOf(id) !== -1);
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
                    <div>
                        <Dialog
                            open={this.state.openDialogCanceladoExito}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Operación Exitosa"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Turno cancelado correctamente.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => window.location.reload()} color="primary">
                                    Aceptar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div>
                        <Dialog
                            open={this.state.openDialogCancelar}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Confirmar"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Ingrese el motivo de la cancelación:
                                </DialogContentText>
                                <TextField
                                    autoFocus
                                    multiline
                                    rows="4"
                                    required
                                    variant="outlined"
                                    id="motivoCancelacion"
                                    name="motivoCancelacion"
                                    label="Motivo"
                                    onChange={this.handleChange}
                                    value={this.state.motivoCancelacion}
                                    type="text"
                                    error={this.state.errors["motivo"]}
                                    helperText={this.state.errors["motivo"]}
                                    fullWidth
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => this.cancelarTurno(this.state.activeId)} color="primary">
                                    Aceptar
                                </Button>
                                <Button onClick={this.handleClose} color="primary">
                                    Cancelar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    {tallerUser !== null &&
                    <div className="float-right">
                        <Button type="button" variant="contained" color="primary" className={classes.button}
                                onClick={() => this.props.history.push('/reservacion/new')}>
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
                        label="ID"
                        margin="normal"
                        style={{width: 75}}
                        onChange={this.filterId}
                    />
                    &nbsp;&nbsp;
                    &nbsp;&nbsp;
                    <TextField
                        id="standard-basic"
                        className={classes.textField}
                        label="Estado"
                        margin="normal"
                        style={{width: 150}}
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
                            style={{width: 210}}
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
                            style={{width: 210}}
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
                            style={{width: 230}}
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
                            style={{width: 230}}
                            onChange={(date) => this.filterFechaDevolucionHasta(date)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>

                    <ReparacionesEnhancedTable rows={filterReparaciones} cancelarTurno={this.dialogCancelarTurno}
                                               clienteUser={clienteUser} tallerUser={tallerUser} editar={this.edit}
                                               acciones={true}/>
                </Container>
            </div>
        );
    }
}

export default ReparacionList