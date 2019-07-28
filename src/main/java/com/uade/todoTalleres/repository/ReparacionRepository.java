package com.uade.todoTalleres.repository;

import com.uade.todoTalleres.model.Reparacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReparacionRepository extends JpaRepository<Reparacion, Long> {

    @Query(value = "SELECT * FROM REPARACION WHERE ID_TALLER = ?1", nativeQuery = true)
    List<Reparacion> findAllByTaller(Long id);

    @Query(value = "SELECT * FROM REPARACION WHERE ID_CLIENTE = ?1", nativeQuery = true)
    List<Reparacion> findAllByCliente(Long id);
}
