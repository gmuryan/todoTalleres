package com.uade.todoTalleres.controller;

import com.uade.todoTalleres.model.Cliente;
import com.uade.todoTalleres.service.ClienteService;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
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
public class ClienteController {

    private final Logger log = LoggerFactory.getLogger(ClienteController.class);

    private ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping("/clientes")
    Collection<Cliente> clientes() {
        return clienteService.findAll();
    }

    @GetMapping("/cliente/{id}")
    ResponseEntity<?> getCliente(@PathVariable Long id) {
        Optional<Cliente> cliente = clienteService.findById(id);
        return cliente.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/clienteByMail")
    ResponseEntity<?> getClienteByMail(String mail) {
        Optional<Cliente> cliente = clienteService.findClienteByMail(mail);
        return cliente.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/cliente")
    ResponseEntity<Cliente> createCliente(@Valid @RequestBody Cliente cliente) throws URISyntaxException {
        log.info("Request to create a client: {}", cliente);
        Cliente result = clienteService.save(cliente);
        return ResponseEntity.created(new URI("/api/cliente" + result.getIdCliente())).body(result);
    }

    @PutMapping("/cliente")
    ResponseEntity<Cliente> updateCliente(@Valid @RequestBody Cliente cliente){
        log.info("Request to update client: {}", cliente);
        Optional<Cliente> result = clienteService.findById(cliente.getIdCliente());
        if (result.get() != null){
            result.get().setNombre(cliente.getNombre());
            result.get().setApellido(cliente.getApellido());
            result.get().setTelefono(cliente.getTelefono());
            result.get().setMail(cliente.getMail());
            result.get().setPassword(cliente.getPassword());
            clienteService.save(result.get());
            return ResponseEntity.ok().body(result.get());
        }else{
            clienteService.save(cliente);
            return ResponseEntity.ok().body(cliente);
        }
    }

    @DeleteMapping("/cliente/{id}")
    public ResponseEntity<?> deleteCliente (@PathVariable Long id){
        log.info("Request to delete client: {}", id);
        clienteService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
