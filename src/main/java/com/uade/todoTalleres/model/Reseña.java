package com.uade.todoTalleres.model;

public class Reseña {

    private Long idReseña;

    private Cliente cliente;

    private Taller taller;

    private String comentario;

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
