package com.uade.todoTalleres.controller;

import com.uade.todoTalleres.model.Resenia;
import com.uade.todoTalleres.service.ReseniaService;
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
public class ReseniaController {

    private final Logger log = LoggerFactory.getLogger(ReseniaController.class);

    private ReseniaService reseñaService;

    public ReseniaController(ReseniaService reseñaService) {
        this.reseñaService = reseñaService;
    }

    @GetMapping("/reseñas")
    Collection<Resenia> reseñas() {
        return reseñaService.findAll();
    }

    @GetMapping("/reseñas/{id}")
    Collection<Resenia> reseñasByTaller(@PathVariable Long id){
        return reseñaService.findAllByTaller(id);
    }

    @GetMapping("/reseña/{id}")
    ResponseEntity<?> getReseña(@PathVariable Long id) {
        Optional<Resenia> reseña= reseñaService.findById(id);
        return reseña.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/reseña")
    ResponseEntity<Resenia> createResña(@Valid @RequestBody Resenia reseña) throws URISyntaxException {
        log.info("Request to create a reseña: {}", reseña);
        Date fechaComentario = new Date();
        fechaComentario.setDate(fechaComentario.getDate()+1);
        reseña.setFechaReseña(fechaComentario);
        Resenia result = reseñaService.save(reseña);
        return ResponseEntity.created(new URI("/api/reseña" + result.getIdReseña())).body(result);
    }

    @PutMapping("/reseña")
    ResponseEntity<Resenia> updateReseña(@Valid @RequestBody Resenia reseña){
        log.info("Request to update mecanico: {}", reseña);
        Optional<Resenia> result = reseñaService.findById(reseña.getIdReseña());
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
