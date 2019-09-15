package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Mecanico;
import com.uade.todoTalleres.model.Reparacion;
import com.uade.todoTalleres.repository.MecanicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MecanicoService {

    private MecanicoRepository mecanicoRepository;

    @Autowired
    private ReparacionService reparacionService;

    public MecanicoService(MecanicoRepository mecanicoRepository){
        this.mecanicoRepository = mecanicoRepository;
    }

    public Mecanico save(Mecanico mecanico){
        return mecanicoRepository.save(mecanico);
    }

    public Optional<Mecanico> findById (long id){
        Optional<Mecanico> mecanico = mecanicoRepository.findById(id);
        return mecanico;
    }

    public List<Mecanico> findAll(){
        return mecanicoRepository.findAll();
    }

    public List<Mecanico> findAllByTaller(Long id){
        return mecanicoRepository.findAllByTaller(id);
    }

    public Integer conseguirCantidadDeReparacionesPorMecanico (Long id){
        return mecanicoRepository.conseguirCantidadDeReparacionesPorMecanico(id);
    }

    public void delete (Mecanico mecanico){
        mecanicoRepository.delete(mecanico);
    }

    public List<Integer> getMecanicosReparaciones(Long id, Integer mes){
        List<Reparacion> reparaciones = reparacionService.findAllByTaller(id);
        List<Integer> result = new ArrayList<>();
        HashMap<Long, Integer> reparacionesPorMecanico = new HashMap<>();
        for (Reparacion reparacion : reparaciones){
            if (!reparacion.getMecanicos().isEmpty() && !reparacion.getEstadoReparacion().getDescripcion().equalsIgnoreCase("Cancelado")) {
                Date aux = reparacion.getFechaReserva();
                Calendar calendar = Calendar.getInstance();
                Calendar calendarAux = Calendar.getInstance();
                calendar.setTime(aux);
                if (calendar.get(Calendar.MONTH) == mes && calendarAux.get(Calendar.YEAR) == calendar.get(Calendar.YEAR)) {
                    for (Mecanico m : reparacion.getMecanicos()) {
                        if (reparacionesPorMecanico.containsKey(m.getIdMecanico())) {
                            int value = reparacionesPorMecanico.get(m.getIdMecanico());
                            reparacionesPorMecanico.put(m.getIdMecanico(), value + 1);
                        } else {
                            reparacionesPorMecanico.put(m.getIdMecanico(), 1);
                        }
                    }
                }
            }
        }
        reparacionesPorMecanico.forEach((idMec, cantReparaciones) -> {
            result.add(cantReparaciones);
        });
        return result;
    }

    public void deleteById (long id){
        mecanicoRepository.deleteById(id);
    }
}
