package com.fabricaReact.service;

import java.util.List;
import java.util.Optional;

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

	public Prenda save(Prenda prenda) {
		return prendaRepository.save(prenda);
	}

	public Optional<Prenda> findById(long id) {
		Optional<Prenda> prenda = prendaRepository.findById(id);
		return prenda;
	}
	
	public void deleteById(Long id) {
		prendaRepository.deleteById(id);
	}
	
	
}
