package com.uade.todoTalleres.repository;

import com.uade.todoTalleres.model.Reparacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Repository
public interface ReparacionRepository extends JpaRepository<Reparacion, Long> {

    @Query(value = "SELECT * FROM REPARACION WHERE ID_TALLER = ?1", nativeQuery = true)
    List<Reparacion> findAllByTaller(Long id);

    @Query(value = "SELECT * FROM REPARACION WHERE ID_CLIENTE = ?1", nativeQuery = true)
    List<Reparacion> findAllByCliente(Long id);

    @Query(value = "select * from reparacion r inner join reparacion_mecanicos rm ON r.id_reparacion = rm.id_reparacion where rm.id_mecanico = ?1", nativeQuery = true)
    List<Reparacion> findAllByMecanico(Long id);

    @Query(value= "select count(*) \n" +
            "from reparacion \n" +
            "where (fecha_devolucion > ?1\n" +
            "and id_estado = 4 \n" +
            "and id_taller = ?3) or (fecha_devolucion = ?1 and hora_devolucion > ?2 and id_taller = ?3 and id_estado = 4) or (fecha_reserva = DATE(?1) and id_taller = ?3 and id_estado = 1)", nativeQuery = true)
    Integer validateEspacio (Date fecha, LocalTime hora, Long id);

    @Query(value = "select count(*) from mecanico m where m.id_mecanico NOT IN (select m.id_mecanico from reparacion r  inner join reparacion_mecanicos rm ON r.id_reparacion = rm.id_reparacion  inner join mecanico m ON rm.id_mecanico = m.id_mecanico where (id_estado = 4 and fecha_devolucion > ?1 and r.id_taller = ?3) or (id_estado = 4 and fecha_devolucion = ?1 and hora_devolucion > ?2 and r.id_taller = ?3) or (fecha_reserva = DATE(?1) and hora_reserva = ?2 and r.id_taller = ?3 and id_estado = 1))", nativeQuery = true)
    Integer validateMecanicos (Date fecha, LocalTime hora, Long id);
}
