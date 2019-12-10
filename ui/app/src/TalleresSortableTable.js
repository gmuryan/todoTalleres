import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
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
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import TextsmsIcon from '@material-ui/icons/Textsms';
import BookmarkIcon from '@material-ui/icons/Bookmark';
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

const headCells = [
    {id: 'idTaller', numeric: true, disablePadding: false, label: 'ID'},
    {id: 'nombre', numeric: false, disablePadding: false, label: 'Nombre'},
    {id: 'barrio', numeric: false, disablePadding: false, label: 'Barrio'},
    {id: 'telefono', numeric: true, disablePadding: false, label: 'Teléfono'},
    {id: 'mail', numeric: false, disablePadding: false, label: 'Mail'},
    {id: 'marca', numeric: false, disablePadding: false, label: 'Marca'},
    {id: 'clasificacion', numeric: false, disablePadding: false, label: 'Especialización'},
    {id: 'activo', numeric: false, disablePadding: false, label: 'Habilitado'},
    {id: 'accion', numeric: false, disablePadding: false, label: 'Acciones'},
];

function EnhancedTableHead(props) {
    const {classes, order, orderBy, onRequestSort} = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

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

const TalleresEnhancedTable = ({rows, habilitarTaller, deshabilitarTaller, editar, verReseñas, reservar, usuarioAdmin, usuarioCliente}) => {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = rows.map(n => n.idTaller);
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

    const editIcon = (idTaller) => (
        <Tooltip title="Editar">
            <IconButton aria-label="Editar" onClick={() => editar(idTaller)}>
                <EditIcon color="primary"/>
            </IconButton>
        </Tooltip>
    );

    const enableIcon = (idTaller) => (
        <Tooltip title="Habilitar">
            <IconButton aria-label="Habilitar" onClick={() => habilitarTaller(idTaller)}>
                <AddIcon color="primary"/>
            </IconButton>
        </Tooltip>
    );

    const disableIcon = (idTaller) => (
        <Tooltip title="Deshabilitar">
            <IconButton aria-label="Deshabilitar" onClick={() => deshabilitarTaller(idTaller)}>
                <RemoveIcon color="error"/>
            </IconButton>
        </Tooltip>
    );

    const reviewsIcon = (idTaller) => (
        <Tooltip title="Reseñas">
            <IconButton aria-label="Reseñas" onClick={() => verReseñas(idTaller)}>
                <TextsmsIcon color="action"/>
            </IconButton>
        </Tooltip>
    );

    const bookmarkIcon = (idTaller) => (
        <Tooltip title="Reservar">
            <IconButton aria-label="Reservar" onClick={() => reservar(idTaller)}>
                <BookmarkIcon color="primary"/>
            </IconButton>
        </Tooltip>
    );

    const infoIcon = (idTaller) => (
        <Tooltip title="Más Información">
            <IconButton aria-label="Más Información" onClick={() => verReseñas(idTaller)}>
                <InfoIcon color="secondary"/>
            </IconButton>
        </Tooltip>
    );

    const flattenRows = (rows) => (
        rows.map(r => ({...{...r}, marca: r.marca.descripcion, clasificacion:r.clasificacion.descripcion}))
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
                        />
                        <TableBody>
                            {stableSort(flattenRows(rows), getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.name);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    if (usuarioAdmin || (usuarioCliente && row.activo)) {
                                        return (
                                            <TableRow
                                                hover
                                                onClick={event => handleClick(event, row.idTaller)}
                                                key={row.idTaller}
                                                selected={isItemSelected}
                                            >
                                                <TableCell component="th" id={labelId} scope="row" align="right">
                                                    {row.idTaller}
                                                </TableCell>
                                                <TableCell align="left">{row.nombre}</TableCell>
                                                <TableCell align="left">{row.barrio}</TableCell>
                                                <TableCell align="right">{row.telefono}</TableCell>
                                                <TableCell align="left">{row.mail}</TableCell>
                                                <TableCell align="left">{row.marca}</TableCell>
                                                <TableCell align="left">{row.clasificacion}</TableCell>
                                                <TableCell align="left">{row.activo ? "Si" : "No"}</TableCell>
                                                <TableCell component="th" scope="row">
                                                    {usuarioCliente &&
                                                    bookmarkIcon(row.idTaller)
                                                    }
                                                    {usuarioCliente &&
                                                    infoIcon(row.idTaller)
                                                    }
                                                    {usuarioAdmin &&
                                                    editIcon(row.idTaller)
                                                    }
                                                    {usuarioAdmin &&
                                                    reviewsIcon(row.idTaller)
                                                    }
                                                    {!row.activo && usuarioAdmin &&
                                                    enableIcon(row.idTaller)
                                                    }
                                                    {row.activo && usuarioAdmin &&
                                                    disableIcon(row.idTaller)
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }
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
                    labelRowsPerPage="Filas por página"
                    labelDisplayedRows={({ from, to, count }) => `Página ${page+1} de ${Math.ceil(count/rowsPerPage)}`}
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

export default TalleresEnhancedTable;