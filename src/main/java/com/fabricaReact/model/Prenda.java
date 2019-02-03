package com.fabricaReact.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="Prenda")
public class Prenda {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long idPrenda;
	
	@Column
	private String nombre;
	
	@OneToMany (cascade = CascadeType.ALL)
	@JoinColumn(name="idPrenda")
	private List<DetallePrenda> detallePrendas;
	
	@Column
	private String estacion;
	
	@Column
	private float porcentaje;
	
	@Column
	private int stock;
	
	@Column
	private boolean temporada;

	public Prenda(String nombre, List<DetallePrenda> detallePrendas, String estacion, float porcentaje, int stock,
			boolean temporada) {
		super();
		this.nombre = nombre;
		this.detallePrendas = detallePrendas;
		this.estacion = estacion;
		this.porcentaje = porcentaje;
		this.stock = stock;
		this.temporada = temporada;
	}
	
	public Prenda() {
		super();
	}

	public long getIdPrenda() {
		return idPrenda;
	}

	public void setIdPrenda(long idPrenda) {
		this.idPrenda = idPrenda;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public List<DetallePrenda> getDetallePrendas() {
		return detallePrendas;
	}

	public void setDetallePrendas(List<DetallePrenda> detallePrendas) {
		this.detallePrendas = detallePrendas;
	}

	public String getEstacion() {
		return estacion;
	}

	public void setEstacion(String estacion) {
		this.estacion = estacion;
	}

	public float getPorcentaje() {
		return porcentaje;
	}

	public void setPorcentaje(float porcentaje) {
		this.porcentaje = porcentaje;
	}

	public int getStock() {
		return stock;
	}

	public void setStock(int stock) {
		this.stock = stock;
	}

	public boolean isTemporada() {
		return temporada;
	}

	public void setTemporada(boolean temporada) {
		this.temporada = temporada;
	}
	
	
	
	
}
