import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

class TallerEdit extends Component {


    emptyItem = {
        nombre: '',
        barrio: '',
        telefono: '',
        mail: '',
        ubicacion: '',
        marca: '',
        clasificacion: '',
        maximosVehiculos: '',
        retrasosContemplados: '',
        password: '',
        descripcionTaller: '',
        repeatPassword: ''
    };


    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            errors: {},
            marcas: [],
            clasificaciones: [],
            flag: false,
            formIsValid: true,
            mailCargado: ''
        };
        this.validateMailTaller = this.validateMailTaller.bind(this);
        this.validateMailCliente = this.validateMailCliente.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        const admin = JSON.parse(localStorage.getItem("adminUser"));
        if (admin === null){
            localStorage.clear();
            this.props.history.push('/');
        }
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const taller = await (await fetch(`/api/taller/${this.props.match.params.id}`)).json();
            this.setState({mailCargado: taller.mail});
            const mrcs = await (await fetch(`/api/marcas`)).json();
            const clasifs = await (await fetch(`/api/clasificaciones`)).json();
            this.setState({item: taller, marcas: mrcs, clasificaciones: clasifs});
        } else {
            const mrcs = await (await fetch(`/api/marcas`)).json();
            const clasifs = await (await fetch(`/api/clasificaciones`)).json();
            this.setState({marcas: mrcs, clasificaciones: clasifs});
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    validateMailTaller() {
        let fields = this.state.item;
        return fetch(`/api/tallerByMail?mail=${encodeURIComponent(fields["mail"])}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    validateMailCliente(){
        let fields = this.state.item;
        return fetch(`/api/clienteByMail?mail=${encodeURIComponent(fields["mail"])}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
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
        }

        //Barrio
        if (fields["barrio"].length === 0) {
            this.setState({formIsValid: false});
            errors["barrio"] = "No puede estar vacio";
        } else if (typeof fields["barrio"] !== "undefined") {
            if (!fields["barrio"].match(/^[a-zA-Z ]+$/)) {
                this.setState({formIsValid: false});
                errors["barrio"] = "Solo letras";
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

        //Ubicacion
        if (!fields["ubicacion"]) {
            this.setState({formIsValid: false});
            errors["ubicacion"] = "No puede estar vacio";
        }

        //MaximosVehiculos
        if (fields["maximosVehiculos"].length === 0) {
            this.setState({formIsValid: false});
            errors["maximosVehiculos"] = "No puede estar vacio";
        } else if (typeof fields["maximosVehiculos"] !== "undefined") {
            if (!fields["maximosVehiculos"].toString().match(/^[0-9]+$/)) {
                this.setState({formIsValid: false});
                errors["maximosVehiculos"] = "Solo numeros";
            } else if (parseFloat(fields["retrasosContemplados"]) > parseFloat(fields["maximosVehiculos"])) {
                this.setState({formIsValid: false});
                errors["maximosVehiculos"] = "La cantidad de vehiculos debe ser mayor a los retrasos contemplados"
            }
        }


        //RetrasosContemplados
        if (fields["retrasosContemplados"].length === 0) {
            this.setState({formIsValid: false});
            errors["retrasosContemplados"] = "No puede estar vacio";
        } else if (typeof fields["retrasosContemplados"] !== "undefined") {
            if (!fields["retrasosContemplados"].toString().match(/^[0-9]+$/)) {
                this.setState({formIsValid: false});
                errors["retrasosContemplados"] = "Solo numeros";
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
            if (response.ok && this.state.mailCargado !== fields["mail"]){
                this.setState({formIsValid: false});
                errors["mail"] = "Este mail ya esta registrado";
                this.setState({errors: errors});
            }else{
                return this.validateMailCliente().then((response) => {
                    if (response.ok && this.state.mailCargado !== fields["mail"]){
                        this.setState({formIsValid: false});
                        errors["mail"] = "Este mail ya esta registrado";
                        this.setState({errors: errors});
                    }
                })
            }
        });

    }

    dialogCreado() {
        confirmAlert({
            title: 'Operacion Exitosa',
            buttons: [
                {
                    label: 'Aceptar',
                    onClick: () =>  this.props.history.push('/talleres')
                }
            ]
        })
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.handleValidation().then((result) => {
            if (this.state.formIsValid) {
                const {item} = this.state;

                fetch('/api/taller', {
                    method: (item.idTaller) ? 'PUT' : 'POST',
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
        const {item, marcas, clasificaciones, flag} = this.state;

        if (flag == false && item.idTaller) {
            console.log(item);
            item.repeatPassword = item.password;
            this.setState({flag: !this.state.flag});
        }

        let optionItemsMarcas = marcas.map((marca) =>
            <option key={marca.idMarca} selected={item.marca.idMarca == marca.idMarca}
                    value={JSON.stringify(marca)}>{marca.descripcion}</option>
        );
        let newOptionsMarcas = marcas.map((marca) =>
            <option key={marca.idMarca} value={JSON.stringify(marca)}>{marca.descripcion}</option>
        );
        let optionItemsClasifs = clasificaciones.map((clasif) =>
            <option key={clasif.idClasificacion} selected={item.clasificacion.idClasificacion == clasif.idClasificacion}
                    value={JSON.stringify(clasif)}>{clasif.descripcion}</option>
        );
        let newOptionsClasifs = clasificaciones.map((clasif) =>
            <option key={clasif.idClasificacion} value={JSON.stringify(clasif)}>{clasif.descripcion}</option>
        );
        const title = <h2>{item.idTaller ? 'Editar Taller' : 'Crear Taller'}</h2>;

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <FormGroup className="col-md-4 mb-3">
                            <Label for="nombre">Nombre</Label>
                            <Input type="text" name="nombre" id="nombre" value={item.nombre || ''}
                                   onChange={this.handleChange} autoComplete="nombre"/>
                            <span className="error">{this.state.errors["nombre"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-4 mb-3">
                            <Label for="barrio">Barrio</Label>
                            <Input type="text" name="barrio" id="barrio" value={item.barrio || ''}
                                   onChange={this.handleChange} autoComplete="barrio"/>
                            <span className="error">{this.state.errors["barrio"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-4 mb-3">
                            <Label for="telefono">Telefono</Label>
                            <Input type="text" name="telefono" id="telefono" value={item.telefono || ''}
                                   onChange={this.handleChange} autoComplete="telefono"/>
                            <span className="error">{this.state.errors["telefono"]}</span>
                        </FormGroup>
                    </div>
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="mail">Mail</Label>
                            <Input type="text" name="mail" id="mail" value={item.mail || ''}
                                   onChange={this.handleChange} autoComplete="mail"/>
                            <span className="error">{this.state.errors["mail"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="ubicacion">Ubicacion</Label>
                            <Input type="text" name="ubicacion" id="ubicacion" value={item.ubicacion || ''}
                                   onChange={this.handleChange} autoComplete="ubicacion"/>
                            <span className="error">{this.state.errors["ubicacion"]}</span>
                        </FormGroup>
                    </div>
                    <div>
                        <div className="row">
                            <FormGroup className="col-md-12 mb-3">
                                <Label for="descripcionTaller">Breve Descripcion del Taller</Label>
                                <Input type="text" name="descripcionTaller" id="descripcionTaller" value={item.descripcionTaller || ''}
                                       onChange={this.handleChange} autoComplete="descripcionTaller"/>
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="password">Contraseña</Label>
                            <Input type="password" name="password" id="password" value={item.password || ''}
                                   onChange={this.handleChange} autoComplete="password"/>
                            <span className="error">{this.state.errors["password"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="repeatPassword">Repetir Contraseña</Label>
                            <Input type="password" name="repeatPassword" id="repeatPassword"
                                   value={item.repeatPassword || ''}
                                   onChange={this.handleChange} autoComplete="repeatPassword"/>
                            <span className="error">{this.state.errors["repeatPassword"]}</span>
                        </FormGroup>
                    </div>
                    {item.idTaller && (
                        <FormGroup>
                            <Label for="marca">Marca</Label>
                            <br></br>
                            <div>
                                <select required="required" className="select" name="marca" id="marca"
                                        onChange={this.handleChange} autoComplete="marca">
                                    {optionItemsMarcas}
                                </select>
                            </div>
                            &nbsp;&nbsp;
                        </FormGroup>
                    )}
                    {item.idTaller == null && (
                        <FormGroup>
                            <Label for="marca">Marca</Label>
                            <br></br>
                            <div>
                                <select required="required" className="select" name="marca" id="marca"
                                        onChange={this.handleChange} autoComplete="marca">
                                    <option value="" default>Seleccionar Marca...</option>
                                    {newOptionsMarcas}
                                </select>
                            </div>
                            &nbsp;&nbsp;
                        </FormGroup>
                    )}
                    {item.idTaller && (
                        <FormGroup>
                            <Label for="clasificacion">Especializacion</Label>
                            <br></br>
                            <div>
                                <select required="required" className="select" name="clasificacion" id="clasificacion"
                                        onChange={this.handleChange} autoComplete="clasificacion">
                                    {optionItemsClasifs}
                                </select>
                            </div>
                            &nbsp;&nbsp;
                        </FormGroup>
                    )}
                    {item.idTaller == null && (
                        <FormGroup>
                            <Label for="clasificacion">Especializacion</Label>
                            <br></br>
                            <div>
                                <select required="required" className="select" name="clasificacion" id="clasificacion"
                                        onChange={this.handleChange} autoComplete="clasificacion">
                                    <option value="" default>Seleccionar Especializacion...</option>
                                    {newOptionsClasifs}
                                </select>
                            </div>
                            &nbsp;&nbsp;
                        </FormGroup>
                    )}

                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="maximosVehiculos">Capacidad Maxima de Vehiculos</Label>
                            <Input type="text" name="maximosVehiculos" id="maximosVehiculos"
                                   value={item.maximosVehiculos || ''}
                                   onChange={this.handleChange} autoComplete="maximosVehiculos"/>
                            <span className="error">{this.state.errors["maximosVehiculos"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="retrasosContemplados">Espacios Reservados por Precaucion</Label>
                            <Input type="text" name="retrasosContemplados" id="retrasosContemplados"
                                   value={item.retrasosContemplados || ''}
                                   onChange={this.handleChange} autoComplete="retrasosContemplados"/>
                            <span className="error">{this.state.errors["retrasosContemplados"]}</span>
                        </FormGroup>
                    </div>

                    <FormGroup>
                        <Button color="primary" type="submit">Guardar</Button>{' '}
                        <Button color="secondary" tag={Link} to="/talleres">Cancelar</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(TallerEdit);