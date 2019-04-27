package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Reserva;
import com.uade.todoTalleres.repository.ReservaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservaService {

    private ReservaRepository reservaRepository;

    public ReservaService (ReservaRepository reservaRepository){
        this.reservaRepository = reservaRepository;
    }

    public Reserva save(Reserva reserva){
        return reservaRepository.save(reserva);
    }

    public Optional<Reserva> findById (long id){
        Optional<Reserva> reserva = reservaRepository.findById(id);
        return reserva;
    }

    public List<Reserva> findAll(){
        return reservaRepository.findAll();
    }

    public void delete (Reserva reserva){
        reservaRepository.delete(reserva);
    }

    public void deleteById (long id){
        reservaRepository.deleteById(id);
    }
}
