package com.fabricaReact.service;

import com.fabricaReact.model.DetalleOC;
import com.fabricaReact.repository.DetalleOCRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DetalleOCService {

    private final DetalleOCRepository detalleOCRepository;

    public DetalleOCService (DetalleOCRepository detalleOCRepository){
        this.detalleOCRepository = detalleOCRepository;
    }

    public List<DetalleOC> findAll(){
        return detalleOCRepository.findAll();
    }

    public List<DetalleOC> findAllById (long id){
        return detalleOCRepository.findAllByIdOC(id);
    }

    public void delete (DetalleOC detalleOC){
        detalleOCRepository.delete(detalleOC);
    }

    public DetalleOC save(DetalleOC detalleOC){
        return detalleOCRepository.save(detalleOC);
    }

    public Optional<DetalleOC> findById (long id){
        return detalleOCRepository.findById(id);
    }

    public void deleteById (long id){
        detalleOCRepository.deleteById(id);
    }

}
