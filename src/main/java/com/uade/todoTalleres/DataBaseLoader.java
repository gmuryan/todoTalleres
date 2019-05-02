package com.uade.todoTalleres;

import com.uade.todoTalleres.model.Mecanico;
import com.uade.todoTalleres.model.Reparacion;
import com.uade.todoTalleres.model.Taller;
import com.uade.todoTalleres.service.TallerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.uade.todoTalleres.service.MecanicoService;
import com.uade.todoTalleres.service.ReparacionService;
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

    private final Logger log = LoggerFactory.getLogger(DataBaseLoader.class);

    @Override
    public void run(String... args) throws Exception {
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
