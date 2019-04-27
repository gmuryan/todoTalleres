package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Clasificacion;
import com.uade.todoTalleres.repository.ClasificacionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClasificacionService {

    private ClasificacionRepository clasificacionRepository;

    public ClasificacionService(ClasificacionRepository clasificacionRepository){
        this.clasificacionRepository = clasificacionRepository;
    }

    public Clasificacion save (Clasificacion clasif){
        return clasificacionRepository.save(clasif);
    }

    public Optional<Clasificacion> findById (long id){
        Optional<Clasificacion> clasif = clasificacionRepository.findById(id);
        return clasif;
    }

    public List<Clasificacion> findAll(){
        return clasificacionRepository.findAll();
    }

    public void delete (Clasificacion clasif){
        clasificacionRepository.delete(clasif);
    }

    public void deleteById (long id){
        clasificacionRepository.deleteById(id);
    }
}
