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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fabricaReact.model.Prenda;
import com.fabricaReact.service.PrendaService;

@RestController
@RequestMapping("/api")
public class PrendaController {
	
private final Logger log = LoggerFactory.getLogger(PrendaController.class);
	
	private PrendaService prendaService;
	
	public PrendaController (PrendaService prendaService) {
		this.prendaService = prendaService;
	}
	
	@GetMapping("/prendas")
	Collection<Prenda> prendas() {
		return prendaService.findAll();
	}
	
	@GetMapping("/prenda/{id}")
	ResponseEntity<?> getPrenda(@PathVariable Long id) {
		Optional<Prenda> prenda = prendaService.findById(id);
		return prenda.map(response -> ResponseEntity.ok().body(response))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@PostMapping("/prenda")
	ResponseEntity<Prenda> createPrenda(@Valid @RequestBody Prenda prenda) throws URISyntaxException {
		log.info("Request to create a material: {}", prenda);
		Prenda result = prendaService.save(prenda);
		return ResponseEntity.created(new URI("/api/material" + result.getIdPrenda())).body(result);
	}
	
	@PutMapping("/prenda")
	ResponseEntity<Prenda> updatePrenda(@Valid @RequestBody Prenda prenda){
		log.info("Request to update material: {}", prenda);
		Prenda result = prendaService.save(prenda);
		return ResponseEntity.ok().body(result);
	}
	
	@DeleteMapping("/prenda/{id}")
	public ResponseEntity<?> deletePrenda (@PathVariable Long id){
		log.info("Request to delete material: {}", id);
		prendaService.deleteById(id);
		return ResponseEntity.ok().build();
	}

}
