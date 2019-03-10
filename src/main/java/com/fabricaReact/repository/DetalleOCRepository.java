package com.fabricaReact.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.fabricaReact.model.DetalleOC;

import java.util.List;

@Repository("detalleOCRepository")
public interface DetalleOCRepository extends JpaRepository<DetalleOC, Long>{

    @Query(value = "SELECT * FROM DETALLEOC WHERE IDOC = ?1", nativeQuery = true)
    List<DetalleOC> findAllByIdOC(long id);
}
