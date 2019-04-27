package com.uade.todoTalleres.repository;

import com.uade.todoTalleres.model.Reparacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReparacionRepository extends JpaRepository<Reparacion, Long> {
}
