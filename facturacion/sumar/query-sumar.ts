const sql = require('mssql');

export class QuerySumar {
    async saveComprobanteSumar(pool, dtoComprobante) {
        let query = 'INSERT INTO dbo.PN_comprobante (cuie, id_factura, nombre_medico, fecha_comprobante, clavebeneficiario, id_smiafiliados, fecha_carga, comentario, marca, periodo, activo, idTipoDePrestacion,objectId,factAutomatico) ' +
            ' values (@cuie, NULL, NULL, @fechaComprobante, @claveBeneficiario, @idAfiliado, @fechaCarga, @comentario, @marca, @periodo, @activo, @idTipoPrestacion, @objectId, @factAutomatico)' +
            ' SELECT SCOPE_IDENTITY() AS id';

        let result = await new sql.Request(pool)
            .input('cuie', sql.VarChar(10), dtoComprobante.cuie)
            .input('fechaComprobante', sql.DateTime, dtoComprobante.fechaComprobante)
            .input('claveBeneficiario', sql.VarChar(50), dtoComprobante.claveBeneficiario)
            .input('idAfiliado', sql.Int, dtoComprobante.idAfiliado)
            .input('fechaCarga', sql.DateTime, dtoComprobante.fechaCarga)
            .input('comentario', sql.VarChar(500), dtoComprobante.comentario)
            .input('marca', sql.VarChar(10), dtoComprobante.marca)
            .input('periodo', sql.VarChar(7), dtoComprobante.periodo)
            .input('activo', sql.VarChar(1), dtoComprobante.activo)
            .input('idTipoPrestacion', sql.Int, dtoComprobante.idTipoPrestacion)
            .input('objectId', sql.VarChar(50), dtoComprobante.objectId)
            .input('factAutomatico', sql.VarChar(50), 'prestacion')
            .query(query);

        return result && result.recordset ? result.recordset[0].id : null;
    }

    async savePrestacionSumar(pool, dtoPrestacion) {
        let query = 'INSERT INTO [dbo].[PN_prestacion] ([id_comprobante],[id_nomenclador],[cantidad],[precio_prestacion],[id_anexo],[peso],[tension_arterial],[diagnostico],[edad],[sexo],[fecha_nacimiento],[fecha_prestacion],[anio],[mes],[dia]' +
            ')' +
            ' VALUES (@idComprobante,@idNomenclador,@cantidad,@precioPrestacion,@idAnexo,@peso,@tensionArterial,@diagnostico,@edad,@sexo,@fechaNacimiento,@fechaPrestacion,@anio,@mes,@dia' +
            ')' +
            'SELECT SCOPE_IDENTITY() AS id';

        let result = await new sql.Request(pool)
            .input('idComprobante', sql.Int, dtoPrestacion.idComprobante)
            .input('idNomenclador', sql.Int, dtoPrestacion.idNomenclador)
            .input('cantidad', sql.Int, 1) // Valor por defecto
            .input('precioPrestacion', sql.Decimal, dtoPrestacion.precioPrestacion)
            .input('idAnexo', sql.Int, 301) // Valor por defecto (No corresponde)
            .input('peso', sql.Decimal, 0)
            .input('tensionArterial', sql.VarChar(7), '00/00')
            .input('diagnostico', sql.VarChar(500), dtoPrestacion.diagnostico)
            .input('edad', sql.VarChar(2), dtoPrestacion.edad)
            .input('sexo', sql.VarChar(2), dtoPrestacion.sexo)
            .input('fechaNacimiento', sql.DateTime, new Date(dtoPrestacion.fechaNacimiento))
            .input('fechaPrestacion', sql.DateTime, new Date(dtoPrestacion.fechaPrestacion))
            .input('anio', sql.Int, dtoPrestacion.anio)
            .input('mes', sql.Int, dtoPrestacion.mes)
            .input('dia', sql.Int, dtoPrestacion.dia)
            .query(query);

        if (result && result.recordset) {
            let idPrestacion = result.recordset[0].id;

            return idPrestacion;
        }
    }

    async saveDatosReportablesSumar(pool, dtoPrestacion) {
        let query = 'INSERT INTO [dbo].[PN_Rel_PrestacionXDatoReportable] ([idPrestacion], [idDatoReportable], [valor])' +
            ' values (@idPrestacion, @idDatoReportable, @valor)' +
            'SELECT SCOPE_IDENTITY() AS id';

        let result = await new sql.Request(pool)
            .input('idPrestacion', sql.Int, dtoPrestacion.idPrestacion)
            .input('idDatoReportable', sql.Int, dtoPrestacion.idDatoReportable)
            .input('valor', sql.VarChar(500), dtoPrestacion.valor)
            .query(query);

        if (result && result.recordset) {            
            let idDatoReportable = result.recordset[0].id;
            console.log("Result Dato Reportabkle: ", idDatoReportable);

        }
    }

    async getAfiliadoSumar(pool, documento) {
        return new Promise((resolve: any, reject: any) => {
            (async function () {
                try {
                    let query = 'SELECT * FROM dbo.PN_smiafiliados WHERE afidni = @documento AND activo = @activo';
                    let resultado = await new sql.Request(pool)
                        .input('documento', sql.VarChar(50), documento)
                        .input('activo', sql.VarChar(1), 'S')
                        .query(query)

                    resolve(resultado.recordset[0] ? resultado.recordset[0] : null);

                } catch (err) {
                    reject(err);
                }
            })();
        });
    }

    async getNomencladorSumar(pool, idNomeclador) {
        let query = 'SELECT * FROM [dbo].[PN_nomenclador] where id_nomenclador = @idNomenclador';
        let resultado = await new sql.Request(pool)
            .input('idNomenclador', sql.VarChar(50), idNomeclador)
            .query(query);

        let res = null;
        if (resultado.recordset[0]) {
            res = {
                precio: resultado.recordset[0].precio
            }
        }

        return res;
    }
}