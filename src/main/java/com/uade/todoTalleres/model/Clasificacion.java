package com.uade.todoTalleres.model;

public class Clasificacion {

    private Long idClasificacion;

    private String descripcion;

    public Clasificacion(Long idClasificacion, String descripcion) {
        this.idClasificacion = idClasificacion;
        this.descripcion = descripcion;
    }

    public Long getIdClasificacion() {
        return idClasificacion;
    }

    public void setIdClasificacion(Long idClasificacion) {
        this.idClasificacion = idClasificacion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
