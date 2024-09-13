export const fakeData = {
    valuesDates: ['2024-09-01', '2024-09-03', '2024-09-08', '2024-09-11'],
    products: [
        {
            name: 'stocks',
            values: [1000, 1200, 900, 1100],
            income: {
                everyDays: 1,
                val: 1
            },
            fees: {
                everyDays: 90,
                val: 10
            },
            visible: true,
            color: "#aa2020",
        },
        {
            name: 'immo',
            values: [2000, 1800, 2050, 2100],
            income: {
                everyDays: 30,
                val: 200
            },
            fees: {
                everyDays: 30,
                val: 30
            },
            visible: true,
            color: "#aa2020",
        },
        {
            name: 'food',
            values: [],
            income: {
                everyDays: 0,
                val: 0
            },
            fees: {
                everyDays: 1,
                val: 10
            },
            visible: true,
            color: "#aa2020",
        },
        {
            name: 'job',
            values: [],
            income: {
                everyDays: 30,
                val: 2000
            },
            fees: {
                everyDays: 0,
                val: 0
            },
            visible: true,
            color: "#aa2020",
        },
        {
            name: 'rent',
            values: [],
            income:{
                everyDays: 0,
                val: 0,
            },
            fees: {
                everyDays: 30,
                val: 500
            },
            visible: true,
            color: "#aa2020",
        }
    ]
};