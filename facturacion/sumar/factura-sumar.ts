import * as moment from 'moment';
import { QuerySumar } from './query-sumar';

let querySumar = new QuerySumar()

export async function facturaSumar(pool, dtoSumar, datosConfiguracionAutomatica) {   

    let afiliadoSumar: any = await querySumar.getAfiliadoSumar(pool, dtoSumar.dniPaciente);

    let dtoComprobante = {
        cuie: dtoSumar.cuie,
        fechaComprobante: new Date(),
        claveBeneficiario: afiliadoSumar.clavebeneficiario,
        idAfiliado: afiliadoSumar.id_smiafiliados,
        fechaCarga: new Date(),
        comentario: 'Carga Automática',
        periodo: moment(new Date, 'YYYY/MM/DD').format('YYYY') + '/' + moment(new Date, 'YYYY/MM/DD').format('MM'),
        activo: 'S',
        idTipoPrestacion: 1,
        objectId: dtoSumar.objectId
    };

    let idComprobante = await querySumar.saveComprobanteSumar(pool, dtoComprobante);
    let precioPrestacion = await querySumar.getNomencladorSumar(pool, datosConfiguracionAutomatica.sumar.idNomenclador)

    let prestacion = {
        idComprobante: idComprobante,
        idNomenclador: datosConfiguracionAutomatica.sumar.idNomenclador,
        cantidad: 1,
        precioPrestacion: precioPrestacion.precio,
        idAnexo: 301,
        peso: 0,
        tensionArterial: '00/00',
        diagnostico: dtoSumar.diagnostico,
        edad: dtoSumar.edad,
        sexo: dtoSumar.sexo,
        fechaNacimiento: dtoSumar.fechaNacimiento,
        fechaPrestacion: new Date(),
        anio: dtoSumar.anio,
        mes: dtoSumar.mes,
        dia: dtoSumar.dia,
    }

    let idPrestacion = await querySumar.savePrestacionSumar(pool, prestacion);

    let datosReportables = {
        idPrestacion: idPrestacion,
        idDatoReportable: datosConfiguracionAutomatica.sumar.idDatosReportables,
        valor: dtoSumar.valorDatoReportable
    }

    let idDatoReportable = await querySumar.saveDatosReportablesSumar(pool, datosReportables);  
}