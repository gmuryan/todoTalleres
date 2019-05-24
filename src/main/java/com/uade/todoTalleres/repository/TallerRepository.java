package com.uade.todoTalleres.repository;

import com.uade.todoTalleres.model.Taller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TallerRepository extends JpaRepository<Taller, Long> {

    Optional<Taller> findByMail(String mail);
}
