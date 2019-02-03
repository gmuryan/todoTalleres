package com.fabricaReact.model;

import java.math.BigDecimal;
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
@Table(name="Factura")
public class Factura {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long idFactura;
	
	@OneToMany (cascade = CascadeType.ALL)
	@JoinColumn(name="idFactura")
	private List<DetalleFactura> detallesFactura;
	
	@Column(name = "total", precision = 10, scale = 2)
	private BigDecimal total;
	
	public Factura() {
		super();
	}

	public Factura(List<DetalleFactura> detallesFactura, BigDecimal total) {
		super();
		this.detallesFactura = detallesFactura;
		this.total = total;
	}

	public long getIdFactura() {
		return idFactura;
	}

	public void setIdFactura(long idFactura) {
		this.idFactura = idFactura;
	}

	public List<DetalleFactura> getDetallesFactura() {
		return detallesFactura;
	}

	public void setDetallesFactura(List<DetalleFactura> detallesFactura) {
		this.detallesFactura = detallesFactura;
	}

	public BigDecimal getTotal() {
		return total;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}
	
	
}
