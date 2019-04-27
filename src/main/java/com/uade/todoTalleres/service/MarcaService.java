package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Marca;
import com.uade.todoTalleres.repository.MarcaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarcaService {

    private MarcaRepository marcaRepository;

    public MarcaService (MarcaRepository marcaRepository){
        this.marcaRepository = marcaRepository;
    }

    public Marca save(Marca marca){
        return marcaRepository.save(marca);
    }

    public Optional<Marca> findById (long id){
        Optional<Marca> marca = marcaRepository.findById(id);
        return marca;
    }

    public List<Marca> findAll(){
        return marcaRepository.findAll();
    }

    public void delete (Marca marca){
        marcaRepository.delete(marca);
    }

    public void deleteById (long id){
        marcaRepository.deleteById(id);
    }
}
