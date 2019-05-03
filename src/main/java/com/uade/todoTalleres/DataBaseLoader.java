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
    private ClasificacionService clasificacionService;

    private final Logger log = LoggerFactory.getLogger(DataBaseLoader.class);

    @Override
    public void run(String... args) throws Exception {
        Marca todas = new Marca("Todas");
        marcaService.save(todas);
        Marca renault = new Marca("Renault");
        marcaService.save(renault);
        Marca toyota = new Marca("Toyota");
        marcaService.save(toyota);
        Clasificacion electricidad = new Clasificacion("Electricidad");
        clasificacionService.save(electricidad);
        Clasificacion escapes = new Clasificacion("Escapes");
        clasificacionService.save(escapes);
//        List<Taller> ts = tallerService.findAll();
//        Taller t = ts.get(0);
//        Mecanico m = new Mecanico("Pablo", "Perez", "4444", "pepe@tg.com", t);
//        mecanicoService.save(m);
//        Mecanico m2 = new Mecanico("Ruben", "Perez", "4444", "pepe@tg.com", t);
//        mecanicoService.save(m2);
//        Reparacion r = new Reparacion();
//        List<Mecanico> ms = new ArrayList<>();
//        ms.add(m);
//        ms.add(m2);
//        r.setMecanicos(ms);
//        reparacionService.save(r);
    }
}
