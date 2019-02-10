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

import com.fabricaReact.model.Material;
import com.fabricaReact.model.Proveedor;
import com.fabricaReact.service.MaterialService;
import com.fabricaReact.service.ProveedorService;

@RestController
@RequestMapping("/api")
public class MaterialController {
	
	private final Logger log = LoggerFactory.getLogger(MaterialController.class);
	
	private MaterialService materialService;

	
	public MaterialController (MaterialService materialService) {
		this.materialService = materialService;
	}
	
	@GetMapping("/materiales")
	Collection<Material> materiales() {
		return materialService.findAll();
	}
	
	@GetMapping("/material/{id}")
	ResponseEntity<?> getMaterial(@PathVariable Long id) {
		Optional<Material> mat = materialService.findById(id);
		return mat.map(response -> ResponseEntity.ok().body(response))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@PostMapping("/material")
	ResponseEntity<Material> createMaterial(@Valid @RequestBody Material mat) throws URISyntaxException {
		log.info("Request to create a material: {}", mat);
		Material result = materialService.save(mat);
		return ResponseEntity.created(new URI("/api/material" + result.getIdMaterial())).body(result);
	}
	
	@PutMapping("/material")
	ResponseEntity<Material> updateMaterial(@Valid @RequestBody Material mat){
		log.info("Request to update material: {}", mat);
		Material result = materialService.save(mat);
		return ResponseEntity.ok().body(result);
	}
	
	@DeleteMapping("/material/{id}")
	public ResponseEntity<?> deleteMaterial (@PathVariable Long id){
		log.info("Request to delete material: {}", id);
		materialService.deleteById(id);
		return ResponseEntity.ok().build();
	}

}
