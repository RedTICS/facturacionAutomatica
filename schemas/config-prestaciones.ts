import * as mongoose from 'mongoose';

let configFacturacionAutomaticaSchema = new mongoose.Schema({
    prestacionSnomed: {
        conceptId: { type: String },
        term: { type: String },
        fsn: { type: String },
        semanticTag: { type: String }
    },
    recuperoFinanciero: {
        descripcion: { type: String },
        idNomenclador: { type: String },
        codigo: { type: String },
        idServicio: { type: String }
    },
    sumar: {
        descripcion: { type: String },
        codigo: { type: String },
        idDatosReportables: { type: String },
        diagnostico: mongoose.Schema.Types.Mixed,
        datosReportables: mongoose.Schema.Types.Mixed,
        idNomenclador: { type: String }
    }
});

let configFacturacionAutomatica = mongoose.model('configFacturacionAutomatica', configFacturacionAutomaticaSchema, 'configFacturacionAutomatica');

export = configFacturacionAutomatica;

