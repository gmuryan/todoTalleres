package com.uade.todoTalleres.controller;

import com.uade.todoTalleres.model.Taller;
import com.uade.todoTalleres.service.TallerService;
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
public class TallerController {

    private final Logger log = LoggerFactory.getLogger(TallerController.class);

    private TallerService tallerService;

    public TallerController(TallerService tallerService) {
        this.tallerService = tallerService;
    }

    @GetMapping("/talleres")
    Collection<Taller> talleres() {
        return tallerService.findAll();
    }

    @GetMapping("/taller/{id}")
    ResponseEntity<?> getTaller(@PathVariable Long id) {
        Optional<Taller> taller = tallerService.findById(id);
        return taller.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/tallerByMail")
    ResponseEntity<?> getTallerByMail(String mail) {
        Optional<Taller> taller = tallerService.findTallerByMail(mail);
        return taller.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/taller")
    ResponseEntity<Taller> createTaller(@Valid @RequestBody Taller taller) throws URISyntaxException {
        log.info("Request to create a taller: {}", taller);
        Taller result = tallerService.save(taller);
        return ResponseEntity.created(new URI("/api/taller" + result.getIdTaller())).body(result);
    }

    @PutMapping("/taller")
    ResponseEntity<Taller> updateTaller(@Valid @RequestBody Taller taller){
        log.info("Request to update taller: {}", taller);
        Optional<Taller> result = tallerService.findById(taller.getIdTaller());
        if (result.get() != null){
            result.get().setNombre(taller.getNombre());
            result.get().setBarrio(taller.getBarrio());
            result.get().setTelefono((taller.getTelefono()));
            result.get().setMail(taller.getMail());
            result.get().setUbicacion(taller.getUbicacion());
            result.get().setPassword(taller.getPassword());
            result.get().setMarca(taller.getMarca());
            result.get().setClasificacion(taller.getClasificacion());
            result.get().setRetrasosContemplados(taller.getRetrasosContemplados());
            result.get().setMaximosVehiculos(taller.getMaximosVehiculos());
            tallerService.save(result.get());
            return ResponseEntity.ok().body(result.get());
        }else{
            tallerService.save(taller);
            return ResponseEntity.ok().body(taller);
        }
    }

    @DeleteMapping("/taller/{id}")
    public ResponseEntity<?> deleteTaller (@PathVariable Long id){
        log.info("Request to delete taller: {}", id);
        tallerService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
