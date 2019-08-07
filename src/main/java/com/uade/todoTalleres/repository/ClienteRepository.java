package com.uade.todoTalleres.repository;

import com.uade.todoTalleres.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByMail(String mail);

    @Query(value = "SELECT * FROM CLIENTE WHERE APELLIDO = 'EXTERNO'", nativeQuery = true)
    Cliente getClienteExterno();

}
