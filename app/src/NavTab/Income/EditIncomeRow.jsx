import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Col, Row, Container } from 'reactstrap';
import EditProductValue from '../Value/EditProductValue';

function buildLabel(name, _for) {
    return (<Label for={_for} className='item-name'>{name}</Label>)
}

function EditIncomeRowValue(income){
    function onValueChange(event){
        income.value = event.target.value;
        updateData()
    }
    return <Row className='med-grey-hover'>
        <Col><p className='item-name'>{income.name}</p></Col>
        <Col className='flex'>
            <Input className='on-right' defaultValue={income.value}/>
        </Col>
        <Col className='flex'>
            <Input className='on-right' defaultValue={income.days}/>
        </Col>
    </Row>
}

function EditIncomeRow(props) {
    const product = props.product;
    const updateData = props.updateData;

    function deleteIncome(event){
        const incomeIndex = product.incomes.findIndex(i => i.name == event.target.id)
        product.incomes.splice(incomeIndex, 1);
        updateData();
    }

    function EditIncomeRowValue(income) {
        function onValueChange(event) {
            income.value = parseFloat(event.target.value);
            updateData()
        }
        function onDaysChange(event) {
            income.days = parseFloat(event.target.value);
            updateData()
        }
        return <Row className='med-grey-hover' key={product.name + '-' + income.name}>
            <Col className='flex'>
                <p className='item-name'>\_{income.name}</p>
                <Button className='on-right' id={income.name} onClick={deleteIncome}>-</Button>
            </Col>
            <Col className='flex'>
                <Input className='on-right' defaultValue={income.value} onChange={onValueChange}/>
            </Col>
            <Col className='flex'>
                <Input className='on-right' defaultValue={income.days} onChange={onDaysChange}/>
            </Col>
        </Row>
    }

    const [newIncomeValid, setNewIncomeValid] = useState(false);
    function isNewIncomeValid(event){
        const newIncome = event.target.value;
        setNewIncomeValid(newIncome != '' && product.incomes.findIndex(i => i.name == newIncome) === -1);
    }
    function addNewIncome(){
        const newIncomeName = document.getElementById(`new-income-input-${product.name}`).value;
        product.incomes.push({
            name: newIncomeName,
            value: 0,
            days: 0,
        })
        updateData();
    }

    let total = 0;
    product.incomes.forEach(i => total += i.days === 0 ? 0 : i.value * 30 / i.days);

    const productNameCol = <Row>
        <Col className='flex'>
            <p className='item-name'>{product.name}</p>
        </Col>
        <Col className='flex'>
            <Input placeholder='New Income' onChange={isNewIncomeValid} id={`new-income-input-${product.name}`}></Input>
            <Button disabled={!newIncomeValid} onClick={addNewIncome}>+</Button>
        </Col>
        <Col className='flex'>
        <p className={`value on-right ${total > 0 ? 'positive-value' : 'negative-value'}`}>{total}€ /mo</p>
        </Col>
    </Row>
    return <Row className='light-med-grey-hover'>
        {productNameCol}
        {product.incomes.map(i => EditIncomeRowValue(i))}
    </Row>

    // const [incomeValueValid, setIncomeValueValid] = useState(true);
    // const [incomeEveryValid, setIncomeEveryValid] = useState(true);
    // const [feesValueValid, setFeesValueValid] = useState(true);
    // const [feesEveryValid, setFeesEveryValid] = useState(true);

    // function onIncomeValueChange(event) {
    //     const val = event.target.value;
    //     const valid = val != '' && /^-?\d+$/.test(val);
    //     setIncomeValueValid(valid);
    //     product.income.val = valid ? parseFloat(val) : 0;
    //     updateData();
    // }

    // function onIncomeDaysChange(event) {
    //     const val = event.target.value;
    //     const valid = val != '' && /^-?\d+$/.test(val);
    //     setIncomeEveryValid(valid);
    //     product.income.everyDays = valid ? parseFloat(val) : 0;
    //     updateData();
    // }

    // function onFeesValueChange(event) {
    //     const val = event.target.value;
    //     const valid = val != '' && /^-?\d+$/.test(val);
    //     setFeesValueValid(valid);
    //     product.fees.val = valid ? parseFloat(val) : 0;
    //     updateData();
    // }

    // function onFeesDaysChange(event) {
    //     const val = event.target.value;
    //     const valid = val != '' && /^-?\d+$/.test(val);
    //     setFeesEveryValid(valid);
    //     product.fees.everyDays = valid ? parseFloat(val) : 0;
    //     updateData();
    // }

    // return (
    //     <Row>
    //         <Row>
    //             <Col> 
    //                 <Container className='flex'>
    //                     {buildLabel("Income:", `income-value`)}
    //                     <Input id={`${product.name}-income-value`} name={product.name}
    //                         defaultValue={product.income.val} onChange={onIncomeValueChange}
    //                         className={`on-right ${incomeValueValid ? '' : 'incorrect-input'}`} />
    //                 </Container>
    //             </Col>
    //             <Col>
    //                 <Container className='flex'>
    //                     {buildLabel("Every:", `income-every`)}
    //                     <Input id={`${product.name}-income-every`} name={product.name}
    //                         defaultValue={product.income.everyDays} onChange={onIncomeDaysChange}
    //                         className={`on-right ${incomeEveryValid ? '' : 'incorrect-input'}`} />
    //                     {buildLabel("Days", `days`)}
    //                 </Container>
    //             </Col>
    //         </Row>
    //         <Row>
    //             <Col md={5} className='col'>
    //                 <Container className='flex'>
    //                     {buildLabel("Fees:", `fees-value`)}
    //                     <Input id={`${product.name}-fees-value`} name={product.name}
    //                         defaultValue={product.fees.val} onChange={onFeesValueChange}
    //                         className={`on-right ${feesValueValid ? '' : 'incorrect-input'}`} />
    //                 </Container>
    //             </Col>
    //             <Col>
    //                 <Container className='flex'>
    //                     {buildLabel("Every:", `fees-every`)}
    //                     <Input id={`${product.name}-fees-every`} name={product.name}
    //                         defaultValue={product.fees.everyDays} onChange={onFeesDaysChange}
    //                         className={`on-right ${feesEveryValid ? '' : 'incorrect-input'}`} />
    //                     {buildLabel("Days", `days`)}
    //                 </Container>
    //             </Col>
    //         </Row>
    //     </Row>
    // )
}

export default EditIncomeRow;
