import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Col, Row, Container } from 'reactstrap';

function buildLabel(name, _for) {
    return (<Label for={_for} className='item-name'>{name}</Label>)
}

function EditIncomeRow(props) {
    const product = props.product;
    const updateData = props.updateData;

    const [showIncomes, setShowIncomes] = useState(false);
    function toggleShowIncomes(){
        setShowIncomes(!showIncomes);
    }

    function deleteIncome(event){
        const incomeIndex = product.incomes.findIndex(i => i.name == event.target.id)
        product.incomes.splice(incomeIndex, 1);
        if (product.incomes.length === 0){
            setShowIncomes(false);
        }
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
        return <Row className='med-grey-hover flex-no-wrap flex' key={product.name + '-' + income.name}>
            <Col className='flex'>
                <p className='item-name'>&nbsp;| {income.name}</p>
                <Container className='on-right'>
                    <Button id={income.name} onClick={deleteIncome}>-</Button>
                </Container>
            </Col>
            <Col className='flex'>
                <Input className='input-min-width on-right' defaultValue={income.value} onChange={onValueChange}/>
            </Col>
            <Col className='flex'>
                <Input className='input-min-width on-right' defaultValue={income.days} onChange={onDaysChange}/>
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
        document.getElementById(`new-income-input-${product.name}`).value = '';
        setShowIncomes(true);
        updateData();
    }

    let total = 0;
    product.incomes.forEach(i => total += i.days === 0 ? 0 : i.value * 30 / i.days);

    const productNameCol = <Row className='flex flex-no-wrap'>
        <Col className='flex'>
            <p className='item-name clickable' onClick={toggleShowIncomes} >{showIncomes ? '▽' : '▷'} {product.name}</p>
        </Col>
        <Col className='flex input-min-width'>
            <Input placeholder='New Income Name' onChange={isNewIncomeValid} id={`new-income-input-${product.name}`}></Input>
            <Button disabled={!newIncomeValid} onClick={addNewIncome}>+</Button>
        </Col>
        <Col className='flex'>
        <p className={`value on-right ${total > 0 ? 'positive-value' : 'negative-value'}`}>{total}€ /mo</p>
        </Col>
    </Row>;

    return <Row className='light-med-grey-hover flex-no-wrap flexy'>
        {productNameCol}
        {showIncomes ? product.incomes.map(i => EditIncomeRowValue(i)) : ''}
    </Row>

}

export default EditIncomeRow;
