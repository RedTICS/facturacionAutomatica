export const prestacionDTO = {
    turno: {
        _id: '5bec30933f72cc162dfa2a11',
    },
    paciente: {
        nombre: 'Luis',
        apellido: 'Parada',
        dni: '25334392',
        fechaNacimiento: '1976-06-21',
        sexo: 'masculino'
    },
    prestacion: {
        conceptId: '2091000013100',
        term: "screening de otoemisión acústica neonatal (procedimiento)",
        fsn: "screening de otoemisión acústica neonatal (procedimiento)",
        datosReportables: [
            {
                conceptId: '371580005',
                term: 'evaluación de antecedentes',
                valor: {
                    conceptId: '160245001',
                    nombre: 'sin problemas o incapacidad actual'
                }
            },
            {
                conceptId: '2111000013109',
                term: 'otoemisión acústica de oído izquierdo',
                valor: {
                    conceptId: '2261000013100',
                    nombre: 'otoemision acustica ausente'
                }
            },
            {
                conceptId: '2101000013106',
                term: 'otoemisión acústica de oído derecho',
                valor: {
                    conceptId: '2271000013107',
                    nombre: 'otoemisión acustica presente'
                }
            }
        ],
    },
    organizacion: {
        nombre: "HOSPITAL PROVINCIAL NEUQUEN - DR. EDUARDO CASTRO RENDON",
        cuie: "Q06391",
    },
    obraSocial: null,
    /* Usar este para los que tienen OS*/
    // obraSocial: {
    //     codigoFinanciador: '921001',
    //     financiador: 'O.S.P. NEUQUEN'
    // },
    profesional: {
        nombre: "MARIA LAURA",
        apellido: "MONTEVERDE",
        documento: "25204237",
    }
}