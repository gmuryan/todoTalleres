package com.fabricaReact.service;

import com.fabricaReact.model.DetalleFactura;
import com.fabricaReact.repository.DetalleFacturaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DetalleFacturaService {

    private final DetalleFacturaRepository detalleFacturaRepository;

    public DetalleFacturaService(DetalleFacturaRepository detalleFacturaRepository){
        this.detalleFacturaRepository = detalleFacturaRepository;
    }

    public DetalleFactura save(DetalleFactura detalleFactura){
        return detalleFacturaRepository.save(detalleFactura);
    }

    public List<DetalleFactura> findAll(){
        return detalleFacturaRepository.findAll();
    }

    public void delete(DetalleFactura detalleFactura){
        detalleFacturaRepository.delete(detalleFactura);
    }

    public Optional<DetalleFactura> findById(long id){
        return detalleFacturaRepository.findById(id);
    }

    public void deleteById (long id){
        detalleFacturaRepository.deleteById(id);
    }



}
