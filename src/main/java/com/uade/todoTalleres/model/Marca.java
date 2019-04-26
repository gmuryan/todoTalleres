package com.uade.todoTalleres.model;

public class Marca {

    private Long idMarca;

    private String descripcion;

    public Marca(Long idMarca) {
        this.idMarca = idMarca;
        this.descripcion = descripcion;
    }

    public Long getIdMarca() {
        return idMarca;
    }

    public void setIdMarca(Long idMarca) {
        this.idMarca = idMarca;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
