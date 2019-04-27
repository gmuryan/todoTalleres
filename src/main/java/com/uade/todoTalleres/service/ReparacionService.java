package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Reparacion;
import com.uade.todoTalleres.repository.ReparacionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReparacionService {

    private ReparacionRepository reparacionRepository;

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

    public void delete (Reparacion reparacion){
        reparacionRepository.delete(reparacion);
    }

    public void deleteById (long id){
        reparacionRepository.deleteById(id);
    }
}
