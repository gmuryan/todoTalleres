package com.uade.todoTalleres.controller;

import com.uade.todoTalleres.model.Mecanico;
import com.uade.todoTalleres.model.Reparacion;
import com.uade.todoTalleres.service.MecanicoService;
import com.uade.todoTalleres.service.ReparacionService;
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
public class ReparacionController {

    private final Logger log = LoggerFactory.getLogger(ReparacionController.class);

    private ReparacionService reparacionService;

    public ReparacionController(ReparacionService reparacionService) {
        this.reparacionService= reparacionService;
    }

    @GetMapping("/reparaciones")
    Collection<Reparacion> reparaciones() {
        return reparacionService.findAll();
    }

    @GetMapping("/reparacionesTaller/{id}")
    Collection<Reparacion> reparacionesByTaller(@PathVariable Long id){
        return reparacionService.findAllByTaller(id);
    }

    @GetMapping("/reparacionesCliente/{id}")
    Collection<Reparacion> reparacionesByCliente(@PathVariable Long id){
        return reparacionService.findAllByCliente(id);
    }

    @GetMapping("/reparacion/{id}")
    ResponseEntity<?> getReparacion(@PathVariable Long id) {
        Optional<Reparacion> reparacion= reparacionService.findById(id);
        return reparacion.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/reparacion")
    ResponseEntity<Reparacion> createReparacion(@Valid @RequestBody Reparacion reparacion) throws URISyntaxException {
        log.info("Request to create a reparacion: {}", reparacion);
        Reparacion result = reparacionService.save(reparacion);
        return ResponseEntity.created(new URI("/api/reparacion" + result.getIdReparacion())).body(result);
    }

    @PutMapping("/reparacion")
    ResponseEntity<Reparacion> updateReparacion(@Valid @RequestBody Reparacion reparacion){
        log.info("Request to update reparacion: {}", reparacion);
        Reparacion result = reparacionService.save(reparacion);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/reparacion/{id}")
    public ResponseEntity<?> deleteReparacion (@PathVariable Long id){
        log.info("Request to delete reparacion: {}", id);
        reparacionService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
