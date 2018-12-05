import { prestacionDTO } from './dto-webhook';
import { SipsDBConfiguration } from './config.private';
import { FacturaSumar } from './facturacion/sumar/facturacionSumar';

const sql = require('mssql');
const mongoose = require('mongoose');

export async function facturar() {
    mongoose.connect('mongodb://localhost:27017/andes', { useNewUrlParser: true });

    sql.close();
    let pool = await sql.connect(SipsDBConfiguration);

    let facturaSumar = new FacturaSumar();

    if (prestacionDTO.obraSocial) {
        console.log("Tiene OS ");
    } else {
        facturaSumar.facturar(pool, prestacionDTO);
        console.log("Nooo Tiene OS ");
    }
}

facturar();