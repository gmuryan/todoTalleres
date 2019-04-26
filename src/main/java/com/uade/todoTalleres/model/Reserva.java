package com.uade.todoTalleres.model;

import java.util.Date;

public class Reserva {

    private Long idReserva;

    private Taller taller;

    private Cliente cliente;

    private String horaReserva;

    private Date diaReserva;

    public Reserva(Long idReserva, Taller taller, Cliente cliente , String horaReserva, Date diaReserva) {
        this.idReserva = idReserva;
        this.taller = taller;
        this.cliente = cliente;
        this.horaReserva = horaReserva;
        this.diaReserva = diaReserva;
    }

    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
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

    public String getHoraReserva() {
        return horaReserva;
    }

    public void setHoraReserva(String horaReserva) {
        this.horaReserva = horaReserva;
    }

    public Date getDiaReserva() {
        return diaReserva;
    }

    public void setDiaReserva(Date diaReserva) {
        this.diaReserva = diaReserva;
    }
}
