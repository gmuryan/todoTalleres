package com.fabricaReact.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fabricaReact.model.DetalleFactura;

@Repository("detalleFacturaRepository")
public interface DetalleFacturaRepository extends JpaRepository<DetalleFactura, Long>{

}
