import * as configFacturacionAutomatica from '../../schemas/config-prestaciones';
import * as configJson from '../../configJson/configJson';

export class FacturaSumar {

    async facturar(pool, prestacion) {
        let datosConfiguracionAutomatica = await this.getConfigFacturacionAutomatica(prestacion);
        
        console.log("Robomon: ", datosConfiguracionAutomatica);

        let process = await configJson.jsonFacturacion(pool, prestacion, datosConfiguracionAutomatica);        
    }

    async getConfigFacturacionAutomatica(prestacion: any) {
        let conceptId = prestacion.prestacion.conceptId;

        let datosConfigAutomatica = await configFacturacionAutomatica.find({ 'prestacionSnomed.conceptId': conceptId });

        return datosConfigAutomatica[0];
    }
}