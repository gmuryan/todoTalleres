package com.fabricaReact.service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fabricaReact.model.Proveedor;
import com.fabricaReact.repository.ProveedorRepository;

@Service
public class ProveedorService {

	private final ProveedorRepository proveedorRepository;

	@Autowired
	public ProveedorService(ProveedorRepository proveedorRepository) {
		this.proveedorRepository = proveedorRepository;
	}
	
	public Proveedor save (Proveedor prov) {
		return proveedorRepository.save(prov);
	}
	
	public List<Proveedor> findAllByRazon(String text){
		return proveedorRepository.findByRazonSocialStartsWithIgnoreCase(text);
	}
	
	public List<Proveedor> findAll(){
		return proveedorRepository.findAll();
	}
	
	public void delete(Proveedor prov){
		proveedorRepository.delete(prov);
	}
	
	public Optional<Proveedor> findById (long id) {
		Optional<Proveedor> prov = proveedorRepository.findById(id);
		return prov;
	}

	public Proveedor findProveedorById (long id){
		return proveedorRepository.findById(id).orElse(null);
	}

	public List<Proveedor> findAllByCuit(String cuit) {
		return proveedorRepository.findByCuitStartingWith(cuit);
	}

	public void deleteById(Long id) {
		proveedorRepository.deleteById(id);
	}
	
}
