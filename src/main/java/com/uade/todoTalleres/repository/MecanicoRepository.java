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
}
