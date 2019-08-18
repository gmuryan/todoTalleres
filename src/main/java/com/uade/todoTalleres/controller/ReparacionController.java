package com.uade.todoTalleres.controller;

import com.uade.todoTalleres.model.*;
import com.uade.todoTalleres.service.ClienteService;
import com.uade.todoTalleres.service.EstadoService;
import com.uade.todoTalleres.service.ReparacionService;
import com.uade.todoTalleres.service.TallerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ReparacionController {

    private final Logger log = LoggerFactory.getLogger(ReparacionController.class);

    private ReparacionService reparacionService;

    @Autowired
    private TallerService tallerService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private EstadoService estadoService;

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
        Date fechaReserva = reparacion.getFechaReserva();
        fechaReserva.setMonth((fechaReserva.getMonth() - 1 + 1) % 12 + 1);
        reparacion.setFechaReserva(fechaReserva);
        if (reparacion.getFechaDevolucion() != null){
            Date fechaDevolucion = reparacion.getFechaDevolucion();
            fechaDevolucion.setMonth((fechaDevolucion.getMonth() - 1 + 1) % 12 + 1);
            reparacion.setFechaDevolucion(fechaDevolucion);
        }
        if (reparacion.getEstadoReparacion() == null){
            Optional<Estado> pendienteDiagnostico =  estadoService.findById(1);
            reparacion.setEstadoReparacion(pendienteDiagnostico.get());
            Optional<Mecanico> m = tallerService.getMecanicoDiagnostico(reparacion.getFechaReserva(), reparacion.getHoraReserva(), reparacion.getTaller().getIdTaller());
            List<Mecanico> mecs = new ArrayList<>();
            mecs.add(m.get());
            reparacion.setMecanicos(mecs);
        }else{
            if (reparacion.getEstadoReparacion().getIdEstado() == 36 && reparacion.getMecanicos().isEmpty()){
                Optional<Mecanico> m = tallerService.getMecanicoDiagnostico(reparacion.getFechaReserva(), reparacion.getHoraReserva(), reparacion.getTaller().getIdTaller());
                List<Mecanico> mecs = new ArrayList<>();
                mecs.add(m.get());
                reparacion.setMecanicos(mecs);
            }else{
                Set<Long> mecanicosUnicos = new HashSet<Long>();
                List<Mecanico> mecanicosFinales = new ArrayList<Mecanico>();
                for (Mecanico m : reparacion.getMecanicos()){
                    if (mecanicosUnicos.add(m.getIdMecanico()))
                        mecanicosFinales.add(m);
                }
                reparacion.setMecanicos(mecanicosFinales);
            }
        }
        if (reparacion.getCliente() == null){
            Cliente cliente = clienteService.getClienteExterno();
            reparacion.setCliente(cliente);
        }
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

    @GetMapping("/validarReparacion")
    public Boolean validateReparacion (Long id, String fecha, String hora) throws ParseException {
        Boolean valido = true;
        Optional<Taller> taller= tallerService.findById(id);
        Date fechaReserva = new SimpleDateFormat("dd-MM-yyyy").parse(fecha);
        fechaReserva.setMonth((fechaReserva.getMonth() - 1 + 1) % 12 + 1);
        LocalTime horaReserva = LocalTime.parse(hora);
        if (taller.get().getMaximosVehiculos()-reparacionService.validateEspacio(fechaReserva, horaReserva, id)-taller.get().getRetrasosContemplados()<=0){
            valido = false;
        }
        if (reparacionService.validateMecanicos(fechaReserva, horaReserva, id)<=0){
            valido = false;
        }
        return valido;
    }
}