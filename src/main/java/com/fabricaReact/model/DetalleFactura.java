package com.fabricaReact.model;

import java.math.BigDecimal;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table (name="DetalleFactura")
public class DetalleFactura {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long idDetalleFactura;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name="idPrenda")
	private Prenda prenda;
	
	@Column(name = "importe", precision = 10, scale = 2)
	private BigDecimal importe;
	
	@Column
	private int cantidad;
	
	public DetalleFactura() {
		super();
	}

	public DetalleFactura(Prenda prenda, BigDecimal importe, int cantidad) {
		super();
		this.prenda = prenda;
		this.importe = importe;
		this.cantidad = cantidad;
	}

	
	
	public int getCantidad() {
		return cantidad;
	}



	public void setCantidad(int cantidad) {
		this.cantidad = cantidad;
	}



	public long getIdDetalleFactura() {
		return idDetalleFactura;
	}

	public void setIdDetalleFactura(long idDetalleFactura) {
		this.idDetalleFactura = idDetalleFactura;
	}

	public Prenda getPrenda() {
		return prenda;
	}

	public void setPrenda(Prenda prenda) {
		this.prenda = prenda;
	}

	public BigDecimal getImporte() {
		return importe;
	}

	public void setImporte(BigDecimal importe) {
		this.importe = importe;
	}
	
	
}
