export const fakeData = {
    wallet: {
        nextId: 8,
        valuesDates: ['2024-09-01', '2024-09-03', '2024-09-08', '2024-09-11'],
        id: 0,
        name: 'Total',
        type: 'f',
        visible: true,
        color: '#aa3030',
        isOpen: true,
        products: [
            {
                id: 7,
                name: 'investments',
                type: 'f',
                visible: true,
                color: '#aa3030',
                isOpen: true,
                products: [
                    {
                        id: 1,
                        name: 'stocks',
                        type: 'p',
                        visible: true,
                        hasValue: true,
                        hasIncome: false,
                        color: "#aa2020",
                        values: [1000, 1200, 1300, 1400],
                        incomes: [{
                            name: 'taxes',
                            value: -50,
                            days: 30,
                        }],
                    },
                    {
                        id: 2,
                        name: 'immo',
                        type: 'p',
                        visible: true,
                        hasValue: true,
                        hasIncome: true,
                        color: "#aa2020",
                        values: [2000, 1800, 2050, 2100],
                        incomes: [{
                            name: 'rent',
                            value: 100,
                            days: 30,
                        }, {
                            name: 'taxes',
                            value: -10,
                            days: 30,
                        }],
                    },
                ]
            },
            {
                id: 3,
                name: 'expenses',
                type: 'f',
                visible: true,
                color: '#30aa30',
                isOpen: false,
                products: [
                    {
                        id: 4,
                        name: 'food',
                        type: 'p',
                        visible: true,
                        hasValue: false,
                        hasIncome: true,
                        color: "#aa2020",
                        values: [0, 0, 0, 0],
                        incomes: [{
                            name: 'pizzas',
                            value: -10,
                            days: 1,
                        }],
                    },
                    {
                        id: 5,
                        name: 'rent',
                        type: 'p',
                        visible: true,
                        hasValue: false,
                        hasIncome: true,
                        color: "#aa2020",
                        values: [0, 0, 0, 0],
                        incomes: [{
                            name: 'rent',
                            value: -400,
                            days: 30,
                        }],
                    }

                ]
            },
            {
                id: 6,
                name: 'job',
                type: 'p',
                visible: true,
                hasValue: false,
                hasIncome: true,
                color: "#aa2020",
                values: [0, 0, 0, 0],
                incomes: [{
                    name: 'wage',
                    value: 1200,
                    days: 30,
                }],
            },
        ]
    }
};