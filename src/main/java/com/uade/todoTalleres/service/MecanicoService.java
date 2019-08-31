package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Mecanico;
import com.uade.todoTalleres.repository.MecanicoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MecanicoService {

    private MecanicoRepository mecanicoRepository;

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

    public void deleteById (long id){
        mecanicoRepository.deleteById(id);
    }
}
