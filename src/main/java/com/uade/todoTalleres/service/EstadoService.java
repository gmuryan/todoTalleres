package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Estado;
import com.uade.todoTalleres.repository.EstadoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EstadoService {

    private EstadoRepository estadoRepository;

    public EstadoService (EstadoRepository estadoRepository){
        this.estadoRepository = estadoRepository;
    }

    public Estado save(Estado estado){
        return estadoRepository.save(estado);
    }

    public Optional<Estado> findById (long id){
        Optional<Estado> estado = estadoRepository.findById(id);
        return estado;
    }

    public List<Estado> findAll(){
        return estadoRepository.findAll();
    }

    public void delete (Estado estado){
        estadoRepository.delete(estado);
    }

    public void deleteById (long id){
        estadoRepository.deleteById(id);
    }
}
