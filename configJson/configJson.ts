import * as moment from 'moment';
import { QuerySumar } from './../facturacion/sumar/query-sumar';

export async function jsonFacturacion(pool, prestacion, datosConfiguracionAutomatica) {    
    let querySumar = new QuerySumar()

    let afiliadoSumar: any = await querySumar.getAfiliadoSumar(pool, prestacion.paciente.dni);

    let facturacion = {
        /* Prestación Otoemisiones */
        '2091000013100': {
            term: "otoemisiones",
            preCondicion: function () {
                let valido = false;

                if (afiliadoSumar) {
                    valido = true;
                }

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

    if (facturacion[prestacion.prestacion.conceptId].preCondicion()) {
        let procesar = await facturacion[prestacion.prestacion.conceptId].process()
        console.log("Procesando...: ", procesar)

        let dtoComprobante = {
            cuie: prestacion.organizacion.cuie,
            fechaComprobante: new Date(),
            claveBeneficiario: afiliadoSumar.clavebeneficiario,
            idAfiliado: afiliadoSumar.id_smiafiliados,
            fechaCarga: new Date(),
            comentario: 'Carga Automática',
            periodo: moment(new Date, 'YYYY/MM/DD').format('YYYY') + '/' + moment(new Date, 'YYYY/MM/DD').format('MM'),
            activo: 'S',
            idTipoPrestacion: 1,
            objectId: prestacion.turno._id
        };

        let idComprobante = await querySumar.saveComprobanteSumar(pool, dtoComprobante);
        let precioPrestacion = await querySumar.getNomencladorSumar(pool, datosConfiguracionAutomatica.sumar.idNomenclador)

        prestacion = {
            idComprobante: idComprobante,
            idNomenclador: datosConfiguracionAutomatica.sumar.idNomenclador,
            cantidad: 1,
            precioPrestacion: precioPrestacion.precio,
            idAnexo: 301,
            peso: 0,
            tensionArterial: '00/00',
            diagnostico: procesar.diagnostico,
            edad: moment(new Date()).diff(prestacion.paciente.fechaNacimiento, 'years'),
            sexo: (prestacion.paciente.sexo === 'masculino') ? 'M' : 'F',
            fechaNacimiento: prestacion.paciente.fechaNacimiento,
            fechaPrestacion: new Date(),
            anio: moment(prestacion.paciente.fechaNacimiento).format('YYYY'),
            mes: moment(prestacion.paciente.fechaNacimiento).format('MM'),
            dia: moment(prestacion.paciente.fechaNacimiento).format('DD'),
        }

        let idPrestacion = await querySumar.savePrestacionSumar(pool, prestacion);        

        let datosReportables = {
            idPrestacion: idPrestacion,
            idDatoReportable: datosConfiguracionAutomatica.sumar.idDatosReportables,
            valor: procesar.datosReportables
        }
       
        let idDatoReportable = await querySumar.saveDatosReportablesSumar(pool, datosReportables);        
       
    } else {
        console.log("No cumple con la precondición")
    }
}