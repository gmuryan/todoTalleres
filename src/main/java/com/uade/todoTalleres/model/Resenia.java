package com.uade.todoTalleres.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "reseña")
public class Resenia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idReseña;

    @OneToOne
    @JoinColumn(name = "idCliente")
    private Cliente cliente;

    @OneToOne
    @JoinColumn(name = "idTaller")
    private Taller taller;

    @Column
    @Temporal(TemporalType.DATE)
    private Date fechaReseña;

    @Column
    private String comentario;

    private Integer puntuacion;

    public Resenia(){

    }

    public Resenia(Long idReseña, Cliente cliente, Taller taller, String comentario, Integer puntuacion) {
        this.idReseña = idReseña;
        this.cliente = cliente;
        this.taller = taller;
        this.comentario = comentario;
    }

    public Long getIdReseña() {
        return idReseña;
    }

    public void setIdReseña(Long idReseña) {
        this.idReseña = idReseña;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Taller getTaller() {
        return taller;
    }

    public void setTaller(Taller taller) {
        this.taller = taller;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public Date getFechaReseña() {
        return fechaReseña;
    }

    public void setFechaReseña(Date fechaReseña) {
        this.fechaReseña = fechaReseña;
    }

    public Integer getPuntuacion() {
        return puntuacion;
    }

    public void setPuntuacion(Integer puntuacion) {
        this.puntuacion = puntuacion;
    }
}
