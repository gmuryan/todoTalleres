package com.fabricaReact;

import com.fabricaReact.model.DetallePrenda;
import com.fabricaReact.model.Material;
import com.fabricaReact.model.Prenda;
import com.fabricaReact.service.DetallePrendaService;
import com.fabricaReact.service.MaterialService;
import com.fabricaReact.service.PrendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataBaseLoader implements CommandLineRunner {

    private final PrendaService prendaService;

    private final MaterialService materialService;

    private final DetallePrendaService detallePrendaService;

    @Autowired
    public DataBaseLoader (PrendaService prendaService, MaterialService materialService, DetallePrendaService detallePrendaService){
        this.prendaService = prendaService;
        this.materialService = materialService;
        this.detallePrendaService = detallePrendaService;
    }


    @Override
    public void run(String... args) throws Exception {
//            List<DetallePrenda> dets = new ArrayList<>();
//            List<Material> mats = materialService.findAll();
//            DetallePrenda dp1 = new DetallePrenda(2, mats.get(0));
//            DetallePrenda dp2 = new DetallePrenda(1, mats.get(1));
//            detallePrendaService.save(dp1);
//            detallePrendaService.save(dp2);
//            dets.add(dp1);
//            dets.add(dp2);
//            this.prendaService.save(new Prenda("testDet", dets, "", 0, 15, false));
    }
}
