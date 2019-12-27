package com.uade.todoTalleres.repository;

import com.uade.todoTalleres.model.Cliente;
import com.uade.todoTalleres.model.Reparacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByMail(String mail);

    @Query(value = "SELECT * FROM CLIENTE WHERE APELLIDO = 'EXTERNO'", nativeQuery = true)
    Cliente getClienteExterno();

    @Query(value = "select * from reparacion where id_reparacion in (select r.id_reparacion from reparacion r inner join cliente c ON r.id_cliente = c.id_cliente where r.nuevo_presupuesto = true and r.id_cliente = ?1)", nativeQuery = true)
    List<Object[]> getReparacionesNuevoPresupuesto(Long id);

    @Query(value = "select id_reparacion from reparacion where id_cliente = ?1 and cancelado_recientemente = true and cancelado_por_taller = true", nativeQuery = true)
    List<Long> getCancelacionesRecientesCliente(Long id);

    @Modifying
    @Query(value = "update reparacion set nuevo_presupuesto = 0 where id_cliente = ?1", nativeQuery = true)
    void updateNuevasReparacionesCliente(Long id);

    @Modifying
    @Query(value = "update reparacion set cancelado_recientemente = 0 where id_cliente = ?1", nativeQuery = true)
    void updateCancelacionesRecientesCliente(Long id);

}
