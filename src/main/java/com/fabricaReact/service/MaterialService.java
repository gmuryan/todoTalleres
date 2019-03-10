package com.fabricaReact.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import com.fabricaReact.model.DetallePrenda;
import com.fabricaReact.model.Prenda;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fabricaReact.model.Material;
import com.fabricaReact.model.Proveedor;
import com.fabricaReact.repository.MaterialRepository;

import javax.transaction.Transactional;

@Service("materialService")
public class MaterialService {

	private MaterialRepository materialRepository;

	@Autowired
	private PrendaService prendaService;


	public MaterialService(MaterialRepository materialRepository) {
		super();
		this.materialRepository = materialRepository;
	}
	
	public Material save (Material mat) {
		return materialRepository.save(mat);
	}
	
	public Optional<Material> findById (long id) {
		Optional<Material> mat = materialRepository.findById(id);
		return mat;
		
	}
	
	public List<Material> findAll(){
		return materialRepository.findAll();
	}

	public List<Material> findAllByNombre(String nombre) {
		return materialRepository.findByNombreStartsWithIgnoreCase(nombre);
	}

	public void delete(Material mat) {
		materialRepository.delete(mat);
		
	}

	public void deleteById(Long id) {
		materialRepository.deleteById(id);
	}
	
	public List<Material> findMatByProvs(List<Proveedor> provs) {
		List<Material> mats = new ArrayList<>();
		for (Proveedor p : provs) {
			mats.addAll(materialRepository.findMatByProvId(p.getIdProveedor()));
		}
		return mats;
	}

	public List<Material> findMaterialesParaOC(){
		return materialRepository.findMatsParaOC();
	}

	public List<Material> findMaterialesParaOCByProveedor(long idProveedor){
		return materialRepository.findMatsParaOCByProveedor(idProveedor);
	}


	@Transactional
	public Boolean descontarStockMaterial(long idPrenda){
		Prenda p = prendaService.findPrendaById(idPrenda);
		int nuevoStock = 0;
		for (DetallePrenda dp : p.getDetallePrendas()){
			Material m = dp.getMaterial();
			nuevoStock = m.getStock()-dp.getCantidad();
			if (nuevoStock>=0) {
				m.setStock(nuevoStock);
				this.save(m);
			}else{
				return false;
			}
		}
		return true;
	}
}
