package com.uade.todoTalleres.model;

import javax.persistence.*;

@Entity
@Table
public class Marca {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idMarca;

    @Column
    private String descripcion;

    public Marca(){

    }

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
