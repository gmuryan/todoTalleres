package com.uade.todoTalleres.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "reparacion")
public class Reparacion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idReparacion;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "reparacion_mecanicos", joinColumns = {
            @JoinColumn(name = "idReparacion") },
            inverseJoinColumns = { @JoinColumn(name = "idMecanico") })
    private List<Mecanico> mecanicos;

    @Column
    @Temporal(TemporalType.DATE)
    private Date fechaDevolucion;

    @Column
    private LocalTime horaDevolucion;

    @Column
    @Temporal(TemporalType.DATE)
    @JsonFormat(pattern="dd-MM-yyyy")
    private Date fechaReserva;

    @Column
    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaReserva;

    @Column(precision = 10, scale = 2)
    private BigDecimal importeTotal;

    @OneToOne
    @JoinColumn(name = "idEstado")
    private Estado estadoReparacion;

    @Column
    private String descripcionProblemaCliente;

    @Column
    private String descripcionProblemaTaller;

    @Column
    private String descripcionReparacion;

    @Column
    private boolean nuevoPresupuesto;

    @OneToOne
    @JoinColumn(name = "idTaller")
    private Taller taller;

    @OneToOne
    @JoinColumn(name = "idCliente")
    private Cliente cliente;

    public Reparacion(){

    }

    public Reparacion(Long idReparacion, Taller taller, Cliente cliente, List<Mecanico> mecanicos, Date fechaDevolucion, LocalTime horaDevolucion, Date fechaReserva, LocalTime horaReserva, BigDecimal importeTotal, Estado estadoReparacion, String descripcionProblemaCliente, String descripcionProblemaTaller, String descripcionReparacion, boolean nuevoPresupuesto) {
        this.idReparacion = idReparacion;
        this.mecanicos = mecanicos;
        this.fechaDevolucion = fechaDevolucion;
        this.horaDevolucion = horaDevolucion;
        this.fechaReserva = fechaReserva;
        this.horaReserva = horaReserva;
        this.importeTotal = importeTotal;
        this.estadoReparacion = estadoReparacion;
        this.descripcionProblemaCliente = descripcionProblemaCliente;
        this.descripcionProblemaTaller = descripcionProblemaTaller;
        this.descripcionReparacion = descripcionReparacion;
        this.nuevoPresupuesto = nuevoPresupuesto;
        this.taller = taller;
        this.cliente = cliente;
    }

    public Long getIdReparacion() {
        return idReparacion;
    }

    public void setIdReparacion(Long idReparacion) {
        this.idReparacion = idReparacion;
    }

    public List<Mecanico> getMecanicos() {
        return mecanicos;
    }

    public void setMecanicos(List<Mecanico> mecanicos) {
        this.mecanicos = mecanicos;
    }

    public Date getFechaDevolucion() {
        return fechaDevolucion;
    }

    public void setFechaDevolucion(Date fechaDevolucion) {
        this.fechaDevolucion = fechaDevolucion;
    }

    public LocalTime getHoraDevolucion() {
        return horaDevolucion;
    }

    public void setHoraDevolucion(LocalTime horaDevolucion) {
        this.horaDevolucion = horaDevolucion;
    }

    public Date getFechaReserva() {
        return fechaReserva;
    }

    public void setFechaReserva(Date fechaReserva) {
        this.fechaReserva = fechaReserva;
    }

    public BigDecimal getImporteTotal() {
        return importeTotal;
    }

    public void setImporteTotal(BigDecimal importeTotal) {
        this.importeTotal = importeTotal;
    }

    public Estado getEstadoReparacion() {
        return estadoReparacion;
    }

    public void setEstadoReparacion(Estado estadoReparacion) {
        this.estadoReparacion = estadoReparacion;
    }

    public String getDescripcionProblemaCliente() {
        return descripcionProblemaCliente;
    }

    public void setDescripcionProblemaCliente(String descripcionProblemaCliente) {
        this.descripcionProblemaCliente = descripcionProblemaCliente;
    }

    public String getDescripcionReparacion() {
        return descripcionReparacion;
    }

    public void setDescripcionReparacion(String descripcionReparacion) {
        this.descripcionReparacion = descripcionReparacion;
    }

    public boolean isNuevoPresupuesto() {
        return nuevoPresupuesto;
    }

    public void setNuevoPresupuesto(boolean nuevoPresupuesto) {
        this.nuevoPresupuesto = nuevoPresupuesto;
    }

    public LocalTime getHoraReserva() {
        return horaReserva;
    }

    public void setHoraReserva(LocalTime horaReserva) {
        this.horaReserva = horaReserva;
    }

    public Taller getTaller() {
        return taller;
    }

    public void setTaller(Taller taller) {
        this.taller = taller;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public String getDescripcionProblemaTaller() {
        return descripcionProblemaTaller;
    }

    public void setDescripcionProblemaTaller(String descripcionProblemaTaller) {
        this.descripcionProblemaTaller = descripcionProblemaTaller;
    }
}
