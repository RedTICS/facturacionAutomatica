/* Prestaci+on Niño Sano Recién Nacido*/
export const prestacionNiñoSano = {
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
        // conceptId: '410621008',
        conceptId: '410620009',
        term: "consulta de niño sano, recién nacido",
        fsn: "consulta de niño sano, recién nacido (procedimiento)",
        datosReportables: null
        // datosReportables: [
        //     {
        //         conceptId: '27113001',
        //         term: 'peso corporal',
        //         valor: '15'
        //     },
        //     {
        //         conceptId: '12345',
        //         term: 'prueba borrar',
        //         valor: '555'
        //     },
        //     {
        //         conceptId: '248338008',
        //         term: 'percentilo de talla',
        //         valor: '80'
        //     },
        //     {
        //         conceptId: '363812007',
        //         term: 'perimetro cefalico',
        //         valor: '90'
        //     }
        // ],
    },
    organizacion: {
        nombre: "HOSPITAL PROVINCIAL NEUQUEN - DR. EDUARDO CASTRO RENDON",
        cuie: "Q06391",
        idSips: 205
    },
    // obraSocial: null,
    /* Usar este para los que tienen OS*/
    obraSocial: {
        codigoFinanciador: '921001',
        financiador: 'O.S.P. NEUQUEN'
    },
    profesional: {
        nombre: "MARIA LAURA",
        apellido: "MONTEVERDE",
        dni: "25204237",
    }
}

/* Prestación de Otoemisiones */
export const prestacionOtoemisiones = {
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
        datosReportables: null
        // datosReportables: [
        //     {
        //         conceptId: '371580005',
        //         term: 'evaluación de antecedentes',
        //         valor: {
        //             conceptId: '160245001',
        //             nombre: 'sin problemas o incapacidad actual'
        //         }
        //     },
        //     {
        //         conceptId: '2111000013109',
        //         term: 'otoemisión acústica de oído izquierdo',
        //         valor: {
        //             conceptId: '2261000013100',
        //             nombre: 'otoemision acustica ausente'
        //         }
        //     },
        //     {
        //         conceptId: '2101000013106',
        //         term: 'otoemisión acústica de oído derecho',
        //         valor: {
        //             conceptId: '2271000013107',
        //             nombre: 'otoemisión acustica presente'
        //         }
        //     }
        // ],
    },
    organizacion: {
        nombre: "HOSPITAL PROVINCIAL NEUQUEN - DR. EDUARDO CASTRO RENDON",
        cuie: "Q06391",
        idSips: 205
    },
    // obraSocial: null,
    /* Usar este para los que tienen OS*/
    obraSocial: {
        codigoFinanciador: '921001',
        financiador: 'O.S.P. NEUQUEN'
    },
    profesional: {
        nombre: "MARIA LAURA",
        apellido: "MONTEVERDE",
        dni: "25204237",
    }
}