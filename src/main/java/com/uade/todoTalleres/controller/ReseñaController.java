package com.uade.todoTalleres.controller;

import com.uade.todoTalleres.model.Reseña;
import com.uade.todoTalleres.service.ReseñaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ReseñaController {

    private final Logger log = LoggerFactory.getLogger(ReseñaController.class);

    private ReseñaService reseñaService;

    public ReseñaController(ReseñaService reseñaService) {
        this.reseñaService = reseñaService;
    }

    @GetMapping("/reseñas")
    Collection<Reseña> reseñas() {
        return reseñaService.findAll();
    }

    @GetMapping("/reseñas/{id}")
    Collection<Reseña> reseñasByTaller(@PathVariable Long id){
        return reseñaService.findAllByTaller(id);
    }

    @GetMapping("/reseña/{id}")
    ResponseEntity<?> getReseña(@PathVariable Long id) {
        Optional<Reseña> reseña= reseñaService.findById(id);
        return reseña.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/reseña")
    ResponseEntity<Reseña> createResña(@Valid @RequestBody Reseña reseña) throws URISyntaxException {
        log.info("Request to create a reseña: {}", reseña);
        Date fechaComentario = new Date();
        fechaComentario.setDate(fechaComentario.getDate()+1);
        reseña.setFechaReserva(fechaComentario);
        Reseña result = reseñaService.save(reseña);
        return ResponseEntity.created(new URI("/api/reseña" + result.getIdReseña())).body(result);
    }

    @PutMapping("/reseña")
    ResponseEntity<Reseña> updateReseña(@Valid @RequestBody Reseña reseña){
        log.info("Request to update mecanico: {}", reseña);
        Optional<Reseña> result = reseñaService.findById(reseña.getIdReseña());
        if (result.get() != null){
            result.get().setComentario(reseña.getComentario());
            reseñaService.save(result.get());
            return ResponseEntity.ok().body(result.get());
        }else{
            reseñaService.save(reseña);
            return ResponseEntity.ok().body(reseña);
        }
    }

    @DeleteMapping("/reseña/{id}")
    public ResponseEntity<?> deleteReseña (@PathVariable Long id){
        log.info("Request to delete reseña: {}", id);
        reseñaService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
