package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Reseña;
import com.uade.todoTalleres.repository.ReseñaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReseñaService {

    private ReseñaRepository reseñaRepository;

    public ReseñaService(ReseñaRepository reseñaRepository){
        this.reseñaRepository = reseñaRepository;
    }

    public Reseña save(Reseña reseña){
        return reseñaRepository.save(reseña);
    }

    public Optional<Reseña> findById (long id){
        Optional<Reseña> reseña = reseñaRepository.findById(id);
        return reseña;
    }

    public List<Reseña> findAll(){
        return reseñaRepository.findAll();
    }

    public List<Reseña> findAllByTaller(Long id){
        return reseñaRepository.findAllByTaller(id);
    }

    public void delete (Reseña reseña){
        reseñaRepository.delete(reseña);
    }

    public void deleteById (long id){
        reseñaRepository.deleteById(id);
    }
}
