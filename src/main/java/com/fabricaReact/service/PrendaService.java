package com.fabricaReact.service;

import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fabricaReact.model.Prenda;
import com.fabricaReact.repository.PrendaRepository;

@Service
public class PrendaService {

	private final PrendaRepository prendaRepository;

	public PrendaService(PrendaRepository prendaRepository) {
		super();
		this.prendaRepository = prendaRepository;
	}
	
	public List<Prenda> findAll() {
		return prendaRepository.findAll();
	}

	public List<Prenda> findAllByNombre(String text) {
		return prendaRepository.findByNombreStartsWithIgnoreCase(text);
	}

	public void delete(Prenda prenda) {
		prendaRepository.delete(prenda);
	}

	public void save(Prenda prenda) {
		prendaRepository.save(prenda);
	}

	public Prenda findById(long idPrenda) {
		return prendaRepository.findById(idPrenda).orElse(null);
	}
	
	
}
