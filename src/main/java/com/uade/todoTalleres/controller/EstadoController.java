package com.uade.todoTalleres.controller;

import com.uade.todoTalleres.model.Estado;
import com.uade.todoTalleres.service.EstadoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class EstadoController {

    private final Logger log = LoggerFactory.getLogger(EstadoController.class);

    private EstadoService estadoService;

    public EstadoController(EstadoService estadoService) {
        this.estadoService= estadoService;
    }

    @GetMapping("/estados")
    Collection<Estado> estados() {
        return estadoService.findAll();
    }

    @GetMapping("/estado/{id}")
    ResponseEntity<?> getEstado(@PathVariable Long id) {
        Optional<Estado> estado= estadoService.findById(id);
        return estado.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/estado")
    ResponseEntity<Estado> createEstado(@Valid @RequestBody Estado estado) throws URISyntaxException {
        log.info("Request to create a estado: {}", estado);
        Estado result = estadoService.save(estado);
        return ResponseEntity.created(new URI("/api/estado" + result.getIdEstado())).body(result);
    }

    @PutMapping("/estado")
    ResponseEntity<Estado> updateEstado(@Valid @RequestBody Estado estado){
        log.info("Request to update estado: {}", estado);
        Estado result = estadoService.save(estado);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/estado/{id}")
    public ResponseEntity<?> deleteEstado (@PathVariable Long id){
        log.info("Request to delete estado: {}", id);
        estadoService.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
