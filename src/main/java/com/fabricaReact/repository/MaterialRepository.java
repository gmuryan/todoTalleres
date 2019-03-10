package com.fabricaReact.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.fabricaReact.model.Material;

@Repository("materialRepository")
public interface MaterialRepository extends JpaRepository<Material, Long>{
	
	List<Material> findByNombreStartsWithIgnoreCase (String nombre);

	@Query(value = "SELECT * FROM MATERIAL WHERE ID_PROVEEDOR = ?1", nativeQuery = true)
	List<Material> findMatByProvId(long idProveedor);

	@Query(value= "SELECT * FROM MATERIAL WHERE PUNTO_DE_PEDIDO >= STOCK", nativeQuery = true)
	List<Material> findMatsParaOC();

	@Query(value = "SELECT * FROM MATERIAL WHERE PUNTO_DE_PEDIDO  >= STOCK AND ID_PROVEEDOR = ?1", nativeQuery = true)
	List<Material> findMatsParaOCByProveedor(long idProveedor);

}
