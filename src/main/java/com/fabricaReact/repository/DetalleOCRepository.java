package com.fabricaReact.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fabricaReact.model.DetalleOC;

@Repository("detalleOCRepository")
public interface DetalleOCRepository extends JpaRepository<DetalleOC, Long>{

}
