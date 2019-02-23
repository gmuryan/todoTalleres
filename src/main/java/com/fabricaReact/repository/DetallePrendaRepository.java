package com.fabricaReact.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.fabricaReact.model.DetallePrenda;

@Repository("detallePrendaRepository")
public interface DetallePrendaRepository extends JpaRepository<DetallePrenda, Long>{
	
	@Query(value = "SELECT * FROM DETALLE_PRENDA WHERE ID_PRENDA = ?1", nativeQuery = true)
	List<DetallePrenda> findAllByIdPrenda(long id);
	
	@Modifying
	@Query(value = "UPDATE DETALLE_PRENDA SET ID_PRENDA = ?1 WHERE ID_DETALLE_PRENDA = ?2", nativeQuery = true)
	void updatePrenda (long idPrenda, long idDetallePrenda);

}
