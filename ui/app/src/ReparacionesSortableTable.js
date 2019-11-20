import React from 'react';
import PropTypes from 'prop-types';
import {lighten, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import InfoIcon from '@material-ui/icons/Info';

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const headCells_taller = [
    {id: 'idReparacion', numeric: true, disablePadding: false, label: 'ID'},
    {id: 'fechaReserva', numeric: false, disablePadding: false, label: 'Fecha Reserva'},
    {id: 'horarioReserva', numeric: false, disablePadding: false, label: 'Horario Reserva'},
    {id: 'fechaDevolucion', numeric: false, disablePadding: false, label: 'Fecha Devolución'},
    {id: 'horarioDevolucion', numeric: false, disablePadding: false, label: 'Horario Devolución'},
    {id: 'estadoReparacion', numeric: false, disablePadding: false, label: 'Estado'},
    {id: 'importe', numeric: true, disablePadding: false, label: 'Importe'},
    {id: 'cliente', numeric: false, disablePadding: false, label: 'Cliente'},
    {id: 'acciones', numeric: false, disablePadding: false, label: 'Acciones'},
];

const headCells_cliente = [
    {id: 'idReparacion', numeric: true, disablePadding: false, label: 'ID'},
    {id: 'fechaReserva', numeric: false, disablePadding: false, label: 'Fecha Reserva'},
    {id: 'horarioReserva', numeric: false, disablePadding: false, label: 'Horario Reserva'},
    {id: 'fechaDevolucion', numeric: false, disablePadding: false, label: 'Fecha Devolución'},
    {id: 'horarioDevolucion', numeric: false, disablePadding: false, label: 'Horario Devolución'},
    {id: 'estado', numeric: false, disablePadding: false, label: 'Estado'},
    {id: 'importe', numeric: true, disablePadding: false, label: 'Importe'},
    {id: 'taller', numeric: false, disablePadding: false, label: 'Taller'},
    {id: 'acciones', numeric: false, disablePadding: false, label: 'Acciones'},
];

const headCells_sin_acciones = [
    {id: 'idReparacion', numeric: true, disablePadding: false, label: 'ID'},
    {id: 'fechaDevolucion', numeric: false, disablePadding: false, label: 'Fecha Devolución'},
    {id: 'horarioDevolucion', numeric: false, disablePadding: false, label: 'Horario Devolución'},
    {id: 'estado', numeric: false, disablePadding: false, label: 'Estado'},
    {id: 'importe', numeric: true, disablePadding: false, label: 'Importe'},
    {id: 'cliente', numeric: false, disablePadding: false, label: 'Cliente'},
];

function EnhancedTableHead(props) {
    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, tallerUser, acciones} = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };
    let headCells;

    if (acciones) {
        if (tallerUser)
            headCells = headCells_taller;
        else
            headCells = headCells_cliente;
    }else{
        headCells = headCells_sin_acciones;
    }

    return (
        <TableHead>
            <TableRow>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={order}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

const ReparacionesEnhancedTable = ({rows, cancelarTurno, editar, clienteUser, tallerUser, acciones, dense}) => {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = rows.map(n => n.idCliente);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = name => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const editIcon = (idReparacion) => (
        <Tooltip title="Editar">
            <IconButton aria-label="Editar" onClick={() => editar(idReparacion)}>
                <EditIcon color="primary"/>
            </IconButton>
        </Tooltip>
    );

    const cancelIcon = (idReparacion) => (
        <Tooltip title="Cancelar Turno">
            <IconButton aria-label="Cancelar Turno" onClick={() => cancelarTurno(idReparacion)}>
                <CancelIcon color="secondary"/>
            </IconButton>
        </Tooltip>
    );

    const infoIcon = (idReparacion) => (
        <Tooltip title="Más Información">
            <IconButton aria-label="Más Información" onClick={() => editar(idReparacion)}>
                <InfoIcon color="primary"/>
            </IconButton>
        </Tooltip>
    );

    const flattenRows = (rows) => (
        rows.map(r => ({...{...r}, estadoReparacion: r.estadoReparacion.descripcion, cliente:r.cliente.nombre + " " +r.cliente.apellido}))
    );

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <div className={classes.tableWrapper}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            tallerUser={tallerUser}
                            acciones={acciones}
                        />
                        <TableBody>
                            {stableSort(flattenRows(rows), getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => handleClick(event, row.idReparacion)}
                                            key={row.idReparacion}
                                            selected={isItemSelected}
                                        >
                                            <TableCell component="th" id={labelId} scope="row" align="right">
                                                {row.idReparacion}
                                            </TableCell>
                                            {acciones &&
                                            <TableCell align="left">{row.fechaReserva}</TableCell>
                                            }
                                            {acciones &&
                                            <TableCell align="left">{row.horaReserva.substring(0, 5)}</TableCell>
                                            }
                                            <TableCell align="left">{row.fechaDevolucion}</TableCell>
                                            <TableCell
                                                align="left">{row.horaDevolucion ? row.horaDevolucion.substring(0, 5) : row.horaDevolucion}</TableCell>
                                            <TableCell align="left">{row.estadoReparacion}</TableCell>
                                            {row.importeTotal &&
                                            <TableCell align="right"> ${new Intl.NumberFormat('de-DE', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            }).format(row.importeTotal)}</TableCell>
                                            }
                                            {!row.importeTotal &&
                                            <TableCell align="right">{row.importeTotal}</TableCell>
                                            }
                                            {tallerUser !== null  &&
                                            <TableCell
                                                align="left">{row.cliente}</TableCell>
                                            }
                                            {clienteUser !== null && acciones &&
                                            <TableCell align="left">{row.taller.nombre}</TableCell>
                                            }
                                            {acciones &&
                                            <TableCell component="th" scope="row">
                                                {tallerUser &&
                                                editIcon(row.idReparacion)
                                                }
                                                {clienteUser &&
                                                infoIcon(row.idReparacion)
                                                }
                                                {cancelIcon(row.idReparacion)}
                                            </TableCell>
                                            }
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'previous page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'next page',
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}

export default ReparacionesEnhancedTable;