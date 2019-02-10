package com.fabricaReact.model;

import java.io.IOException;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;


@Entity
@Table(name="Proveedor")
public class Proveedor {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long idProveedor;
	
	@Column
	private String razonSocial;
	
	@Column
	private String cuit;
	
	public Proveedor() {
	}

	public Proveedor(String razonSocial, String cuit) {
		super();
		this.razonSocial = razonSocial;
		this.cuit = cuit;
	}
	
	//Para pasar los json a clase de java
    @JsonCreator
    public static Proveedor Create(String jsonString) throws JsonParseException, JsonMappingException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        Proveedor prov = null;
        prov = mapper.readValue(jsonString, Proveedor.class);
        return prov;
    }


	public long getIdProveedor() {
		return idProveedor;
	}

	public void setIdProveedor(long idProveedor) {
		this.idProveedor = idProveedor;
	}

	public String getRazonSocial() {
		return razonSocial;
	}

	public void setRazonSocial(String razonSocial) {
		this.razonSocial = razonSocial;
	}

	public String getCuit() {
		return cuit;
	}

	public void setCuit(String cuit) {
		this.cuit = cuit;
	}
	
	
}
