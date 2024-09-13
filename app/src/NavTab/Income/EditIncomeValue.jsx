import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Col, Row, Container } from 'reactstrap';
import EditProductValue from '../Value/EditProductValue';

function buildLabel(name, _for) {
    return (<Label for={_for} className='item-name'>{name}</Label>)
}

function EditIncomeValue(props) {
    const product = props.product;
    const updateData = props.updateData;

    const [incomeValueValid, setIncomeValueValid] = useState(true);
    const [incomeEveryValid, setIncomeEveryValid] = useState(true);
    const [feesValueValid, setFeesValueValid] = useState(true);
    const [feesEveryValid, setFeesEveryValid] = useState(true);

    function onIncomeValueChange(event) {
        const val = event.target.value;
        const valid = val != '' && /^-?\d+$/.test(val);
        setIncomeValueValid(valid);
        product.income.val = valid ? parseFloat(val) : 0;
        updateData();
    }

    function onIncomeDaysChange(event) {
        const val = event.target.value;
        const valid = val != '' && /^-?\d+$/.test(val);
        setIncomeEveryValid(valid);
        product.income.everyDays = valid ? parseFloat(val) : 0;
        updateData();
    }

    function onFeesValueChange(event) {
        const val = event.target.value;
        const valid = val != '' && /^-?\d+$/.test(val);
        setFeesValueValid(valid);
        product.fees.val = valid ? parseFloat(val) : 0;
        updateData();
    }

    function onFeesDaysChange(event) {
        const val = event.target.value;
        const valid = val != '' && /^-?\d+$/.test(val);
        setFeesEveryValid(valid);
        product.fees.everyDays = valid ? parseFloat(val) : 0;
        updateData();
    }

    return (
        <FormGroup className=''>
            <Row>
                <Col md={5} className='col'>
                    <Container className='flex'>
                        {buildLabel("Income:", `income-value`)}
                        <Input id={`${product.name}-income-value`} name={product.name}
                            defaultValue={product.income.val} onChange={onIncomeValueChange}
                            className={`on-right ${incomeValueValid ? '' : 'incorrect-input'}`} />
                    </Container>
                </Col>
                <Col>
                    <Container className='flex'>
                        {buildLabel("Every:", `income-every`)}
                        <Input id={`${product.name}-income-every`} name={product.name}
                            defaultValue={product.income.everyDays} onChange={onIncomeDaysChange}
                            className={`on-right ${incomeEveryValid ? '' : 'incorrect-input'}`} />
                        {buildLabel("Days", `days`)}
                    </Container>
                </Col>
            </Row>
            <Row>
                <Col md={5} className='col'>
                    <Container className='flex'>
                        {buildLabel("Fees:", `fees-value`)}
                        <Input id={`${product.name}-fees-value`} name={product.name}
                            defaultValue={product.fees.val} onChange={onFeesValueChange}
                            className={`on-right ${feesValueValid ? '' : 'incorrect-input'}`} />
                    </Container>
                </Col>
                <Col>
                    <Container className='flex'>
                        {buildLabel("Every:", `fees-every`)}
                        <Input id={`${product.name}-fees-every`} name={product.name}
                            defaultValue={product.fees.everyDays} onChange={onFeesDaysChange}
                            className={`on-right ${feesEveryValid ? '' : 'incorrect-input'}`} />
                        {buildLabel("Days", `days`)}
                    </Container>
                </Col>
            </Row>
        </FormGroup>
    )
}

export default EditIncomeValue;
