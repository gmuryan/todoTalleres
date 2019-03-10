package com.fabricaReact.controller;

import com.fabricaReact.model.OrdenCompra;
import com.fabricaReact.service.OrdenCompraService;
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
public class OrdenCompraController {

    private final Logger log = LoggerFactory.getLogger(OrdenCompraController.class);

    private OrdenCompraService ordenCompraService;

    public OrdenCompraController(OrdenCompraService ordenCompraService) {
        this.ordenCompraService = ordenCompraService;
    }

    @GetMapping("/ordenesCompra")
    Collection<OrdenCompra> ordenesCompra() {
        return ordenCompraService.findAll();
    }

    @GetMapping("/ordenCompra/{id}")
    ResponseEntity<?> getOrdenCompra(@PathVariable Long id) {
        Optional<OrdenCompra> oc = ordenCompraService.findById(id);
        return oc.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/ordenCompra")
    ResponseEntity<OrdenCompra> createOrdenCompra(@Valid @RequestBody OrdenCompra oc) throws URISyntaxException {
        log.info("Request to create a purchase order: {}", oc);
        OrdenCompra result = ordenCompraService.save(oc);
        return ResponseEntity.created(new URI("/api/ordenCompra" + result.getIdOC())).body(result);
    }

    @PutMapping("/ordenCompra")
    ResponseEntity<OrdenCompra> updateOrdenCompra(@Valid @RequestBody OrdenCompra oc){
        log.info("Request to update purchase order: {}", oc);
        OrdenCompra result = ordenCompraService.save(oc);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/ordenCompra/{id}")
    public ResponseEntity<?> deleteOrdenCompra (@PathVariable Long id){
        log.info("Request to delete purchase order: {}", id);
        ordenCompraService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
