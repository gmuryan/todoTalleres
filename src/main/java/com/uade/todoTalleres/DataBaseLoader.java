package com.uade.todoTalleres;

import com.uade.todoTalleres.model.*;
import com.uade.todoTalleres.security.Hashing;
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
//        Estado estado1 = new Estado("Pendiente Diagnóstico");
//        estadoService.save(estado1);
//        Estado estado6 = new Estado("En diagnóstico");
//        estadoService.save(estado6);
//        Estado estado2 = new Estado("Pendiente Confirmación");
//        estadoService.save(estado2);
//        Estado estado3 = new Estado("En reparación");
//        estadoService.save(estado3);
//        Estado estado4 = new Estado("Listo para retirar");
//        estadoService.save(estado4);
//        Estado estado5 = new Estado("Finalizado");
//        estadoService.save(estado5);
//        Estado estado7 = new Estado("Cancelado");
//        estadoService.save(estado7);
//        Marca todas = new Marca("Todas");
//        marcaService.save(todas);
//        Marca renault = new Marca("Renault");
//        marcaService.save(renault);
//        Marca toyota = new Marca("Toyota");
//        marcaService.save(toyota);
//        Marca bmw = new Marca("BMW");
//        marcaService.save(bmw);
//        Marca ford = new Marca("Ford");
//        marcaService.save(ford);
//        Marca fiat = new Marca("Fiat");
//        marcaService.save(fiat);
//        Marca honda = new Marca("Honda");
//        marcaService.save(honda);
//        Clasificacion electricidad = new Clasificacion("Electricidad");
//        clasificacionService.save(electricidad);
//        Clasificacion escapes = new Clasificacion("Escapes");
//        clasificacionService.save(escapes);
//        Clasificacion mecanica = new Clasificacion("Mecánica");
//        clasificacionService.save(mecanica);
//        Clasificacion chapaPintura = new Clasificacion("Chapa y Pintura");
//        clasificacionService.save(chapaPintura);
//        Clasificacion alineacionBalanceo = new Clasificacion("Alineación y Balanceo");
//        clasificacionService.save(alineacionBalanceo);
//        Clasificacion equiposGNC = new Clasificacion("Equipos GNC");
//        clasificacionService.save(equiposGNC);
//        Clasificacion alarmas = new Clasificacion("Alarmas");
//        clasificacionService.save(alarmas);
//        Clasificacion cerrajeriaCristales = new Clasificacion("Cerrajería y Cristales");
//        clasificacionService.save(cerrajeriaCristales);
//        Clasificacion todasClasif = new Clasificacion("Todas");
//        clasificacionService.save(todasClasif);
//        Cliente cliente = new Cliente("Pedro", "Kim", "44444444", "pedro@gmail.com", "pepe", true);
//        String hashPw = Hashing.hash(cliente.getPassword());
//        cliente.setPassword(hashPw);
//        clienteService.save(cliente);
//        Cliente clienteExterno = new Cliente("Cliente", "Externo", "43448897", "cliente@externo.com", "pepe", true);
//        String hashPw2 = Hashing.hash(clienteExterno.getPassword());
//        clienteExterno.setPassword(hashPw2);
//        clienteService.save(clienteExterno);
//        List<Marca> marcas = marcaService.findAll();
//        List<Clasificacion> clasifs = clasificacionService.findAll();
//        Taller taller = new Taller("Taller Mecánico Lautaro", "44444444", "Flores", "tallerlautaro@gmail.com", "Lautaro 366", marcas.get(0), null, null, null, clasifs.get(0), 20, 1 ,"pepe", "Historico taller del barrio de flores", true);
//        String hashPw3 = Hashing.hash(taller.getPassword());
//        taller.setPassword(hashPw3);
//        tallerService.save(taller);
//        List<Taller> ts = tallerService.findAll();
//        Taller t = ts.get(0);
//        Mecanico m = new Mecanico("Julian", "Perez", "4444", "julian@mecanico.com", t, true);
//        mecanicoService.save(m);
//        Mecanico m2 = new Mecanico("Ruben", "Perez", "4444", "ruben@perez.com", t, true);
//        mecanicoService.save(m2);
    }
}
