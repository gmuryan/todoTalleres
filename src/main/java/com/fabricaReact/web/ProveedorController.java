package com.fabricaReact.web;

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

import com.fabricaReact.model.Proveedor;
import com.fabricaReact.service.ProveedorService;

@RestController
@RequestMapping("/api")
public class ProveedorController {

	private final Logger log = LoggerFactory.getLogger(ProveedorController.class);
	private ProveedorService proveedorService;

	public ProveedorController(ProveedorService proveedorService) {
		this.proveedorService = proveedorService;
	}

	@GetMapping("/proveedores")
	Collection<Proveedor> proveedores() {
		return proveedorService.findAll();
	}

	@GetMapping("/proveedor/{id}")
	ResponseEntity<?> getProveedor(@PathVariable Long id) {
		Optional<Proveedor> prov = proveedorService.findById(id);
		return prov.map(response -> ResponseEntity.ok().body(response))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@PostMapping("/proveedor")
	ResponseEntity<Proveedor> createProveedor(@Valid @RequestBody Proveedor prov) throws URISyntaxException {
		log.info("Request to create a supplier: {}", prov);
		Proveedor result = proveedorService.save(prov);
		return ResponseEntity.created(new URI("/api/proveedor" + result.getIdProveedor())).body(result);
	}
	
	@PutMapping("/proveedor")
	ResponseEntity<Proveedor> updateProveedor(@Valid @RequestBody Proveedor prov){
		log.info("Request to update supplier: {}", prov);
		Proveedor result = proveedorService.save(prov);
		return ResponseEntity.ok().body(result);
	}
	
	@DeleteMapping("/proveedor/{id}")
	public ResponseEntity<?> deleteProveedor (@PathVariable Long id){
		log.info("Request to delete supplier: {}", id);
		proveedorService.deleteById(id);
		return ResponseEntity.ok().build();
	}

}
