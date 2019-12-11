import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {withRouter} from "react-router-dom";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import {Visibility, VisibilityOff} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const SignUp = ({handleSubmit, handleChange, errores}) => {
    const classes = useStyles();

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = event => {
        setShowPassword(!showPassword);
    }

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Registración
                </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="nombre"
                                name="nombre"
                                variant="outlined"
                                required
                                fullWidth
                                id="nombre"
                                label="Nombre"
                                autoFocus
                                error={errores["nombre"]}
                                helperText={errores["nombre"]}
                                onChange={(event) => handleChange(event)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="apellido"
                                label="Apellido"
                                name="apellido"
                                autoComplete="apellido"
                                error={errores["apellido"]}
                                helperText={errores["apellido"]}
                                onChange={(event) => handleChange(event)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="mail"
                                label="Mail"
                                name="mail"
                                autoComplete="mail"
                                error={errores["mail"]}
                                helperText={errores["mail"]}
                                onChange={(event) => handleChange(event)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="telefono"
                                label="Teléfono"
                                name="telefono"
                                autoComplete="telefono"
                                error={errores["telefono"]}
                                helperText={errores["telefono"]}
                                onChange={(event) => handleChange(event)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {showPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                }}
                                autoComplete="password"
                                error={errores["password"]}
                                helperText={errores["password"]}
                                onChange={(event) => handleChange(event)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="repeatPassword"
                                label="Repetir Contraseña"
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {showPassword ? <Visibility/> : <VisibilityOff/>}
                                            </IconButton>
                                        </InputAdornment>
                                }}
                                id="repeatPassword"
                                autoComplete="repeatPassword"
                                error={errores["repeatPassword"]}
                                helperText={errores["repeatPassword"]}
                                onChange={(event) => handleChange(event)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={(event) => handleSubmit(event)}
                    >
                        Registrarse
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/" variant="body2">
                                ¿Ya tiene cuenta? Ingrese al sistema
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}

export default withRouter(SignUp);