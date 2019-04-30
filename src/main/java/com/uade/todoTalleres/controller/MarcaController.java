package com.uade.todoTalleres.controller;

import com.uade.todoTalleres.model.Marca;
import com.uade.todoTalleres.service.MarcaService;
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
public class MarcaController {

    private final Logger log = LoggerFactory.getLogger(MarcaController.class);

    private MarcaService marcaService;

    public MarcaController(MarcaService marcaService) {
        this.marcaService = marcaService;
    }

    @GetMapping("/marcas")
    Collection<Marca> marcas() {
        return marcaService.findAll();
    }

    @GetMapping("/marca/{id}")
    ResponseEntity<?> getMarcas(@PathVariable Long id) {
        Optional<Marca> marca = marcaService.findById(id);
        return marca.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/marca")
    ResponseEntity<Marca> createMarca(@Valid @RequestBody Marca marca) throws URISyntaxException {
        log.info("Request to create a marca: {}", marca);
        Marca result = marcaService.save(marca);
        return ResponseEntity.created(new URI("/api/marca" + result.getIdMarca())).body(result);
    }

    @PutMapping("/marca")
    ResponseEntity<Marca> updateMarca(@Valid @RequestBody Marca marca){
        log.info("Request to update marca: {}", marca);
        Marca result = marcaService.save(marca);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/marca/{id}")
    public ResponseEntity<?> deleteMarca (@PathVariable Long id){
        log.info("Request to delete marca: {}", id);
        marcaService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
