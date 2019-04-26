package com.uade.todoTalleres.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public class Reparacion {

    private Long idReparacion;

    private List<Mecanico> mecanicos;

    private Date fechaDevolucion;

    private String horaDevolucion;

    private Date fechaEntrada;

    private String horaEntrada;

    private BigDecimal importeTotal;

    private Estado estadoReparacion;

    private String descripcionProblema;

    private String descripcionReparacion;

    private boolean nuevoPresupuesto;

    private Reserva reserva;

    public Reparacion(Long idReparacion, Taller taller, Cliente cliente, List<Mecanico> mecanicos, Date fechaDevolucion, String horaDevolucion, Date fechaEntrada, String horaEntrada, BigDecimal importeTotal, Estado estadoReparacion, String descripcionProblema, String descripcionReparacion, boolean nuevoPresupuesto, Reserva reserva) {
        this.idReparacion = idReparacion;
        this.mecanicos = mecanicos;
        this.fechaDevolucion = fechaDevolucion;
        this.horaDevolucion = horaDevolucion;
        this.fechaEntrada = fechaEntrada;
        this.horaEntrada = horaEntrada;
        this.importeTotal = importeTotal;
        this.estadoReparacion = estadoReparacion;
        this.descripcionProblema = descripcionProblema;
        this.descripcionReparacion = descripcionReparacion;
        this.nuevoPresupuesto = nuevoPresupuesto;
        this.reserva = reserva;
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

    public String getHoraDevolucion() {
        return horaDevolucion;
    }

    public void setHoraDevolucion(String horaDevolucion) {
        this.horaDevolucion = horaDevolucion;
    }

    public Date getFechaEntrada() {
        return fechaEntrada;
    }

    public void setFechaEntrada(Date fechaEntrada) {
        this.fechaEntrada = fechaEntrada;
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

    public String getDescripcionProblema() {
        return descripcionProblema;
    }

    public void setDescripcionProblema(String descripcionProblema) {
        this.descripcionProblema = descripcionProblema;
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

    public String getHoraEntrada() {
        return horaEntrada;
    }

    public void setHoraEntrada(String horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public Reserva getReserva() {
        return reserva;
    }

    public void setReserva(Reserva reserva) {
        this.reserva = reserva;
    }
}
