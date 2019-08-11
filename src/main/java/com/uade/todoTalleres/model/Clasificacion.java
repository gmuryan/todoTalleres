package com.uade.todoTalleres.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.*;
import java.io.IOException;

@Entity
@Table(name ="clasificacion")
public class Clasificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "CLASIFICACION_SEQ")
    @SequenceGenerator(name = "CLASIFICACION_SEQ", sequenceName = "CLASIFICACION_SEQ")
    private Long idClasificacion;

    @Column
    private String descripcion;

    public Clasificacion(){

    }

    public Clasificacion(Long idClasificacion, String descripcion) {
        this.idClasificacion = idClasificacion;
        this.descripcion = descripcion;
    }

    public Clasificacion(String descripcion){
        this.descripcion = descripcion;
    }

    @JsonCreator
    public static Clasificacion Create(String jsonString) throws JsonParseException, JsonMappingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        Clasificacion clasif = null;
        clasif = mapper.readValue(jsonString, Clasificacion.class);
        return clasif;
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
