package com.fabricaReact.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fabricaReact.model.Proveedor;

public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {

	List<Proveedor> findByRazonSocialStartsWithIgnoreCase (String razonSocial);
	
	List<Proveedor> findByCuitStartingWith (String cuit);

}
