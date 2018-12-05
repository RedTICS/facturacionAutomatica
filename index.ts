import { prestacionDTO } from './dto-webhook';
import { SipsDBConfiguration } from './config.private';
import { Factura } from './factura';

const sql = require('mssql');
const mongoose = require('mongoose');

export async function facturar() {
    mongoose.connect('mongodb://localhost:27017/andes', { useNewUrlParser: true });

    sql.close();
    let pool = await sql.connect(SipsDBConfiguration);

    let factura = new Factura();

    factura.facturar(pool, prestacionDTO);
}

facturar();