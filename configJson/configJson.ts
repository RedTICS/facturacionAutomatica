import * as moment from 'moment';
import * as facturaSumar from './../facturacion/sumar/factura-sumar';

export async function jsonFacturacion(pool, prestacion, datosConfiguracionAutomatica) {

    let facturacion = {
        /* Prestación Otoemisiones */
        '2091000013100': {
            term: "otoemisiones",
            preCondicion: function () {
                /* TODO: terminar precondicion*/
                let valido = true;

                // if (afiliadoSumar) {
                //     valido = true;
                // }

                return valido;
            },
            process: function () {
                let prestacionArr = prestacion.prestacion;
                let configAutomArr = datosConfiguracionAutomatica.sumar;

                function findObjectByKey(array, keys, value) {
                    let dr = '';

                    for (let i = 0; i < array.length; i++) {
                        for (let x = 0; x < value.length; x++) {
                            if (array[i][keys[0]] === value[x].conceptId) {

                                for (let y = 0; y < value.length; y++) {
                                    if (array[i][keys[1]][keys[0]] === value[y].conceptId) {
                                        dr += value[x].valor + value[y].valor + '/';
                                    }
                                }

                            }
                        }
                    }

                    return dr = dr.slice(0, -1);
                }

                let keys = ['conceptId', 'valor'];
                let datoReportable = findObjectByKey(prestacionArr.datosReportables, keys, configAutomArr.datosReportables);

                let dto: any = {};

                dto.diagnostico = configAutomArr.diagnostico[0].diagnostico;
                dto.datosReportables = datoReportable;

                return dto;
            }
        },

        /* Prestación Niños Sano */
        '2091000013101': {
            term: "niño sano",
        }
    }

    let dtoSumar: any = {};
    let dtoRecuperoFinanciero: any = {};

    if (prestacion.obraSocial) {

    } else {
        /* El paciente no tiene Obra Social y se factura por SUMAR*/
        
        if (facturacion[prestacion.prestacion.conceptId].preCondicion()) {
            let procesar = await facturacion[prestacion.prestacion.conceptId].process()

            dtoSumar = {
                objectId: prestacion.turno._id,
                cuie: prestacion.organizacion.cuie,
                diagnostico: procesar.diagnostico,
                dniPaciente: prestacion.paciente.dni,
                edad: moment(new Date()).diff(prestacion.paciente.fechaNacimiento, 'years'),
                sexo: (prestacion.paciente.sexo === 'masculino') ? 'M' : 'F',
                fechaNacimiento: prestacion.paciente.fechaNacimiento,
                anio: moment(prestacion.paciente.fechaNacimiento).format('YYYY'),
                mes: moment(prestacion.paciente.fechaNacimiento).format('MM'),
                dia: moment(prestacion.paciente.fechaNacimiento).format('DD'),
                valorDatoReportable: procesar.datosReportables
            }

            facturaSumar.facturaSumar(pool, dtoSumar, datosConfiguracionAutomatica)
        }
    }
}