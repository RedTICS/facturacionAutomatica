import * as moment from 'moment';
import * as facturaSumar from './../facturacion/sumar/factura-sumar';
import * as facturaRecupero from './../facturacion/recupero-financiero/factura-recupero';

import { QuerySumar } from './../facturacion/sumar/query-sumar';
import { QueryRecupero } from './../facturacion/recupero-financiero/query-recupero';
import { prestacionDTO } from '../dto-webhook';

export async function jsonFacturacion(pool, prestacion, datosConfiguracionAutomatica) {
    let querySumar = new QuerySumar();

    let afiliadoSumar: any = await querySumar.getAfiliadoSumar(pool, prestacion.paciente.dni);
    console.log("Afialidosss: ", afiliadoSumar);
    let facturacion = {
        /* Prestación Otoemisiones */
        '2091000013100': {
            term: "otoemisiones",
            preCondicionSumar: async function (prestacion) {
                let valido = false;

                let esAfiliado = (afiliadoSumar) ? true : false;
                let datosReportables = (prestacion.prestacion.datosReportables) ? true : false;

                let conditionsArray = [
                    esAfiliado,
                    datosReportables
                ]

                if (conditionsArray.indexOf(false) === -1) {
                    valido = true;
                }

                return valido;
            },
            sumar: async function (prestacion) {

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

                let dto: any = {
                    factura: 'sumar',
                    preCondicion: await this.preCondicionSumar(prestacion),
                    diagnostico: configAutomArr.diagnostico[0].diagnostico,
                    datosReportables: datoReportable
                };

                return dto;
            },
            recupero: function (prestacion) {
                let dto = {
                    factura: 'recupero'
                }

                return dto;
            },
            main: function (prestacion) {

                if (prestacion.obraSocial) {
                    return this.recupero();
                } else {
                    return this.sumar(prestacion);
                }
            }
        },

        /* Prestación Niño Sano */
        '2091000013101': {
            term: "niño sano",
        }
    }

    let dtoSumar: any = {};
    let dtoRecupero: any = {};

    let main = await facturacion[prestacion.prestacion.conceptId].main(prestacion);
    
    if (main.factura === 'sumar') {
    
        if (main.preCondicion) {
    
            dtoSumar = {
                objectId: prestacion.turno._id,
                cuie: prestacion.organizacion.cuie,
                diagnostico: main.diagnostico,
                dniPaciente: prestacion.paciente.dni,
                claveBeneficiario: afiliadoSumar.clavebeneficiario,
                idAfiliado: afiliadoSumar.id_smiafiliados,
                edad: moment(new Date()).diff(prestacion.paciente.fechaNacimiento, 'years'),
                sexo: (prestacion.paciente.sexo === 'masculino') ? 'M' : 'F',
                fechaNacimiento: prestacion.paciente.fechaNacimiento,
                anio: moment(prestacion.paciente.fechaNacimiento).format('YYYY'),
                mes: moment(prestacion.paciente.fechaNacimiento).format('MM'),
                dia: moment(prestacion.paciente.fechaNacimiento).format('DD'),
                valorDatoReportable: main.datosReportables
            }

            facturaSumar.facturaSumar(pool, dtoSumar, datosConfiguracionAutomatica);
        }
    } else if (main.factura === 'recupero') {

        dtoRecupero = {
            objectId: prestacion.turno._id,
            dniPaciente: prestacion.paciente.dni,
            dniProfesional: prestacion.profesional.dni,
            codigoFinanciador: prestacion.obraSocial.codigoFinanciador,
            idEfector: prestacion.organizacion.idSips,
        }

        facturaRecupero.facturaRecupero(pool, dtoRecupero, datosConfiguracionAutomatica);
    }
}