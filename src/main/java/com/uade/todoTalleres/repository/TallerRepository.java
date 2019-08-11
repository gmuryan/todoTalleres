package com.uade.todoTalleres.repository;

import com.uade.todoTalleres.model.Mecanico;
import com.uade.todoTalleres.model.Taller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface TallerRepository extends JpaRepository<Taller, Long> {

    Optional<Taller> findByMail(String mail);

    @Query(value = "select * from mecanico m where m.id_mecanico NOT IN (select m.id_mecanico from reparacion r  inner join reparacion_mecanicos rm ON r.id_reparacion = rm.id_reparacion  inner join mecanico m ON rm.id_mecanico = m.id_mecanico where (id_estado = 4 and fecha_devolucion > ?1 and r.id_taller = ?3) or (id_estado = 4 and fecha_devolucion = ?1 and hora_devolucion > ?2 and r.id_taller = ?3))", nativeQuery = true)
    List<Object[]> getMecanicosLibres (Date fecha, LocalTime hora, Long id);
}
