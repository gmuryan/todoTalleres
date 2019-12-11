import React, {Component} from 'react';
import './App.css';
import TalleresNavbar from './TalleresNavbar';
import {withRouter} from 'react-router-dom';
import {Container, Form} from 'reactstrap';
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import {Bar} from 'react-chartjs-2';
import {Pie} from 'react-chartjs-2';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";


class HomeTaller extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalesFacturacion: [],
            totalesReparaciones: [],
            nombresMecanicos: [],
            reparacionesMes: [],
            flagGrafico: false,
            mes: ''
        };
        this.handleChange = this.handleChange.bind(this);
        const taller = JSON.parse(localStorage.getItem("tallerUser"));
        console.log(taller);
        if (taller === null) {
            localStorage.clear();
            this.props.history.push('/');
        }
    }

    async handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        if (name === "mes"){
            this.setState({mes: value});
        }
        if (value !== null) {
            const taller = JSON.parse(localStorage.getItem("tallerUser"));
            const reps = await (await fetch(`/api/analyticsMecanicosReparaciones?id=${encodeURIComponent(taller.idTaller)}&mesString=${encodeURIComponent(value)}`)).json();
            this.setState({reparacionesMes: reps});
            const nombresMecanicos = await (await fetch(`/api/analyticsNombresMecanicos/${taller.idTaller}`)).json();
            this.setState({nombresMecanicos: nombresMecanicos});
            this.setState({flagGrafico: true});
        }
    }

    async componentDidMount() {
        const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
        if (tallerUser !== null) {
            const totalesFacturacion = await (await fetch(`/api/analyticsFacturacion/${tallerUser.idTaller}`)).json();
            this.setState({totalesFacturacion: totalesFacturacion});
            const totalesReparaciones = await (await fetch(`/api/analyticsReparaciones/${tallerUser.idTaller}`)).json();
            this.setState({totalesReparaciones: totalesReparaciones});
        }
    }

    render() {
        const dataFacturacion = {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [
                {
                    label: 'Facturación mensual proyectada',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: this.state.totalesFacturacion
                }
            ]

        };
        const dataReparaciones = {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            datasets: [
                {
                    label: 'Reparaciones mensuales proyectadas',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: this.state.totalesReparaciones
                }
            ]

        };
        const data = {
            labels: this.state.nombresMecanicos,
            datasets: [{
                data: this.state.reparacionesMes,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#65fff0',
                    '#53ff17',
                    '#ff1de3',
                    '#8376ff'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#65fff0',
                    '#53ff17',
                    '#ff1de3',
                    '#8376ff'
                ]
            }]
        };
        return (
            <div>
                <TalleresNavbar/>
                <Container fluid>
                    <div>
                        <Typography variant="h4">
                            Reparaciones 2019
                        </Typography>
                        <div style={{height: '250px'}}>
                            <Bar
                                data={dataFacturacion}
                                width={100}
                                height={50}
                                options={{
                                    maintainAspectRatio: false
                                }}
                            />
                        </div>
                        <br></br>
                        <div style={{height: '150px'}}>
                            <Bar
                                data={dataReparaciones}
                                width={100}
                                height={50}
                                options={{
                                    maintainAspectRatio: false
                                }}
                            />
                        </div>
                        <br></br>
                        <div style={{height: '300px'}}>
                            <Typography variant="h4">
                                Asignación de mecánicos mensual
                            </Typography>
                            <Form>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl variant="outlined">
                                            <InputLabel id="demo-simple-select-outlined-label">
                                                Mes
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-outlined-label"
                                                id="mes"
                                                name="mes"
                                                value={this.state.mes}
                                                displayEmpty
                                                onChange={this.handleChange}
                                                className="select-material-ui"
                                            >
                                                <MenuItem value="Enero">Enero</MenuItem>
                                                <MenuItem value="Febrero">Febrero</MenuItem>
                                                <MenuItem value="Marzo">Marzo</MenuItem>
                                                <MenuItem value="Abril">Abril</MenuItem>
                                                <MenuItem value="Mayo">Mayo</MenuItem>
                                                <MenuItem value="Junio">Junio</MenuItem>
                                                <MenuItem value="Julio">Julio</MenuItem>
                                                <MenuItem value="Agosto">Agosto</MenuItem>
                                                <MenuItem value="Septiembre">Septiembre</MenuItem>
                                                <MenuItem value="Octubre">Octubre</MenuItem>
                                                <MenuItem value="Noviembre">Noviembre</MenuItem>
                                                <MenuItem value="Diciembre">Diciembre</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Form>
                            {this.state.flagGrafico &&
                            <Pie
                                width={100}
                                height={50}
                                options={{
                                    maintainAspectRatio: false
                                }}
                                data={data}
                            />
                            }
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

export default withRouter(HomeTaller);