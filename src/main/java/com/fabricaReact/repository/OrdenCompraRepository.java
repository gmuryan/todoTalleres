package com.fabricaReact.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fabricaReact.model.OrdenCompra;

@Repository("ordenCompraRepository")
public interface OrdenCompraRepository extends JpaRepository<OrdenCompra, Long>{

}
