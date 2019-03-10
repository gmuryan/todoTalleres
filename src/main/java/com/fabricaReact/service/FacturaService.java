package com.fabricaReact.service;

import com.fabricaReact.model.Factura;
import com.fabricaReact.repository.FacturaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacturaService {

    private final FacturaRepository facturaRepository;

    public FacturaService(FacturaRepository facturaRepository){
        this.facturaRepository = facturaRepository;
    }

    public Factura save(Factura factura){
        return facturaRepository.save(factura);
    }

    public List<Factura> findAll(){
        return facturaRepository.findAll();
    }

    public void delete(Factura factura){
        facturaRepository.delete(factura);
    }

    public Optional<Factura> findById(long id){
        return facturaRepository.findById(id);
    }

    public void deleteById (long id){
        facturaRepository.deleteById(id);
    }



}
