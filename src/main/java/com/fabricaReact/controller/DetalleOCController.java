package com.fabricaReact.controller;

import com.fabricaReact.model.DetalleOC;
import com.fabricaReact.service.DetalleOCService;
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
public class DetalleOCController {

    private final Logger log = LoggerFactory.getLogger(DetalleOCController.class);

    private DetalleOCService detalleOCService;

    public DetalleOCController (DetalleOCService detalleOCService){
        this.detalleOCService = detalleOCService;
    }

    @GetMapping("/detallesOC")
    Collection<DetalleOC> detalleOCs() {
        return detalleOCService.findAll();
    }

    @GetMapping("/detallesOC/{id}")
    Collection<DetalleOC> detalleOCxId(@PathVariable Long id) {
        return detalleOCService.findAllById(id);
    }

    @GetMapping("/detalleOC/{id}")
    ResponseEntity<?> getDetalleOC(@PathVariable Long id) {
        Optional<DetalleOC> detalleOC = detalleOCService.findById(id);
        return detalleOC.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/detalleOC")
    ResponseEntity<DetalleOC> createDetalleOC(@Valid @RequestBody DetalleOC detalleOC) throws URISyntaxException {
        log.info("Request to create a detalleOC: {}", detalleOC);
        DetalleOC result = detalleOCService.save(detalleOC);
        return ResponseEntity.created(new URI("/api/detalleOC" + result.getIdDetalleOC())).body(result);
    }

    @PutMapping("/detalleOC")
    ResponseEntity<DetalleOC> updateDetalleOC(@Valid @RequestBody DetalleOC detalleOC){
        log.info("Request to update detalleOC: {}", detalleOC);
        DetalleOC result = detalleOCService.save(detalleOC);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/detalleOC/{id}")
    public ResponseEntity<?> deleteDetalleOC (@PathVariable Long id){
        log.info("Request to delete detalleOC: {}", id);
        detalleOCService.deleteById(id);
        return ResponseEntity.ok().build();
    }


}
