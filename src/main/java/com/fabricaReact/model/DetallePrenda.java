package com.fabricaReact.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name="DetallePrenda")
public class DetallePrenda {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long idDetallePrenda;
	
	@Column
	private int cantidad;
	
	@OneToOne
	@JoinColumn(name="idMaterial")
	private Material material;

	
	
	public DetallePrenda() {
		super();
	}

	public DetallePrenda(int cantidad, Material material) {
		super();
		this.cantidad = cantidad;
		this.material = material;
	}

	public long getIdDetallePrenda() {
		return idDetallePrenda;
	}

	public void setIdDetallePrenda(long idDetallePrenda) {
		this.idDetallePrenda = idDetallePrenda;
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
