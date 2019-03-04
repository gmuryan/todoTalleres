package com.fabricaReact.service;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.fabricaReact.model.DetallePrenda;
import com.fabricaReact.repository.DetallePrendaRepository;

@Service
public class DetallePrendaService {
	
	private final DetallePrendaRepository detallePrendaRepository;

	public DetallePrendaService(DetallePrendaRepository detallePrendaRepository) {
		this.detallePrendaRepository = detallePrendaRepository;
	}
	
	public List<DetallePrenda> findAll(){
		return detallePrendaRepository.findAllNull();
	}
	
	public List<DetallePrenda> findAllById(long id){
		return detallePrendaRepository.findAllByIdPrenda(id);
	}
	
	public void delete(DetallePrenda detallePrenda) {
		detallePrendaRepository.delete(detallePrenda);
	}
	
	public DetallePrenda save(DetallePrenda detallePrenda) {
		return detallePrendaRepository.save(detallePrenda);
	}
	
	public Optional<DetallePrenda> findById(long id) {
		Optional<DetallePrenda> detallePrenda = detallePrendaRepository.findById(id);
		return detallePrenda;
	}
	
	public void deleteById (long id) {
		detallePrendaRepository.deleteById(id);
	}
	
	@Transactional
	public void updatePrenda(long idPrenda, long idDetallePrenda) {
		detallePrendaRepository.updatePrenda(idPrenda, idDetallePrenda);
	}
	

}
