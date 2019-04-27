package com.uade.todoTalleres.repository;

import com.uade.todoTalleres.model.Reseña;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReseñaRepository extends JpaRepository<Reseña, Long> {
}
