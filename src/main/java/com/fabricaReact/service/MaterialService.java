package com.fabricaReact.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fabricaReact.model.Material;
import com.fabricaReact.model.Proveedor;
import com.fabricaReact.repository.MaterialRepository;

@Service("materialService")
public class MaterialService {

	private MaterialRepository materialRepository;

	@Autowired
	public MaterialService(MaterialRepository materialRepository) {
		super();
		this.materialRepository = materialRepository;
	}
	
	public Material save (Material mat) {
		return materialRepository.save(mat);
	}
	
	public Material findById (long id) {
		return materialRepository.findById(id).orElse(null);
		
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


	public void saveMat(Material mat) {
		materialRepository.save(mat);
		
	}
	
	public List<Material> findMatByProvs(List<Proveedor> provs) {
		List<Material> mats = new ArrayList<>();
		for (Proveedor p : provs) {
			mats.addAll(materialRepository.findMatByProvId(p.getIdProveedor()));
		}
		return mats;
	}
}
