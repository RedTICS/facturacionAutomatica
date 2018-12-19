import * as prestaciones from './dto-webhook';
import { SipsDBConfiguration } from './config.private';
import { Factura } from './factura';
import { prestacionOtoemisiones } from './dto-webhook';

const sql = require('mssql');
const mongoose = require('mongoose');
const chalk = require('chalk');
const log = console.log;
const figlet = require('figlet');

export async function facturar() {
    // log(chalk.red.bold(
    //     figlet.textSync('Fantasy Machine', {
    //         horizontalLayout: 'default',
    //         font: 'banner'
    //     })
    // ));
    mongoose.connect('mongodb://localhost:27017/andes', { useNewUrlParser: true });

    sql.close();
    let pool = await sql.connect(SipsDBConfiguration);

    let factura = new Factura();

    //factura.facturar(pool, prestaciones.prestacionOtoemisiones);
    factura.facturar(pool, prestaciones.prestacionNiñoSano);
}

facturar();