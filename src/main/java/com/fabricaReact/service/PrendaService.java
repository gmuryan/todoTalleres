package com.fabricaReact.service;

import java.util.List;
import java.util.Optional;

import com.fabricaReact.model.DetalleFactura;
import com.fabricaReact.model.DetallePrenda;
import com.fabricaReact.model.Factura;
import com.fabricaReact.repository.MaterialRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fabricaReact.model.Prenda;
import com.fabricaReact.repository.PrendaRepository;

import javax.transaction.Transactional;

@Service
public class PrendaService {

	private final PrendaRepository prendaRepository;

	@Autowired
	private MaterialService materialService;

	private final Logger log = LoggerFactory.getLogger(PrendaService.class);

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

	public Prenda findPrendaById(long id){
		return prendaRepository.findById(id).orElse(null);
	}
	
	public void deleteById(Long id) {
		prendaRepository.deleteById(id);
	}


	public void descontarStockPrendas (Factura factura){
		for (DetalleFactura df : factura.getDetallesFactura()){
			Prenda p = df.getPrenda();
			p.setStock(p.getStock()-df.getCantidad());
			this.save(p);
			if (p.getStock() <= p.getPuntoDePedido()){
				this.fabricarPrenda(p);
			}
		}
	}


	public void fabricarPrenda (Prenda p){
		int cantidadAFabricar = p.getPuntoDePedido() - p.getStock() + 5;
		while (cantidadAFabricar>0){
			if (materialService.descontarStockMaterial(p.getIdPrenda())) {
				p.setStock(p.getStock() + 1);
				this.save(p);
				cantidadAFabricar--;
			}else{
				cantidadAFabricar = 0;
				log.info("Faltan materiales");
			}
		}
	}
	
}
