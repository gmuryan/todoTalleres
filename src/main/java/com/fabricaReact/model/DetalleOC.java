package com.fabricaReact.model;

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
@Table(name="DetalleOC")
public class DetalleOC {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long idDetalleOC;
	
	@Column
	private int cantidad;
	
	@OneToOne
	@JoinColumn(name="idMaterial")
	private Material material;
	
	public DetalleOC() {
		super();
	}

	public DetalleOC(int cantidad, Material material) {
		super();
		this.cantidad = cantidad;
		this.material = material;
	}
	
	public long getIdDetalleOC() {
		return idDetalleOC;
	}

	public void setIdDetalleOC(long idDetalleOC) {
		this.idDetalleOC = idDetalleOC;
	}

	public int getCantidad() {
		return cantidad;
	}

	public void setCantidad(int cantidad) {
		this.cantidad = cantidad;
	}

	public Material getMaterial() {
		return material;
	}

	public void setMaterial(Material material) {
		this.material = material;
	}
	
	
}
