package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Cliente;
import com.uade.todoTalleres.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private ClienteRepository clienteRepository;

    public ClienteService (ClienteRepository clienteRepository){
        this.clienteRepository = clienteRepository;
    }

    public Cliente save(Cliente cli){
        return clienteRepository.save(cli);
    }

    public Optional<Cliente> findById (long id){
        Optional<Cliente> cliente = clienteRepository.findById(id);
        return cliente;
    }

    public List<Cliente> findAll(){
        return clienteRepository.findAll();
    }

    public void delete (Cliente cli){
        clienteRepository.delete(cli);
    }

    public void deleteById (long id){
        clienteRepository.deleteById(id);
    }
}
