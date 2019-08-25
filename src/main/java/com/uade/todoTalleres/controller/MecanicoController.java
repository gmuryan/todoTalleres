package com.uade.todoTalleres.controller;

import com.uade.todoTalleres.model.Mecanico;
import com.uade.todoTalleres.service.MecanicoService;
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
public class MecanicoController {

    private final Logger log = LoggerFactory.getLogger(MecanicoController.class);

    private MecanicoService mecanicoService;

    public MecanicoController(MecanicoService mecanicoService) {
        this.mecanicoService= mecanicoService;
    }

    @GetMapping("/mecanicos")
    Collection<Mecanico> mecanicos() {
        return mecanicoService.findAll();
    }

    @GetMapping("/mecanicos/{id}")
    Collection<Mecanico> mecanicosByTaller(@PathVariable Long id){
        return mecanicoService.findAllByTaller(id);
    }

    @GetMapping("/mecanico/{id}")
    ResponseEntity<?> getMecanico(@PathVariable Long id) {
        Optional<Mecanico> mecanico= mecanicoService.findById(id);
        return mecanico.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/mecanico")
    ResponseEntity<Mecanico> createMecanico(@Valid @RequestBody Mecanico mecanico) throws URISyntaxException {
        log.info("Request to create a mecanico: {}", mecanico);
        Mecanico result = mecanicoService.save(mecanico);
        return ResponseEntity.created(new URI("/api/mecanico" + result.getIdMecanico())).body(result);
    }

    @PutMapping("/mecanico")
    ResponseEntity<Mecanico> updateMecanico(@Valid @RequestBody Mecanico mecanico){
        log.info("Request to update mecanico: {}", mecanico);
        Optional<Mecanico> result = mecanicoService.findById(mecanico.getIdMecanico());
        if (result.get() != null){
            result.get().setNombre(mecanico.getNombre());
            result.get().setApellido(mecanico.getApellido());
            result.get().setTelefono(mecanico.getTelefono());
            result.get().setMail(mecanico.getMail());
            mecanicoService.save(result.get());
            return ResponseEntity.ok().body(result.get());
        }else{
            mecanicoService.save(mecanico);
            return ResponseEntity.ok().body(mecanico);
        }
    }

    @DeleteMapping("/mecanico/{id}")
    public ResponseEntity<?> deleteMecanico (@PathVariable Long id){
        log.info("Request to delete mecanico: {}", id);
        mecanicoService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
