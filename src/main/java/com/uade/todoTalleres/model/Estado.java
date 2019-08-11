package com.uade.todoTalleres.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.*;
import java.io.IOException;

@Entity
@Table(name = "estado")
public class Estado {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "ESTADO_SEQ")
    @SequenceGenerator(name = "ESTADO_SEQ", sequenceName = "ESTADO_SEQ")
    private Long idEstado;

    @Column
    private String descripcion;

    public Estado(){

    }

    @JsonCreator
    public static Estado Create(String jsonString) throws JsonParseException, JsonMappingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        Estado estado = null;
        estado = mapper.readValue(jsonString, Estado.class);
        return estado;
    }

    public Estado(String descripcion) {
        this.descripcion = descripcion;
    }

    public Estado(Long idEstado, String descripcion) {
        this.idEstado = idEstado;
        this.descripcion = descripcion;
    }

    public Long getIdEstado() {
        return idEstado;
    }

    public void setIdEstado(Long idEstado) {
        this.idEstado = idEstado;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
