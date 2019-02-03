package com.fabricaReact.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fabricaReact.model.DetallePrenda;

@Repository("detallePrendaRepository")
public interface DetallePrendaRepository extends JpaRepository<DetallePrenda, Long>{

}
