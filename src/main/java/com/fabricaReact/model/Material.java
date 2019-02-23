package com.fabricaReact.model;

import java.io.IOException;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Entity
@Table(name="Material")
public class Material {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long idMaterial;
	
	@Column
	private String nombre;
	
	@Column
	private int stock;
	
	@Column
	private int puntoDePedido;
	
	@OneToOne
	@JoinColumn(name="idProveedor")
	private Proveedor proveedor;
	
	@Column(name = "precio", precision = 10, scale = 2)
	private BigDecimal precio;

	
	
	public Material() {
		super();
	}

	public Material(String nombre, int stock, int puntoDePedido, Proveedor proveedor, BigDecimal precio) {
		super();
		this.nombre = nombre;
		this.stock = stock;
		this.puntoDePedido = puntoDePedido;
		this.proveedor = proveedor;
		this.precio = precio;
	}
	
	@JsonCreator
	public static Material Create(String jsonString)throws JsonParseException, JsonMappingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        Material mat = null;
        mat = mapper.readValue(jsonString, Material.class);
        return mat;
	}
	
	public Material(String nombre, int stock, int puntoDePedido, BigDecimal precio) {
		super();
		this.nombre = nombre;
		this.stock = stock;
		this.puntoDePedido = puntoDePedido;
		this.precio = precio;
	}

	public long getIdMaterial() {
		return idMaterial;
	}

	public void setIdMaterial(long idMaterial) {
		this.idMaterial = idMaterial;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public int getStock() {
		return stock;
	}

	public void setStock(int stock) {
		this.stock = stock;
	}

	public int getPuntoDePedido() {
		return puntoDePedido;
	}

	public void setPuntoDePedido(int puntoDePedido) {
		this.puntoDePedido = puntoDePedido;
	}

	public Proveedor getProveedor() {
		return proveedor;
	}

	public void setProveedor(Proveedor proveedor) {
		this.proveedor = proveedor;
	}

	public BigDecimal getPrecio() {
		return precio;
	}

	public void setPrecio(BigDecimal precio) {
		this.precio = precio;
	}
	
	
}
