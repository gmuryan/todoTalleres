package com.uade.todoTalleres.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.*;
import java.io.IOException;
import java.util.List;

@Entity
@Table(name = "taller")
public class Taller {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "TALLER_SEQ")
    @SequenceGenerator(name = "TALLER_SEQ", sequenceName = "TALLER_SEQ")
    private Long idTaller;

    @Column
    private String nombre;

    @Column
    private String telefono;

    @Column
    private String barrio;

    @Column
    private String mail;

    @Column
    private String ubicacion;

    @OneToOne
    @JoinColumn(name = "idMarca")
    private Marca marca;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "idTaller")
    private List<Reparacion> reparaciones;

    @JsonIgnore
    @OneToMany
    @JoinColumn(name = "idTaller")
    private List<Reseña> reseñas;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "idTaller")
    private List<Mecanico> mecanicos;

    @OneToOne
    @JoinColumn(name = "idClasificacion")
    private Clasificacion clasificacion;

    @Column
    private int maximosVehiculos;

    @Column
    private int retrasosContemplados;

    @Column
    private String password;

    @Column
    private String descripcionTaller;

    @Transient
    private String repeatPassword;



    public Taller(){

    }

    @JsonCreator
    public static Taller Create(String jsonString) throws JsonParseException, JsonMappingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        Taller taller = null;
        taller = mapper.readValue(jsonString, Taller.class);
        return taller;
    }

    public Taller(String nombre, String telefono, String barrio, String mail, String ubicacion, Marca marca, List<Reparacion> reparaciones, List<Mecanico> mecanicos, List<Reseña> reseñas, Clasificacion clasificacion, int maximosVehiculos, int retrasosContemplados, String password, String descripcionTaller) {
        this.nombre = nombre;
        this.telefono = telefono;
        this.barrio = barrio;
        this.mail = mail;
        this.ubicacion = ubicacion;
        this.marca = marca;
        this.reparaciones = reparaciones;
        this.mecanicos = mecanicos;
        this.reseñas = reseñas;
        this.clasificacion = clasificacion;
        this.maximosVehiculos = maximosVehiculos;
        this.retrasosContemplados = retrasosContemplados;
        this.password = password;
        this.descripcionTaller = descripcionTaller;
    }

    public Taller(Long idTaller, String nombre, String telefono, String barrio, String mail, String ubicacion, Marca marca, List<Reparacion> reparaciones, List<Mecanico> mecanicos, List<Reseña> reseñas, Clasificacion clasificacion, int maximosVehiculos, int retrasosContemplados, String password, String descripcionTaller) {
        this.idTaller = idTaller;
        this.nombre = nombre;
        this.telefono = telefono;
        this.barrio = barrio;
        this.mail = mail;
        this.ubicacion = ubicacion;
        this.marca = marca;
        this.reparaciones = reparaciones;
        this.mecanicos = mecanicos;
        this.reseñas = reseñas;
        this.clasificacion = clasificacion;
        this.maximosVehiculos = maximosVehiculos;
        this.retrasosContemplados = retrasosContemplados;
        this.password = password;
        this.descripcionTaller = descripcionTaller;
    }

    public Long getIdTaller() {
        return idTaller;
    }

    public void setIdTaller(Long idTaller) {
        this.idTaller = idTaller;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getBarrio() {
        return barrio;
    }

    public void setBarrio(String barrio) {
        this.barrio = barrio;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public Marca getMarca() {
        return marca;
    }

    public void setMarca(Marca marca) {
        this.marca = marca;
    }

    public List<Reparacion> getReparaciones() {
        return reparaciones;
    }

    public void setReparaciones(List<Reparacion> reparaciones) {
        this.reparaciones = reparaciones;
    }

    public List<Reseña> getReseñas() {
        return reseñas;
    }

    public void setReseñas(List<Reseña> reseñas) {
        this.reseñas = reseñas;
    }

    public Clasificacion getClasificacion() {
        return clasificacion;
    }

    public void setClasificacion(Clasificacion clasificacion) {
        this.clasificacion = clasificacion;
    }

    public int getMaximosVehiculos() {
        return maximosVehiculos;
    }

    public void setMaximosVehiculos(int maximosVehiculos) {
        this.maximosVehiculos = maximosVehiculos;
    }

    public int getRetrasosContemplados() {
        return retrasosContemplados;
    }

    public void setRetrasosContemplados(int retrasosContemplados) {
        this.retrasosContemplados = retrasosContemplados;
    }

    public List<Mecanico> getMecanicos() {
        return mecanicos;
    }

    public void setMecanicos(List<Mecanico> mecanicos) {
        this.mecanicos = mecanicos;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDescripcionTaller() {
        return descripcionTaller;
    }

    public void setDescripcionTaller(String descripcionTaller) {
        this.descripcionTaller = descripcionTaller;
    }
}
