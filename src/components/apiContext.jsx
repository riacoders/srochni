import  { createContext, useState } from 'react';

export const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
    const api_service = [
        { name: 'Qiziltepa', value: 'dis1', m1: 'ASKUE!B9:D9', r2: 'elektr-tarmoq-soni!B11:E11', m2: 'tamirlash!C11:R11', m3: 'zahira!C11:I11', m4: 'brigada!C14:H14' },
        { name: 'Karmana', value: 'dis2', m1: 'ASKUE!B8:D8', r2: 'elektr-tarmoq-soni!B9:E9', m2: 'tamirlash!C6:R6', m3: 'zahira!C6:I6', m4: 'brigada!C9:H9' },
        { name: 'Tomdi', value: 'dis3', m1: 'ASKUE!B11:D11', r2: 'elektr-tarmoq-soni!B15:E15', m2: 'tamirlash!C13:R13', m3: 'zahira!C13:I13', m4: 'brigada!C16:H16' },
        { name: "G'azg'on", value: 'dis4', m1: 'ASKUE!B13:D13', r2: 'elektr-tarmoq-soni!B7:E7', m2: 'tamirlash!C16:R16', m3: 'zahira!C16:I16', m4: 'brigada!C19:H19' },
        { name: 'Nurota', value: 'dis5', m1: 'ASKUE!B14:D14', r2: 'elektr-tarmoq-soni!B14:E14', m2: 'tamirlash!C9:R9', m3: 'zahira!C9:I9', m4: 'brigada!C12:H12' },
        { name: 'Konimex', value: 'dis6', m1: 'ASKUE!B10:D10', r2: 'elektr-tarmoq-soni!B10:E10', m2: 'tamirlash!C12:R12', m3: 'zahira!C12:I12', m4: 'brigada!C815:H15' },
        { name: 'Uchquduq', value: 'dis7', m1: 'ASKUE!B17:D17', r2: 'elektr-tarmoq-soni!B16:E16', m2: 'tamirlash!C14:R14', m3: 'zahira!C14:I14', m4: 'brigada!C17:H17' },
        { name: 'Xatirchi', value: 'dis8', m1: 'ASKUE!B12:D12', r2: 'elektr-tarmoq-soni!B17:E17', m2: 'tamirlash!C10:R10', m3: 'zahira!C10:I10', m4: 'brigada!C13:H13' },
        { name: 'Navbahor', value: 'dis9', m1: 'ASKUE!B16:D16', r2: 'elektr-tarmoq-soni!B12:E12', m2: 'tamirlash!C8:R8', m3: 'zahira!C8:I8', m4: 'brigada!C11:H11' }
    ];

    const [api_default, setApiDefault] = useState({
        askue: 'ASKUE!B6:D6',
        askues: 'ASKUE-hisoblagichlar!B7:D7',
        dailyIin: 'kunlik-tushum!A6:D13',
        dataCard: 'kunlik-istemol!A7:E15',
        regionsCard: 'viloyatlar!A2:B5',
        statsSection: 'null',
        table3: 'cas!C17:F17',
        table4: 'cas!G17:J17',
        table5: 'cas!K17:N17',
        table6: 'zahira!C5:I5',
        table7: 'brigada!C8:H8',
        table8: 'zahira!C5:I5',
        table9: 'tamirlash!C18:R18',
        table10: 'debetor!C22:Q22',
        table11: 'elektr-tarmoq-soni!B6:E6',
        table12: 'noqonuniy-holat!A10:C21'
    });

    return (
        <ApiContext.Provider value={{ api_service, api_default, setApiDefault }}>
            {children}
        </ApiContext.Provider>
    );
};
