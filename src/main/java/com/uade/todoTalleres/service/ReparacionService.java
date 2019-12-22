package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Estado;
import com.uade.todoTalleres.model.Reparacion;
import com.uade.todoTalleres.repository.EstadoRepository;
import com.uade.todoTalleres.repository.ReparacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReparacionService {

    private ReparacionRepository reparacionRepository;

    @Autowired
    private EstadoService estadoService;

    public ReparacionService(ReparacionRepository reparacionRepository){
        this.reparacionRepository = reparacionRepository;
    }

    public Reparacion save(Reparacion reparacion){
        return reparacionRepository.save(reparacion);
    }

    public Optional<Reparacion> findById (long id){
        Optional<Reparacion> reparacion = reparacionRepository.findById(id);
        return reparacion;
    }

    public List<Reparacion> findAll(){
        return reparacionRepository.findAll();
    }

    public List<Reparacion> findAllByTaller(Long id){
        return reparacionRepository.findAllByTaller(id);
    }

    public List<Reparacion> findAllByCliente(Long id){
        return reparacionRepository.findAllByCliente(id);
    }

    public List<Reparacion> findAllByMecanico(Long id){
        return reparacionRepository.findAllByMecanico(id);
    }

    public Integer validateEspacio(Date fecha, LocalTime hora, Long id){
        return reparacionRepository.validateEspacio(fecha, hora, id);
    }

    public Integer validateMecanicos(Date fecha, LocalTime hora, Long id){
        return reparacionRepository.validateMecanicos(fecha, hora, id);
    }

    @Transactional
    public void cancelarTurno(Reparacion reparacion){
        reparacionRepository.cancelarTurno(reparacion.getIdReparacion());
    }

    public void delete (Reparacion reparacion){
        reparacionRepository.delete(reparacion);
    }

    public void deleteById (long id){
        reparacionRepository.deleteById(id);
    }

    public Reparacion avanzarPendienteRegistracion(Reparacion reparacionEntity, Reparacion reparacionView){
        reparacionEntity.setModeloAuto(reparacionView.getModeloAuto());
        reparacionEntity.setPatenteAuto(reparacionView.getPatenteAuto());
        reparacionEntity.setMarcaAuto(reparacionView.getMarcaAuto());
        Optional<Estado> estado = estadoService.findById(reparacionEntity.getEstadoReparacion().getIdEstado()+1);
        reparacionEntity.setEstadoReparacion(estado.get());
        return reparacionRepository.save(reparacionEntity);
    }

    public Reparacion avanzarEnDiagnostico(Reparacion reparacionEntity, Reparacion reparacionView){
        reparacionEntity.getMecanicos().clear();
        reparacionEntity.setMecanicos(reparacionView.getMecanicos());
        reparacionEntity.setImporteTotal(reparacionView.getImporteTotal());
        reparacionEntity.setDescripcionProblemaTaller(reparacionView.getDescripcionProblemaTaller());
        Date fechaDevolucion = reparacionView.getFechaDevolucion();
        fechaDevolucion.setMonth((fechaDevolucion.getMonth() - 1 + 1) % 12 + 1);
        reparacionEntity.setFechaDevolucion(fechaDevolucion);
        Optional<Estado> estado = estadoService.findById(reparacionEntity.getEstadoReparacion().getIdEstado()+1);
        reparacionEntity.setEstadoReparacion(estado.get());
        reparacionEntity.setHoraDevolucion(reparacionView.getHoraDevolucion());
        return reparacionRepository.save(reparacionEntity);
    }

    public Reparacion avanzarPendienteConfirmacion(Reparacion reparacionEntity){
        Optional<Estado> estado = estadoService.findById(reparacionEntity.getEstadoReparacion().getIdEstado()+1);
        reparacionEntity.setEstadoReparacion(estado.get());
        return reparacionRepository.save(reparacionEntity);
    }

    public Reparacion avanzarEnReparacion(Reparacion reparacionEntity, Reparacion reparacionView){
        reparacionEntity.setDescripcionProblemaTaller(reparacionView.getDescripcionProblemaTaller());
        reparacionEntity.setDescripcionReparacion(reparacionView.getDescripcionReparacion());
        Optional<Estado> estado = estadoService.findById(reparacionEntity.getEstadoReparacion().getIdEstado()+1);
        reparacionEntity.setEstadoReparacion(estado.get());
        return reparacionRepository.save(reparacionEntity);
    }

    public Reparacion avanzarListoParaRetirar(Reparacion reparacionEntity){
        Optional<Estado> estado = estadoService.findById(reparacionEntity.getEstadoReparacion().getIdEstado()+1);
        reparacionEntity.setEstadoReparacion(estado.get());
        return reparacionRepository.save(reparacionEntity);
    }

    public Reparacion guardarCambios(Reparacion reparacion){
        Optional<Reparacion> r = this.findById(reparacion.getIdReparacion());
        if (r.get().getEstadoReparacion().getDescripcion().equalsIgnoreCase("En reparacion")){
            r.get().setMecanicos(reparacion.getMecanicos());
            r.get().setDescripcionReparacion(reparacion.getDescripcionReparacion());
            r.get().setDescripcionProblemaTaller(reparacion.getDescripcionProblemaTaller());
            if (reparacion.isNuevoPresupuesto()){
                r.get().setNuevoPresupuesto(reparacion.isNuevoPresupuesto());
                r.get().setImporteTotal(reparacion.getImporteTotal());
                Optional<Estado> PendienteConfirmacion = estadoService.findById(3);
                r.get().setEstadoReparacion(PendienteConfirmacion.get());
            }
        }
        return reparacionRepository.save(r.get());
    }

    public Optional<Reparacion> updateNuevoPresupuesto(Long id){
        Optional<Reparacion> r = this.findById(id);
        r.get().setNuevoPresupuesto(false);
        this.save(r.get());
        return r;
    }
}
