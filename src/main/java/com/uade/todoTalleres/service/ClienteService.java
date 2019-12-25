package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Cliente;
import com.uade.todoTalleres.model.Reparacion;
import com.uade.todoTalleres.repository.ClienteRepository;
import com.uade.todoTalleres.security.Hashing;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

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

    public Optional<Cliente> findClienteByMail(String mail){
        Optional<Cliente> cliente = clienteRepository.findByMail(mail);
        return cliente;
    }

    public Boolean verificarInfoLogin (String mail, String password){
        Optional<Cliente> cliente  = this.findClienteByMail(mail);
        return Hashing.verifyHash(password, cliente.get().getPassword()) && cliente.get().isActivo();
    }

    public Cliente getClienteExterno(){
        return clienteRepository.getClienteExterno();
    }

    public void delete (Cliente cli){
        clienteRepository.delete(cli);
    }

    public void deleteById (long id){
        clienteRepository.deleteById(id);
    }

    public void borradoLogicoById(Long id){
        Optional<Cliente> cliente = this.findById(id);
        cliente.get().setActivo(false);
        clienteRepository.save(cliente.get());
    }

    public void updatePassword(Cliente cliente, String nuevaPassword){
        String hashNuevaPw = Hashing.hash(nuevaPassword);
        cliente.setPassword(hashNuevaPw);
        this.save(cliente);
    }

    public void habilitarById (Long id){
        Optional<Cliente> cliente = this.findById(id);
        cliente.get().setActivo(true);
        clienteRepository.save(cliente.get());
    }

    @Transactional
    public void actualizarNuevosPresupuestos(Long idCliente){
        clienteRepository.updateNuevasReparacionesCliente(idCliente);
    }

    public List<Long>  getReparacionesNuevoPresupuesto (Long idCliente){
        List<Object[]> objs = clienteRepository.getReparacionesNuevoPresupuesto(idCliente);
        Long idReparacion = null;
        List<Long> idsReparaciones = new ArrayList<>();
        for (Object obj : objs){
            Object[] fields = (Object[]) obj;
            idReparacion = Long.parseLong(fields[0].toString());
            idsReparaciones.add(idReparacion);
        }
        return idsReparaciones;
    }
}
