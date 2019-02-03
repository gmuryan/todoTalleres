package com.fabricaReact.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fabricaReact.model.Prenda;

@Repository("prendaRepository")
public interface PrendaRepository extends JpaRepository<Prenda, Long>{

	List<Prenda> findByNombreStartsWithIgnoreCase(String nombre);

}
