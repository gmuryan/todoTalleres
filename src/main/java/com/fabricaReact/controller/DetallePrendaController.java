package com.fabricaReact.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Optional;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fabricaReact.model.DetallePrenda;
import com.fabricaReact.service.DetallePrendaService;

@RestController
@RequestMapping("/api")
public class DetallePrendaController {
	
private final Logger log = LoggerFactory.getLogger(DetallePrendaController.class);
	
	private DetallePrendaService detallePrendaService;
	
	public DetallePrendaController (DetallePrendaService detallePrendaService) {
		this.detallePrendaService = detallePrendaService;
	}
	
	@GetMapping("/detallePrendas")
	Collection<DetallePrenda> detallePrendas() {
		return detallePrendaService.findAll();
	}
	
	@GetMapping("/detallesPrenda/{id}")
	Collection<DetallePrenda> detallePrendasXId(@PathVariable Long id) {
		return detallePrendaService.findAllById(id);
	}
	
	@GetMapping("/detallePrenda/{id}")
	ResponseEntity<?> getDetallePrenda(@PathVariable Long id) {
		Optional<DetallePrenda> detallePrenda = detallePrendaService.findById(id);
		return detallePrenda.map(response -> ResponseEntity.ok().body(response))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@PostMapping("/detallePrenda")
	ResponseEntity<DetallePrenda> createDetallePrenda(@Valid @RequestBody DetallePrenda detallePrenda) throws URISyntaxException {
		log.info("Request to create a detallePrenda: {}", detallePrenda);
		DetallePrenda result = detallePrendaService.save(detallePrenda);
		detallePrendaService.updatePrenda(1, detallePrenda.getIdDetallePrenda());
		return ResponseEntity.created(new URI("/api/detallePrenda" + result.getIdDetallePrenda())).body(result);
	}
	
	@PutMapping("/detallePrenda")
	ResponseEntity<DetallePrenda> updateDetallePrenda(@Valid @RequestBody DetallePrenda detallePrenda){
		log.info("Request to update detallePrenda: {}", detallePrenda);
		DetallePrenda result = detallePrendaService.save(detallePrenda);
		return ResponseEntity.ok().body(result);
	}
	
	@DeleteMapping("/detallePrenda/{id}")
	public ResponseEntity<?> deleteDetallePrenda (@PathVariable Long id){
		log.info("Request to delete detallePrenda: {}", id);
		detallePrendaService.deleteById(id);
		return ResponseEntity.ok().build();
	}

}
