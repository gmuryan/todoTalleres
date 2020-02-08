package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Resenia;
import com.uade.todoTalleres.repository.ReseniaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReseniaService {

    private ReseniaRepository reseñaRepository;

    public ReseniaService(ReseniaRepository reseñaRepository){
        this.reseñaRepository = reseñaRepository;
    }

    public Resenia save(Resenia reseña){
        return reseñaRepository.save(reseña);
    }

    public Optional<Resenia> findById (long id){
        Optional<Resenia> reseña = reseñaRepository.findById(id);
        return reseña;
    }

    public List<Resenia> findAll(){
        return reseñaRepository.findAll();
    }

    public List<Resenia> findAllByTaller(Long id){
        return reseñaRepository.findAllByTaller(id);
    }

    public void delete (Resenia reseña){
        reseñaRepository.delete(reseña);
    }

    public void deleteById (long id){
        reseñaRepository.deleteById(id);
    }
}
