package com.uade.todoTalleres.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.*;
import java.io.IOException;
import java.util.List;

@Entity
@Table(name = "mecanico")
public class Mecanico {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "MECANICO_SEQ")
    @SequenceGenerator(name = "MECANICO_SEQ", sequenceName = "MECANICO_SEQ")
    private Long idMecanico;

    @Column
    private String nombre;

    @Column
    private String apellido;

    @Column
    private String telefono;

    @Column
    private String mail;

    @OneToOne
    @JoinColumn(name="idTaller")
    private Taller taller;

    @JsonIgnore
    @ManyToMany(fetch =FetchType.LAZY, mappedBy = "mecanicos")
    private List<Reparacion> reparaciones;

    public Mecanico(){

    }

    @JsonCreator
    public static Mecanico Create(String jsonString) throws JsonParseException, JsonMappingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        Mecanico mecanico = null;
        mecanico = mapper.readValue(jsonString, Mecanico.class);
        return mecanico;
    }

    public Mecanico(String nombre, String apellido, String telefono, String mail, Taller taller) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.mail = mail;
        this.taller = taller;
    }

    public Mecanico(Long idMecanico, String nombre, String apellido, String telefono, String mail, Taller taller) {
        this.idMecanico = idMecanico;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.mail = mail;
        this.taller = taller;
    }

    public Mecanico(String nombre, String apellido, String telefono, String mail, Taller taller, List<Reparacion> reparaciones) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.mail = mail;
        this.taller = taller;
        this.reparaciones = reparaciones;
    }

    public Long getIdMecanico() {
        return idMecanico;
    }

    public void setIdMecanico(Long idMecanico) {
        this.idMecanico = idMecanico;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public Taller getTaller() {
        return taller;
    }

    public void setTaller(Taller taller) {
        this.taller = taller;
    }

    public List<Reparacion> getReparaciones() {
        return reparaciones;
    }

    public void setReparaciones(List<Reparacion> reparaciones) {
        this.reparaciones = reparaciones;
    }
}
