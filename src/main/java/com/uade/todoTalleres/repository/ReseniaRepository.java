package com.uade.todoTalleres.repository;

import com.uade.todoTalleres.model.Resenia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReseniaRepository extends JpaRepository<Resenia, Long> {

    @Query(value = "SELECT * FROM reseña WHERE ID_TALLER = ?1", nativeQuery = true)
    List<Resenia> findAllByTaller(Long id);
}
