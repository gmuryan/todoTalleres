package com.uade.todoTalleres.repository;

import com.uade.todoTalleres.model.Mecanico;
import com.uade.todoTalleres.model.Taller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface TallerRepository extends JpaRepository<Taller, Long> {

    Optional<Taller> findByMail(String mail);

    @Query(value = "select * from mecanico m where m.activo = 1 and m.id_mecanico NOT IN (select m.id_mecanico from reparacion r  inner join reparacion_mecanicos rm ON r.id_reparacion = rm.id_reparacion  inner join mecanico m ON rm.id_mecanico = m.id_mecanico where (id_estado = 4 and fecha_devolucion > ?1 and r.id_taller = ?3) or (id_estado = 4 and fecha_devolucion = DATE(?1) and hora_devolucion > ?2 and r.id_taller = ?3) or (fecha_reserva = DATE(?1) and hora_reserva = ?2 and r.id_taller = ?3 and id_estado = 1))", nativeQuery = true)
    List<Object[]> getMecanicosLibres(Date fecha, LocalTime hora, Long id);

    @Query(value = "select id_reparacion from reparacion where id_taller = ?1 and cancelado_recientemente = true and cancelado_por_taller = false", nativeQuery = true)
    List<Long> getCancelacionesRecientesTaller(Long id);

    @Modifying
    @Query(value = "update reparacion set cancelado_recientemente = 0 where id_taller = ?1", nativeQuery = true)
    void updateCancelacionesRecientesTaller(Long id);
}
