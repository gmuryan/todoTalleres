package com.uade.todoTalleres.model;

import java.util.List;

public class Taller {

    private Long idTaller;

    private String nombre;

    private String telefono;

    private String barrio;

    private String mail;

    private String ubicacion;

    private List<Marca> marcas;

    private List<Reserva> reservas;

    private List<Reparacion> reparaciones;

    private List<Reseña> reseñas;

    private Clasificacion clasificacion;

    private int maximosVehiculos;

    private int retrasosContemplados;

    public Taller(Long idTaller, String nombre, String telefono, String barrio, String mail, String ubicacion, List<Marca> marcas, List<Reserva> reservas, List<Reparacion> reparaciones, List<Reseña> reseñas, Clasificacion clasificacion, int maximosVehiculos, int retrasosContemplados) {
        this.idTaller = idTaller;
        this.nombre = nombre;
        this.telefono = telefono;
        this.barrio = barrio;
        this.mail = mail;
        this.ubicacion = ubicacion;
        this.marcas = marcas;
        this.reservas = reservas;
        this.reparaciones = reparaciones;
        this.reseñas = reseñas;
        this.clasificacion = clasificacion;
        this.maximosVehiculos = maximosVehiculos;
        this.retrasosContemplados = retrasosContemplados;
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

    public List<Marca> getMarcas() {
        return marcas;
    }

    public void setMarcas(List<Marca> marcas) {
        this.marcas = marcas;
    }

    public List<Reserva> getReservas() {
        return reservas;
    }

    public void setReservas(List<Reserva> reservas) {
        this.reservas = reservas;
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
}
