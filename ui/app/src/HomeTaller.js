import React, {Component} from 'react';
import './App.css';
import TalleresNavbar from './TalleresNavbar';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Label, Form, FormGroup} from 'reactstrap';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import {Bar} from 'react-chartjs-2';
import {Pie} from 'react-chartjs-2';


class HomeTaller extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalesFacturacion: [],
            totalesReparaciones: [],
            nombresMecanicos: [],
            reparacionesMes: [],
            flagGrafico: false
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
        const value = target.value;
        const name = target.name;
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
                    label: 'Facturacion mensual proyectada',
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
                    '#FFCE56'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
            }]
        };
        return (
            <div>
                <TalleresNavbar/>
                <Container fluid>
                    <div>
                        <h2>Reparaciones 2019</h2>
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
                            <h2>Asignacion de mecanicos</h2>
                            <Form>
                                <div className="row">
                                    <FormGroup className="col-md-6 mb-3">
                                        <select className="select" name="mes" id="mes" onChange={this.handleChange}
                                                autoComplete="mes">
                                            <option default value="">Seleccione mes...</option>
                                            <option value="Enero">Enero</option>
                                            <option value="Febrero">Febrero</option>
                                            <option value="Marzo">Marzo</option>
                                            <option value="Abril">Abril</option>
                                            <option value="Mayo">Mayo</option>
                                            <option value="Junio">Junio</option>
                                            <option value="Julio">Julio</option>
                                            <option value="Agosto">Agosto</option>
                                            <option value="Septiembre">Septiembre</option>
                                            <option value="Octubre">Octubre</option>
                                            <option value="Noviembre">Noviembre</option>
                                            <option value="Diciembre">Diciembre</option>
                                        </select>
                                    </FormGroup>
                                </div>
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