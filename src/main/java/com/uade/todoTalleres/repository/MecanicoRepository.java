package com.uade.todoTalleres.repository;

import com.uade.todoTalleres.model.Mecanico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MecanicoRepository extends JpaRepository<Mecanico, Long> {

    @Query(value = "SELECT * FROM MECANICO WHERE ID_TALLER = ?1", nativeQuery = true)
    List<Mecanico> findAllByTaller(Long id);

    @Query(value = "select count(*) from reparacion_mecanicos rm inner join reparacion r ON rm.id_reparacion = r.id_reparacion where rm.id_mecanico = ?1 and r.id_estado in (1, 2, 3, 4)", nativeQuery = true)
    Integer conseguirCantidadDeReparacionesPorMecanico (Long id);
}
