package com.uade.todoTalleres.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.*;
import java.io.IOException;

@Entity
@Table
public class Marca {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "MARCA_SEQ")
    @SequenceGenerator(name = "MARCA_SEQ", sequenceName = "MARCA_SEQ")
    private Long idMarca;

    @Column
    private String descripcion;

    public Marca(){

    }

    public Marca(Long idMarca, String descripcion) {
        this.idMarca = idMarca;
        this.descripcion = descripcion;
    }

    public Marca(String descripcion){
        this.descripcion = descripcion;
    }

    @JsonCreator
    public static Marca Create(String jsonString) throws JsonParseException, JsonMappingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        Marca marca = null;
        marca = mapper.readValue(jsonString, Marca.class);
        return marca;
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
