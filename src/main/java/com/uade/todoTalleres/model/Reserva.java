package com.uade.todoTalleres.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "reserva")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idReserva;

    @OneToOne
    @JoinColumn(name = "idTaller")
    private Taller taller;

    @OneToOne
    @JoinColumn(name = "idCliente")
    private Cliente cliente;

    @Column
    private String horaReserva;

    @Column
    private Date diaReserva;

    public Reserva(){

    }

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
