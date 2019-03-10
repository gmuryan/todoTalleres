package com.fabricaReact.service;

import com.fabricaReact.model.DetalleOC;
import com.fabricaReact.model.Material;
import com.fabricaReact.model.OrdenCompra;
import com.fabricaReact.model.Proveedor;
import com.fabricaReact.repository.OrdenCompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrdenCompraService {

    private final OrdenCompraRepository ordenCompraRepository;

    @Autowired
    private MaterialService materialService;

    @Autowired
    private ProveedorService proveedorService;

    public OrdenCompraService (OrdenCompraRepository ordenCompraRepository){
        this.ordenCompraRepository = ordenCompraRepository;
    }

    public OrdenCompra save(OrdenCompra oc){
        return ordenCompraRepository.save(oc);
    }

    public List<OrdenCompra> findAll(){
        return ordenCompraRepository.findAll();
    }

    public void delete(OrdenCompra oc){
        ordenCompraRepository.delete(oc);
    }

    public Optional<OrdenCompra> findById (long id){
        return ordenCompraRepository.findById(id);
    }

    public void deleteById (long id){
        ordenCompraRepository.deleteById(id);
    }

    @Transactional
    public void generarOC (long idProveedor){
        List<Material> mats = materialService.findMaterialesParaOCByProveedor(idProveedor);
        List<DetalleOC> dets = new ArrayList<DetalleOC>();
        for (Material m : mats){
            dets.add(new DetalleOC(m.getPuntoDePedido()-m.getStock()+5, m));
        }
        Proveedor p = proveedorService.findProveedorById(idProveedor);
        OrdenCompra oc = new OrdenCompra(p, dets);
        this.save(oc);
    }
}
