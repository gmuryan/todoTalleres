package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Mecanico;
import com.uade.todoTalleres.model.Taller;
import com.uade.todoTalleres.repository.TallerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TallerService {

    private TallerRepository tallerRepository;

    @Autowired
    private MecanicoService mecanicoService;

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

    public Optional<Mecanico> getMecanicoDiagnostico(Date fecha, LocalTime hora, Long id){
        Long idMecanicoOptimo = null;
        Long aux = null;
        Integer cantidadReparaciones = null;
        Integer cantidadReparacionesAux = null;
        List<Object[]> objs= tallerRepository.getMecanicosLibres(fecha, hora, id);
        idMecanicoOptimo = Long.parseLong(objs.get(0)[0].toString());
        cantidadReparaciones = mecanicoService.conseguirCantidadDeReparacionesPorMecanico(idMecanicoOptimo);
        if (objs.size() > 1){
            for (Object obj : objs){
                Object[] fields = (Object[]) obj;
                aux = Long.parseLong(fields[0].toString());
                cantidadReparacionesAux = mecanicoService.conseguirCantidadDeReparacionesPorMecanico(aux);
                if (cantidadReparaciones>cantidadReparacionesAux){
                    idMecanicoOptimo = aux;
                    cantidadReparaciones = cantidadReparacionesAux;
                }
            }
        }
        Optional<Mecanico> m = mecanicoService.findById(idMecanicoOptimo);
        return m;
    }

    public void delete (Taller taller){
        tallerRepository.delete(taller);
    }

    public void deleteById (long id){
        tallerRepository.deleteById(id);
    }
}
