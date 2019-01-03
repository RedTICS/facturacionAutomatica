import * as moment from 'moment';
import * as facturaSumar from './../facturacion/sumar/factura-sumar';
import * as facturaRecupero from './../facturacion/recupero-financiero/factura-recupero';

import { QuerySumar } from './../facturacion/sumar/query-sumar';

export async function jsonFacturacion(pool, prestacion, datosConfiguracionAutomatica) {
    let querySumar = new QuerySumar();

    let afiliadoSumar: any = await querySumar.getAfiliadoSumar(pool, prestacion.paciente.dni);

    let datoReportable = [];

    let facturacion = {
        /* Prestación Otoemisiones */
        /* TODO: poner la expresión que corresponda */
        '2091000013100': {
            term: "otoemisiones",
            sumar: function (arrayPrestacion, arrayConfiguracion) {
                console.log("Entra a otoemisiones");
                let dr = {
                    idDatoReportable: '',
                    datoReportable: ''
                };

                arrayPrestacion.forEach((element, index) => {
                    let oido = arrayConfiguracion[0].find(obj => obj.conceptId == element.conceptId);

                    if (oido) {
                        let valor = arrayConfiguracion[0].find(obj => obj.conceptId == element.valor.conceptId);
                        dr.datoReportable += oido.valor + valor.valor + '/';
                    }
                });

                dr.idDatoReportable = datosConfiguracionAutomatica.sumar.datosReportables[0].idDatosReportables;
                dr.datoReportable = dr.datoReportable.slice(0, -1);

                datoReportable.push(dr);

                return datoReportable;
            }
        },

        /* Prestación Niño Sano 410621008*/
        /* TODO: poner la expresión que corresponda */
        '410620009': {
            term: "consulta de niño sano, recién nacido",
            sumar: async function (arrayPrestacion, arrayConfiguracion) {
                console.log("Entra a niño sano");
                let x = 0;

                arrayPrestacion.forEach((element, index) => {
                    let data = arrayConfiguracion.find(obj => obj.conceptId == element.conceptId);

                    let dr = {
                        idDatoReportable: '',
                        datoReportable: ''
                    };

                    if (data) {
                        dr.idDatoReportable = datosConfiguracionAutomatica.sumar.datosReportables[x].idDatosReportables;
                        dr.datoReportable = element.valor;

                        datoReportable.push(dr);
                        x++;
                    }
                });

                return datoReportable;
            },
        },
        main: async function (prestacion) {
            if (prestacion.obraSocial) {
                let dto: any = {
                    factura: 'recupero'
                }

                return dto;
            } else {
                const arrayPrestacion = prestacion.prestacion.datosReportables.map((dr: any) => dr);
                const arrayConfiguracion = datosConfiguracionAutomatica.sumar.datosReportables.map((config: any) => config.valores);

                let dto: any = {
                    factura: 'sumar',
                    diagnostico: datosConfiguracionAutomatica.sumar.diagnostico[0].diagnostico,
                    datosReportables: await facturacion[datosConfiguracionAutomatica.expresionSnomed].sumar(arrayPrestacion, arrayConfiguracion) //this.sumar()
                };

                return dto;
            }
        },
        'sumar': {
            preCondicionSumar: function (prestacion) {
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
            }
        }
    }

    let dtoSumar: any = {};
    let dtoRecupero: any = {};

    let main = await facturacion.main(prestacion);

    if (main.factura === 'sumar') {
        if (facturacion[main.factura].preCondicionSumar(prestacion)) {
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
                datosReportables: main.datosReportables
            }

            facturaSumar.facturaSumar(pool, dtoSumar, datosConfiguracionAutomatica);
        } else if (afiliadoSumar) {

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