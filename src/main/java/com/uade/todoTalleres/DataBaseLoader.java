package com.uade.todoTalleres;

import com.uade.todoTalleres.model.*;
import com.uade.todoTalleres.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataBaseLoader implements CommandLineRunner {

    @Autowired
    private MecanicoService mecanicoService;

    @Autowired
    private ReparacionService reparacionService;

    @Autowired
    private TallerService tallerService;

    @Autowired
    private MarcaService marcaService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private EstadoService estadoService;

    @Autowired
    private ClasificacionService clasificacionService;

    private final Logger log = LoggerFactory.getLogger(DataBaseLoader.class);

    @Override
    public void run(String... args) throws Exception {
//        Estado estado1 = new Estado("Pendiente Diagnostico");
//        estadoService.save(estado1);
//        Estado estado2 = new Estado("Pendiente Confirmacion");
//        estadoService.save(estado2);
//        Estado estado3 = new Estado("En reparacion");
//        estadoService.save(estado3);
//        Estado estado4 = new Estado("Listo para retirar");
//        estadoService.save(estado4);
//        Estado estado5 = new Estado("Finalizado");
//        estadoService.save(estado5);
//        Estado estado6 = new Estado("En diagnostico");
//        estadoService.save(estado6);
//        Marca todas = new Marca("Todas");
//        marcaService.save(todas);
//        Marca renault = new Marca("Renault");
//        marcaService.save(renault);
//        Marca toyota = new Marca("Toyota");
//        marcaService.save(toyota);
//        Clasificacion electricidad = new Clasificacion("Electricidad");
//        clasificacionService.save(electricidad);
//        Clasificacion escapes = new Clasificacion("Escapes");
//        clasificacionService.save(escapes);
//        Cliente cliente = new Cliente("Cliente", "Test", "44444444", "test@cliente.com", "pepe");
//        clienteService.save(cliente);
//        List<Marca> marcas = marcaService.findAll();
//        List<Clasificacion> clasifs = clasificacionService.findAll();
//        Taller taller = new Taller("Taller Test", "44444444", "Flores", "test@taller.com", "Rivadavia 6778", marcas.get(0), null, null, null, clasifs.get(0), 20, 1 ,"pepe", "Historico taller del barrio de flores");
//        tallerService.save(taller);
//        List<Taller> ts = tallerService.findAll();
//        Taller t = ts.get(0);
//        Mecanico m = new Mecanico("Pablo", "Perez", "4444", "pepe@tg.com", t);
//        mecanicoService.save(m);
//        Mecanico m2 = new Mecanico("Ruben", "Perez", "4444", "pepe@tg.com", t);
//        mecanicoService.save(m2);
    }
}
