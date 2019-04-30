package com.uade.todoTalleres.controller;

import com.uade.todoTalleres.model.Clasificacion;
import com.uade.todoTalleres.service.ClasificacionService;
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
public class ClasificacionController {

    private final Logger log = LoggerFactory.getLogger(ClasificacionController.class);

    private ClasificacionService clasificacionService;

    public ClasificacionController(ClasificacionService clasificacionService) {
        this.clasificacionService = clasificacionService;
    }

    @GetMapping("/clasificaciones")
    Collection<Clasificacion> clasificaciones() {
        return clasificacionService.findAll();
    }

    @GetMapping("/clasificacion/{id}")
    ResponseEntity<?> getClasificaciones(@PathVariable Long id) {
        Optional<Clasificacion> clasif = clasificacionService.findById(id);
        return clasif.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/clasificacion")
    ResponseEntity<Clasificacion> createClasificacion(@Valid @RequestBody Clasificacion clasif) throws URISyntaxException {
        log.info("Request to create a clasificacion: {}", clasif);
        Clasificacion result = clasificacionService.save(clasif);
        return ResponseEntity.created(new URI("/api/marca" + result.getIdClasificacion())).body(result);
    }

    @PutMapping("/clasificacion")
    ResponseEntity<Clasificacion> updateClasificacion(@Valid @RequestBody Clasificacion clasif){
        log.info("Request to update clasificacion: {}", clasif);
        Clasificacion result = clasificacionService.save(clasif);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/clasificacion/{id}")
    public ResponseEntity<?> deleteClasificacion (@PathVariable Long id){
        log.info("Request to delete clasificacion: {}", id);
        clasificacionService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
