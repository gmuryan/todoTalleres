package com.fabricaReact.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name="OrdenCompra")
public class OrdenCompra {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long idOC;
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name="idProveedor")
	private Proveedor proveedor;
	
	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn (name="idOC")
	private List<DetalleOC> detallesOC;

	public OrdenCompra() {
		super();
	}

	public OrdenCompra(Proveedor proveedor, List<DetalleOC> detallesOC) {
		super();
		this.proveedor = proveedor;
		this.detallesOC = detallesOC;
	}
	
	public long getIdOC() {
		return idOC;
	}

	public void setIdOC(long idOC) {
		this.idOC = idOC;
	}

	public Proveedor getProveedor() {
		return proveedor;
	}

	public void setProveedor(Proveedor proveedor) {
		this.proveedor = proveedor;
	}

	public List<DetalleOC> getDetallesOC() {
		return detallesOC;
	}

	public void setDetallesOC(List<DetalleOC> detallesOC) {
		this.detallesOC = detallesOC;
	}
	
	
}
