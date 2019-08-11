package com.uade.todoTalleres.model;

import javax.persistence.*;

@Entity
@Table(name = "reseña")
public class Reseña {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "RESENIA_SEQ")
    @SequenceGenerator(name = "RESENIA_SEQ", sequenceName = "RESENIA_SEQ")
    private Long idReseña;

    @OneToOne
    @JoinColumn(name = "idCliente")
    private Cliente cliente;

    @OneToOne
    @JoinColumn(name = "idTaller")
    private Taller taller;

    @Column
    private String comentario;

    public Reseña(){

    }

    public Reseña(Long idReseña, Cliente cliente, Taller taller, String comentario) {
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
}
