package com.fabricaReact.model;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.*;

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
	
	@Column (nullable = true)
	private String estacion;
	
	@Column (nullable = true)
	private float porcentaje;
	
	@Column
	private int stock;
	
	@Column
	private boolean temporada;

	@Column
	private int puntoDePedido;

	@Column(name = "precio", precision = 10, scale = 2)
	private BigDecimal precio;

	public Prenda(String nombre, List<DetallePrenda> detallePrendas, String estacion, float porcentaje, int stock,
			boolean temporada, int puntoDePedido) {
		super();
		this.nombre = nombre;
		this.detallePrendas = detallePrendas;
		this.estacion = estacion;
		this.porcentaje = porcentaje;
		this.stock = stock;
		this.temporada = temporada;
		this.puntoDePedido = puntoDePedido;
		if (this.detallePrendas != null)
			this.precio = this.calcularPrecio();
	}

	public BigDecimal calcularPrecio(){
		BigDecimal precio = new BigDecimal(0);
		for (DetallePrenda dp : this.detallePrendas){
			precio = precio.add(dp.getMaterial().getPrecio().multiply(new BigDecimal(dp.getCantidad())));
		}
		if (this.temporada){
			BigDecimal extra = new BigDecimal(0);
			float aux = this.porcentaje/100;
			BigDecimal porc = new BigDecimal(aux);
			extra = precio.multiply(porc);
			precio = precio.add(extra);
		}

		return precio;
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

	public int getPuntoDePedido() {
		return puntoDePedido;
	}

	public void setPuntoDePedido(int puntoDePedido) {
		this.puntoDePedido = puntoDePedido;
	}

	public BigDecimal getPrecio() {
		return precio;
	}

	public void setPrecio(BigDecimal precio) {
		this.precio = precio;
	}
}
