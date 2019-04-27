package com.uade.todoTalleres.model;

import javax.persistence.*;

@Entity
@Table(name ="clasificacion")
public class Clasificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idClasificacion;

    @Column
    private String descripcion;

    public Clasificacion(){

    }

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
