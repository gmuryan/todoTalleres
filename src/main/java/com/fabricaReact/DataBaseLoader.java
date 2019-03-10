package com.fabricaReact;

import com.fabricaReact.model.*;
import com.fabricaReact.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataBaseLoader implements CommandLineRunner {

    private final PrendaService prendaService;

    private final FacturaService facturaService;

    private final DetalleFacturaService detalleFacturaService;

    @Autowired
    private MaterialService materialService;

    @Autowired
    private OrdenCompraService ordenCompraService;

    private final Logger log = LoggerFactory.getLogger(DataBaseLoader.class);


    @Autowired
    public DataBaseLoader (PrendaService prendaService, FacturaService facturaService, DetalleFacturaService detalleFacturaService){
        this.prendaService = prendaService;
        this.facturaService = facturaService;
        this.detalleFacturaService = detalleFacturaService;
    }


    @Override
    public void run(String... args) throws Exception {
            BigDecimal importe = new BigDecimal(0);
            List<DetalleFactura> dets = new ArrayList<>();
            List<Prenda> prendas = prendaService.findAll();
            DetalleFactura df3 = new DetalleFactura(prendas.get(1), 1);
            dets.add(df3);
            for (DetalleFactura df : dets){
                importe = importe.add(df.getPrenda().getPrecio().multiply(new BigDecimal(df.getCantidad())));
            }
            Factura factura = new Factura(dets, importe);
            facturaService.save(factura);
            prendaService.descontarStockPrendas(factura);
            List<Material> mats = materialService.findMaterialesParaOC();
            Set<Long> repetidos = new HashSet<Long>();
            Set<Long> todos = new HashSet<Long>();
            for (Material m : mats){
                if (todos.contains(m.getProveedor().getIdProveedor())) {
                    ordenCompraService.generarOC(m.getProveedor().getIdProveedor());
                    repetidos.add(m.getProveedor().getIdProveedor());
                }else{
                    todos.add(m.getProveedor().getIdProveedor());
                }

            }
            for (Material m : mats){
                if (!repetidos.contains(m.getProveedor().getIdProveedor()))
                    ordenCompraService.generarOC(m.getProveedor().getIdProveedor());
            }


    }
}
