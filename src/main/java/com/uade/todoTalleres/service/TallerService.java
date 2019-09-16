package com.uade.todoTalleres.service;

import com.uade.todoTalleres.model.Mecanico;
import com.uade.todoTalleres.model.Reparacion;
import com.uade.todoTalleres.model.Taller;
import com.uade.todoTalleres.repository.TallerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;

@Service
public class TallerService {

    private TallerRepository tallerRepository;

    @Autowired
    private MecanicoService mecanicoService;

    @Autowired
    private ReparacionService reparacionService;

    public TallerService(TallerRepository tallerRepository) {
        this.tallerRepository = tallerRepository;
    }

    public Taller save(Taller taller) {
        return tallerRepository.save(taller);
    }

    public Optional<Taller> findById(long id) {
        Optional<Taller> taller = tallerRepository.findById(id);
        return taller;
    }

    public List<Taller> findAll() {
        return tallerRepository.findAll();
    }

    public Optional<Taller> findTallerByMail(String mail) {
        Optional<Taller> taller = tallerRepository.findByMail(mail);
        return taller;
    }

    public Optional<Mecanico> getMecanicoDiagnostico(Date fecha, LocalTime hora, Long id) {
        Long idMecanicoOptimo = null;
        Long aux = null;
        Integer cantidadReparaciones = null;
        Integer cantidadReparacionesAux = null;
        List<Object[]> objs = tallerRepository.getMecanicosLibres(fecha, hora, id);
        idMecanicoOptimo = Long.parseLong(objs.get(0)[0].toString());
        cantidadReparaciones = mecanicoService.conseguirCantidadDeReparacionesPorMecanico(idMecanicoOptimo);
        if (objs.size() > 1) {
            for (Object obj : objs) {
                Object[] fields = (Object[]) obj;
                aux = Long.parseLong(fields[0].toString());
                cantidadReparacionesAux = mecanicoService.conseguirCantidadDeReparacionesPorMecanico(aux);
                if (cantidadReparaciones > cantidadReparacionesAux) {
                    idMecanicoOptimo = aux;
                    cantidadReparaciones = cantidadReparacionesAux;
                }
            }
        }
        Optional<Mecanico> m = mecanicoService.findById(idMecanicoOptimo);
        return m;
    }

    public List<BigDecimal> getFacturacion(Long id) {
        List<BigDecimal> totales = new ArrayList<BigDecimal>();
        HashMap<Integer, BigDecimal> totalesPorMes = new HashMap<>();
        List<Reparacion> reparaciones = reparacionService.findAllByTaller(id);
        for (Reparacion reparacion : reparaciones) {
            if (reparacion.getImporteTotal() != null && !reparacion.getEstadoReparacion().getDescripcion().equalsIgnoreCase("Cancelado")) {
                Date aux = reparacion.getFechaDevolucion();
                Calendar calendar = Calendar.getInstance();
                Calendar calendarAux = Calendar.getInstance();
                calendar.setTime(aux);
                int mes = calendar.get(Calendar.MONTH);
                int año = calendar.get(Calendar.YEAR);
                if (año == calendarAux.get(Calendar.YEAR)) {
                    if (totalesPorMes.containsKey(mes)) {
                        totalesPorMes.merge(mes, reparacion.getImporteTotal(), BigDecimal::add);
                    } else {
                        totalesPorMes.put(mes, reparacion.getImporteTotal());
                    }
                }
            }
        }
        if (!totalesPorMes.containsKey(Calendar.JANUARY)) {
            totalesPorMes.put(Calendar.JANUARY, new BigDecimal(0));
        }
        if (!totalesPorMes.containsKey(Calendar.FEBRUARY)) {
            totalesPorMes.put(Calendar.FEBRUARY, new BigDecimal(0));
        }
        if (!totalesPorMes.containsKey(Calendar.MARCH)) {
            totalesPorMes.put(Calendar.MARCH, new BigDecimal(0));
        }
        if (!totalesPorMes.containsKey(Calendar.APRIL)) {
            totalesPorMes.put(Calendar.APRIL, new BigDecimal(0));
        }
        if (!totalesPorMes.containsKey(Calendar.MAY)) {
            totalesPorMes.put(Calendar.MAY, new BigDecimal(0));
        }
        if (!totalesPorMes.containsKey(Calendar.JUNE)) {
            totalesPorMes.put(Calendar.JUNE, new BigDecimal(0));
        }
        if (!totalesPorMes.containsKey(Calendar.JULY)) {
            totalesPorMes.put(Calendar.JULY, new BigDecimal(0));
        }
        if (!totalesPorMes.containsKey(Calendar.AUGUST)) {
            totalesPorMes.put(Calendar.AUGUST, new BigDecimal(0));
        }
        if (!totalesPorMes.containsKey(Calendar.SEPTEMBER)) {
            totalesPorMes.put(Calendar.SEPTEMBER, new BigDecimal(0));
        }
        if (!totalesPorMes.containsKey(Calendar.OCTOBER)) {
            totalesPorMes.put(Calendar.OCTOBER, new BigDecimal(0));
        }
        if (!totalesPorMes.containsKey(Calendar.NOVEMBER)) {
            totalesPorMes.put(Calendar.NOVEMBER, new BigDecimal(0));
        }
        if (!totalesPorMes.containsKey(Calendar.DECEMBER)) {
            totalesPorMes.put(Calendar.DECEMBER, new BigDecimal(0));
        }
        totalesPorMes.forEach((mes, importe) -> {
            totales.add(importe);
        });
        return totales;
    }

    public List<Integer> getReparaciones(Long id) {
        List<Integer> totales = new ArrayList<>();
        HashMap<Integer, Integer> totalesPorMes = new HashMap<>();
        List<Reparacion> reparaciones = reparacionService.findAllByTaller(id);
        for (Reparacion reparacion : reparaciones){
            Date aux = reparacion.getFechaReserva();
            Calendar calendar = Calendar.getInstance();
            Calendar calendarAux = Calendar.getInstance();
            calendar.setTime(aux);
            int mes = calendar.get(Calendar.MONTH);
            int año = calendar.get(Calendar.YEAR);
            if (año == calendarAux.get(Calendar.YEAR)) {
                if (totalesPorMes.containsKey(mes)) {
                    int value = totalesPorMes.get(mes);
                    totalesPorMes.put(mes, value+1);
                } else {
                    totalesPorMes.put(mes, 1);
                }
            }
        }
        if (!totalesPorMes.containsKey(Calendar.JANUARY)) {
            totalesPorMes.put(Calendar.JANUARY, 0);
        }
        if (!totalesPorMes.containsKey(Calendar.FEBRUARY)) {
            totalesPorMes.put(Calendar.FEBRUARY, 0);
        }
        if (!totalesPorMes.containsKey(Calendar.MARCH)) {
            totalesPorMes.put(Calendar.MARCH, 0);
        }
        if (!totalesPorMes.containsKey(Calendar.APRIL)) {
            totalesPorMes.put(Calendar.APRIL, 0);
        }
        if (!totalesPorMes.containsKey(Calendar.MAY)) {
            totalesPorMes.put(Calendar.MAY, 0);
        }
        if (!totalesPorMes.containsKey(Calendar.JUNE)) {
            totalesPorMes.put(Calendar.JUNE, 0);
        }
        if (!totalesPorMes.containsKey(Calendar.JULY)) {
            totalesPorMes.put(Calendar.JULY, 0);
        }
        if (!totalesPorMes.containsKey(Calendar.AUGUST)) {
            totalesPorMes.put(Calendar.AUGUST, 0);
        }
        if (!totalesPorMes.containsKey(Calendar.SEPTEMBER)) {
            totalesPorMes.put(Calendar.SEPTEMBER, 0);
        }
        if (!totalesPorMes.containsKey(Calendar.OCTOBER)) {
            totalesPorMes.put(Calendar.OCTOBER, 0);
        }
        if (!totalesPorMes.containsKey(Calendar.NOVEMBER)) {
            totalesPorMes.put(Calendar.NOVEMBER, 0);
        }
        if (!totalesPorMes.containsKey(Calendar.DECEMBER)) {
            totalesPorMes.put(Calendar.DECEMBER, 0);
        }
        totalesPorMes.forEach((mes, cantReparaciones) -> {
            totales.add(cantReparaciones);
        });
        return totales;
    }

    public List<String> getNombresMecanicos(Long id){
        List<String> nombresMecanicos = new ArrayList<>();
        List<Mecanico> mecanicos = mecanicoService.findAllByTaller(id);
        for (Mecanico mecanico : mecanicos){
            nombresMecanicos.add(new String(mecanico.getNombre() + " " + mecanico.getApellido()));
        }
        return nombresMecanicos;
    }

    public void borradoLogicoById(Long id){
        Optional<Taller> taller = this.findById(id);
        taller.get().setActivo(false);
        tallerRepository.save(taller.get());
    }

    public void habilitarById(Long id){
        Optional<Taller> taller = this.findById(id);
        taller.get().setActivo(true);
        tallerRepository.save(taller.get());
    }

    public void delete(Taller taller) {
        tallerRepository.delete(taller);
    }

    public void deleteById(long id) {
        tallerRepository.deleteById(id);
    }
}
