import React, {Component} from "react";
import './App.css';
import SignInSide from "./SignInSide";

// const imgTaller = require('./taller.jpg');
// const divStyle = {
//     width: '100%',
//     height: '800px',
//     backgroundImage: `url(${imgTaller})`,
//     backgroundSize: 'cover'
// };

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errors: {},
            formIsValid: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = event => {
        event.preventDefault();
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async(event) => {
        event.preventDefault();
        let errors = {};
        const {email, password} = this.state;
        if (email === 'admin' && password === 'admin') {
            localStorage.clear();
            localStorage.setItem("adminUser", JSON.stringify(this.state));
            this.props.history.push('/home');
        } else {
            await fetch(`/api/tallerByMail?mail=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        if (email === json.mail && password === json.password && json.activo) {
                            localStorage.clear();
                            localStorage.setItem("tallerUser", JSON.stringify(json));
                            this.props.history.push('/homeTaller');
                        }
                    })
                }
            });

            console.log("test");
            await fetch(`/api/clienteByMail?mail=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    response.json().then(json => {
                        if (email === json.mail && password === json.password && json.activo) {
                            localStorage.clear();
                            localStorage.setItem("clienteUser", JSON.stringify(json));
                            this.props.history.push('/homeCliente');
                        }else{
                            this.setState({formIsValid: false});
                            errors["password"] = "Datos invalidos";
                            this.setState({errors: errors});
                        }
                    })
                } else {
                    this.setState({formIsValid: false});
                }
            });
        }

        if (!this.state.formIsValid) {
            errors["password"] = "Datos invalidos";
            this.setState({errors: errors});
        }
    }

    render() {
        return(
            <SignInSide errores={this.state.errors} handleSubmit={this.handleSubmit} handleChange={this.handleChange.bind(this)}/>
        );
    }

}

export default Login;