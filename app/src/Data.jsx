export const fakeData = {
    valuesDates: ['2024-09-01', '2024-09-03', '2024-09-08', '2024-09-11'],
    products: [
        {
            name: 'stocks',
            values: [1000, 1200, 900, 1100],
            incomes: [{
                name: 'taxes',
                value: -50,
                days: 30,
            }],
            visible: true,
            color: "#aa2020",
        },
        {
            name: 'immo',
            values: [2000, 1800, 2050, 2100],
            incomes: [{
                name: 'rent',
                value: 100,
                days: 30,
            },{
                name: 'taxes',
                value: -10,
                days: 30,
            }],
            visible: true,
            color: "#aa2020",
        },
        {
            name: 'food',
            values: [],
            incomes: [{
                name: 'pizzas',
                value: -10,
                days: 1,
            }],
            visible: true,
            color: "#aa2020",
        },
        {
            name: 'job',
            values: [],
            incomes: [{
                name: 'wage',
                value: 1200,
                days: 30,
            }],
            visible: true,
            color: "#aa2020",
        },
        {
            name: 'rent',
            values: [],
            incomes: [{
                name: 'rent',
                value: -400,
                days: 30,
            }],
            visible: true,
            color: "#aa2020",
        }
    ]
};