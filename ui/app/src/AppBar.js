import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {Link} from'react-router-dom';
import {withRouter} from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import TextsmsIcon from '@material-ui/icons/Textsms';
import BuildIcon from '@material-ui/icons/Build';
import StoreIcon from '@material-ui/icons/Store';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {Visibility, VisibilityOff} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
}));

const MenuAppBar = ({logout, clienteUser, tallerUser, adminUser}) => {
    const classes = useStyles();
    const [auth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorSM, setAnchorSM] = React.useState(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openDialogExito, setOpenDialogExito] = React.useState(false);
    const [newPassword, setNewPassword] = React.useState(null);
    const [repeatNewPassword, setRepeatNewPassword] = React.useState(null);
    const [showRepeatPassword, setShowRepeatPassword] = React.useState(false);
    const [errorPassword, setErrorPassword] = React.useState(null);
    const [showPassword, setShowPassword] = React.useState(false);
    const [errorRepeatPassword, setErrorRepeatPassword] = React.useState(null);
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const open = Boolean(anchorEl);
    const openMainMenu = Boolean(anchorSM);

    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
        setAnchorEl(false);
    };

    const handleClickShowPassword = event => {
        setShowPassword(!showPassword);
    }

    const handleClickShowRepeatPassword = event => {
        setShowRepeatPassword(!showRepeatPassword);
    }

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenDialogExito(false);
    };

    const handleOpenDialogExito = () =>{
        setOpenDialogExito(true);
    }

    const handleCloseMainMenu = () =>{
        setAnchorSM(null);
    }

    const handleNewPassword = event  => {
        setNewPassword(event.target.value);
    }

    const handleRepeatNewPassword = event => {
        setRepeatNewPassword(event.target.value);
    }

    const handleValidation = () => {
        let formIsValid = true;
        setErrorRepeatPassword(null);
        setErrorPassword(null);

        //Contraseña
        if (!newPassword) {
            formIsValid = false;
            setErrorPassword("No puede estar vacío");
        }

        //RepetirContraseña
        if (!repeatNewPassword) {
            formIsValid = false;
            setErrorRepeatPassword("No puede estar vacío");
        } else if (newPassword !== repeatNewPassword) {
            formIsValid = false;
            setErrorRepeatPassword("Debe ser igual a la contraseña");
        }
        return formIsValid;
    }

    const handleSubmit = async() => {
        if (handleValidation()){
            await fetch(`/api/updatePassword?id=${encodeURIComponent(clienteUser.idCliente)}&nuevaPassword=${encodeURIComponent(newPassword)}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                handleCloseDialog();
                handleOpenDialogExito();
            });
        }
    }

    const handleSubmitTaller = async() => {
        if (handleValidation()){
            await fetch(`/api/updatePasswordTaller?id=${encodeURIComponent(tallerUser.idTaller)}&nuevaPassword=${encodeURIComponent(newPassword)}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                handleCloseDialog();
                handleOpenDialogExito();
            });
        }
    }

    const toggleDrawer = (side, open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    const sideList = side => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                {adminUser &&
                <Link to='/home' className="link-menu-color" style={{textDecoration: 'none'}}>
                    <ListItem button>
                        <ListItemIcon><HomeIcon/></ListItemIcon>
                        <ListItemText primary="Inicio"/>
                    </ListItem>
                </Link>
                }
                {clienteUser &&
                <Link to='/homeCliente' className="link-menu-color" style={{textDecoration: 'none'}}>
                    <ListItem button>
                        <ListItemIcon><HomeIcon/></ListItemIcon>
                        <ListItemText primary="Inicio"/>
                    </ListItem>
                </Link>
                }
                {tallerUser &&
                <Link to='/homeTaller' className="link-menu-color" style={{textDecoration: 'none'}}>
                    <ListItem button>
                        <ListItemIcon><HomeIcon/></ListItemIcon>
                        <ListItemText primary="Inicio"/>
                    </ListItem>
                </Link>
                }
                {adminUser &&
                <Link to='/clientes' className="link-menu-color" style={{ textDecoration: 'none' }}>
                    <ListItem button>
                        <ListItemIcon><PeopleIcon/></ListItemIcon>
                        <ListItemText primary="Clientes"/>
                    </ListItem>
                </Link>
                }
                {tallerUser &&
                <Link to={'/reseñas/' + tallerUser.idTaller} className="link-menu-color" style={{ textDecoration: 'none' }}>
                    <ListItem button>
                        <ListItemIcon><TextsmsIcon/></ListItemIcon>
                        <ListItemText primary="Reseñas"/>
                    </ListItem>
                </Link>
                }
                {tallerUser &&
                <Link to={'/mecanicos'} className="link-menu-color" style={{ textDecoration: 'none' }}>
                    <ListItem button>
                        <ListItemIcon><PeopleIcon/></ListItemIcon>
                        <ListItemText primary="Mecánicos"/>
                    </ListItem>
                </Link>
                }
                {(clienteUser || adminUser) &&
                <Link to='/talleres' className="link-menu-color" style={{ textDecoration: 'none' }}>
                    <ListItem button>
                        <ListItemIcon><StoreIcon/></ListItemIcon>
                        <ListItemText primary="Talleres"/>
                    </ListItem>
                </Link>
                }
                {(clienteUser || tallerUser) &&
                <Link to='/reparaciones' className="link-menu-color" style={{ textDecoration: 'none' }}>
                    <ListItem button>
                        <ListItemIcon><BuildIcon/></ListItemIcon>
                        <ListItemText primary="Reparaciones"/>
                    </ListItem>
                </Link>
                }
            </List>
        </div>
    );

    return (
        <div className={classes.root}>
            <Dialog
                open={openDialogExito}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Operación Exitosa"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Cambios guardados correctamente.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogTitle id="max-width-dialog-title">Blanquear Contraseña</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ingrese la nueva contraseña
                    </DialogContentText>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <TextField id="newPassword"
                                       label="Contraseña"
                                       margin="normal"
                                       variant="outlined"
                                       name="newPassword"
                                       type={showPassword ? 'text' : 'password'}
                                       required
                                       onChange={handleNewPassword}
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
                                       value={newPassword}
                                       error={errorPassword}
                                       helperText={errorPassword}
                                       fullWidth/>
                        </Grid>
                        <Grid container spacing={2}>
                            <TextField id="newPasswordRepeat"
                                       label="Repetir Contraseña"
                                       margin="normal"
                                       variant="outlined"
                                       name="newPasswordRepeat"
                                       type={showRepeatPassword ? 'text' : 'password'}
                                       required
                                       onChange={handleRepeatNewPassword}
                                       InputProps={{
                                           endAdornment:
                                               <InputAdornment position="end">
                                                   <IconButton
                                                       aria-label="toggle password visibility"
                                                       onClick={handleClickShowRepeatPassword}
                                                       onMouseDown={handleMouseDownPassword}
                                                   >
                                                       {showRepeatPassword ? <Visibility/> : <VisibilityOff/>}
                                                   </IconButton>
                                               </InputAdornment>
                                       }}
                                       value={repeatNewPassword}
                                       error={errorRepeatPassword}
                                       helperText={errorRepeatPassword}
                                       fullWidth/>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={clienteUser ? handleSubmit : handleSubmitTaller} color="primary">
                        Aceptar
                    </Button>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"                            aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={toggleDrawer('left', true)}>
                        <MenuIcon/>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorSM}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={openMainMenu}
                        onClose={handleCloseMainMenu}
                    >
                        {adminUser &&
                        <Link to='/home' style={{textDecoration: 'none'}}>
                            <MenuItem>Home</MenuItem>
                        </Link>
                        }
                        {clienteUser &&
                        <Link to='/homeCliente' style={{textDecoration: 'none'}}>
                            <MenuItem>Home</MenuItem>
                        </Link>
                        }
                        {tallerUser &&
                        <Link to='/homeTaller' style={{textDecoration: 'none'}}>
                            <MenuItem>Home</MenuItem>
                        </Link>
                        }
                        {adminUser &&
                        <Link to='/clientes' style={{ textDecoration: 'none' }}>
                            <MenuItem>Clientes</MenuItem>
                        </Link>
                        }
                        {tallerUser &&
                        <Link to={'/reseñas/' + tallerUser.idTaller} style={{ textDecoration: 'none' }}>
                            <MenuItem>Reseñas</MenuItem>
                        </Link>
                        }
                        {tallerUser &&
                        <Link to={'/mecanicos'} style={{ textDecoration: 'none' }}>
                            <MenuItem>Mecánicos</MenuItem>
                        </Link>
                        }
                        {(clienteUser || adminUser) &&
                        <Link to='/talleres' style={{ textDecoration: 'none' }}>
                            <MenuItem>Talleres</MenuItem>
                        </Link>
                        }
                        {(clienteUser || tallerUser) &&
                        <Link to='/reparaciones' style={{ textDecoration: 'none' }}>
                            <MenuItem>Reparaciones</MenuItem>
                        </Link>
                        }
                    </Menu>
                    <Typography variant="h6" className={classes.title}>
                        TodoTalleres
                    </Typography>
                    {auth && (
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                {clienteUser &&
                                <Link to={'/misDatos/' + clienteUser.idCliente} className="link-menu-color" style={{ textDecoration: 'none' }}>
                                    <MenuItem onClick={handleClose}>Mis Datos</MenuItem>
                                </Link>
                                }
                                {tallerUser &&
                                <Link to={'/miTaller/' + tallerUser.idTaller} className="link-menu-color" style={{ textDecoration: 'none' }}>
                                    <MenuItem onClick={handleClose}>Mi Taller</MenuItem>
                                </Link>
                                }
                                {(tallerUser || clienteUser) &&
                                <MenuItem onClick={handleClickOpenDialog}>Cambiar Contraseña</MenuItem>
                                }
                                <Link to='/' className="link-menu-color" style={{ textDecoration: 'none' }}>
                                    <MenuItem onClick={logout}>Salir</MenuItem>
                                </Link>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <div>
                <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
                    {sideList('left')}
                </Drawer>
            </div>
        </div>
    );
}

export default withRouter(MenuAppBar);