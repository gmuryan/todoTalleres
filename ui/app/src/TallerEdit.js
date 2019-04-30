import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

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
        retrasosContemplados: ''
    };


    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            errors: {},
            marcas: [],
            clasificaciones: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const taller = await (await fetch(`/api/taller/${this.props.match.params.id}`)).json();
            const mrcs = await (await fetch(`/api/marcas`)).json();
            const clasifs = await (await fetch(`/api/clasificaciones`)).json();
            this.setState({item: taller, marcas: mrcs, clasificaciones: clasifs});
        }else{
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

    handleValidation(){
        let fields = this.state.item;
        let errors = {};
        let formIsValid = true;

        //Name
        if(fields["nombre"].length === 0){
            formIsValid = false;
            errors["nombre"] = "No puede estar vacio";
        }
        else if(typeof fields["nombre"] !== "undefined"){
            if(!fields["nombre"].match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["nombre"] = "Solo letras";
            }
        }

        //Barrio
        if(fields["barrio"].length === 0){
            formIsValid = false;
            errors["barrio"] = "No puede estar vacio";
        }
        else if(typeof fields["barrio"] !== "undefined"){
            if(!fields["barrio"].match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["barrio"] = "Solo letras";
            }
        }

        //Telefono
        if(fields["telefono"].length === 0){
            formIsValid = false;
            errors["telefono"] = "No puede estar vacio";
        }
        else if(typeof fields["telefono"] !== "undefined"){
            if(!fields["telefono"].match(/^[0-9]+$/)){
                formIsValid = false;
                errors["telefono"] = "Solo numeros";
            }
        }

        //Email
        if(!fields["mail"]){
            formIsValid = false;
            errors["mail"] = "No puede estar vacio";
        }
        else if(typeof fields["mail"] !== "undefined"){
            let lastAtPos = fields["mail"].lastIndexOf('@');
            let lastDotPos = fields["mail"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["mail"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["mail"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["mail"] = "Mail invalido";
            }
        }


        //Ubicacion
        if(!fields["ubicacion"]){
            formIsValid = false;
            errors["ubicacion"] = "No puede estar vacio";
        }

        //MaximosVehiculos
        if(fields["maximosVehiculos"].length === 0){
            formIsValid = false;
            errors["maximosVehiculos"] = "No puede estar vacio";
        }
        else if(typeof fields["maximosVehiculos"] !== "undefined"){
            if(!fields["maximosVehiculos"].match(/^[0-9]+$/)){
                formIsValid = false;
                errors["maximosVehiculos"] = "Solo numeros";
            }
        }

        //RetrasosContemplados
        if(fields["retrasosContemplados"].length === 0){
            formIsValid = false;
            errors["retrasosContemplados"] = "No puede estar vacio";
        }
        else if(typeof fields["retrasosContemplados"] !== "undefined"){
            if(!fields["retrasosContemplados"].match(/^[0-9]+$/)){
                formIsValid = false;
                errors["retrasosContemplados"] = "Solo numeros";
            }
        }

        this.setState({errors: errors});
        return formIsValid;
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (this.handleValidation()){
            const {item} = this.state;

            await fetch('/api/taller', {
                method: (item.idCliente) ? 'PUT' : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            });
            this.props.history.push('/talleres');
        }
    }

    render() {
        const {item, marcas, clasificaciones} = this.state;
        console.log(this.state.marcas);
        let optionItemsMarcas = marcas.map((marca) =>
            <option key={marca.idMarca} selected={item.marca.idMarca == marca.idMarca} value={JSON.stringify(marca)}>{marca.descripcion}</option>
        );
        let newOptionsMarcas = marcas.map((marca) =>
            <option key={marca.idMarca} value={JSON.stringify(marca)}>{marca.descripcion}</option>
        );
        let optionItemsClasifs = clasificaciones.map((clasif) =>
            <option key={clasif.idClasificacion} selected={item.clasificacion.idClasificacion == clasif.idClasificacion} value={JSON.stringify(clasif)}>{clasif.descripcion}</option>
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
                    {item.idTaller && (
                        <FormGroup>
                            <Label for="marca">Marca</Label>
                            <br></br>
                            <div>
                                <select  required="required" className="select" name="marca" id="marca" onChange={this.handleChange} autoComplete="marca">
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
                                <select  required="required" className="select" name="marca" id="marca" onChange={this.handleChange} autoComplete="marca">
                                    <option value="" default>Seleccionar Marca...</option>
                                    {newOptionsMarcas}
                                </select>
                            </div>
                            &nbsp;&nbsp;
                        </FormGroup>
                    )}
                    {item.idTaller && (
                        <FormGroup>
                            <Label for="clasificacion">Clasificacion</Label>
                            <br></br>
                            <div>
                                <select  required="required" className="select" name="clasificacion" id="clasificacion" onChange={this.handleChange} autoComplete="clasificacion">
                                    {optionItemsClasifs}
                                </select>
                            </div>
                            &nbsp;&nbsp;
                        </FormGroup>
                    )}
                    {item.idTaller == null && (
                        <FormGroup>
                            <Label for="clasificacion">Clasificacion</Label>
                            <br></br>
                            <div>
                                <select  required="required" className="select" name="clasificacion" id="clasificacion" onChange={this.handleChange} autoComplete="clasificacion">
                                    <option value="" default>Seleccionar Clasificacion...</option>
                                    {newOptionsClasifs}
                                </select>
                            </div>
                            &nbsp;&nbsp;
                        </FormGroup>
                    )}

                    <div className="row">
                    <FormGroup className="col-md-6 mb-3">
                        <Label for="maximosVehiculos">Capacidad Maxima de Vehiculos</Label>
                        <Input type="text" name="maximosVehiculos" id="maximosVehiculos" value={item.maximosVehiculos || ''}
                               onChange={this.handleChange} autoComplete="maximosVehiculos"/>
                        <span className="error">{this.state.errors["maximosVehiculos"]}</span>
                    </FormGroup>
                    <FormGroup className="col-md-6 mb-3">
                        <Label for="retrasosContemplados">Espacios Reservados por Precaucion</Label>
                        <Input type="text" name="retrasosContemplados" id="retrasosContemplados" value={item.retrasosContemplados || ''}
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