package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Taller;
import com.uade.todoTalleres.repository.TallerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TallerService {

    private TallerRepository tallerRepository;

    public TallerService (TallerRepository tallerRepository){
        this.tallerRepository = tallerRepository;
    }

    public Taller save(Taller taller){
        return tallerRepository.save(taller);
    }

    public Optional<Taller> findById (long id){
        Optional<Taller> taller = tallerRepository.findById(id);
        return taller;
    }

    public List<Taller> findAll(){
        return tallerRepository.findAll();
    }

    public Optional<Taller> findTallerByMail(String mail){
        Optional<Taller> taller = tallerRepository.findByMail(mail);
        return taller;
    }

    public void delete (Taller taller){
        tallerRepository.delete(taller);
    }

    public void deleteById (long id){
        tallerRepository.deleteById(id);
    }
}
