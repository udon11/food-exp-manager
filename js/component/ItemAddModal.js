import React from 'react'
import {Button, Modal, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';

export default class ItemAddModal extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            type: '',
            expirationDate: moment(moment().format('YYYY/MM/DD'), 'YYYY/MM/DD')
        }
    }

    render() {
        // イベント
        const close = () => {
            this.props.close();
        };
        const changeName = (e) => {
            this.setState({name: e.target.value});
        };
        const changeType = (e) => {
            this.setState({type: e.target.value});
        };
        const changeExpiratioDate = (date) => {
            this.setState({expirationDate: date});
        };
        const addItem = () => {
            this.props.addItem(this.state.name, this.state.type, this.state.expirationDate).then(() => {
                close();
                this.setState(
                    {
                        name: '',
                        type: '',
                        expirationDate: this.state.expirationDate
                    }
                );
                this.props.fetchItemList();
            }).catch(() => {
                alert('アイテムの追加に失敗');
            });
        };

        return (
            <Modal show={this.props.showModal} onHide={close}>
                <Modal.Header>
                    <Modal.Title>食品の追加</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form>
                        <FormGroup>
                            <ControlLabel>名前</ControlLabel>
                            <FormControl
                                type='text'
                                placeholder='アイテム名を入力'
                                value={this.state.name}
                                onChange={changeName}
                            />
                        </FormGroup>
                        {/*
                         <FormGroup>
                         <ControlLabel>種別</ControlLabel>
                         <FormControl
                         type="text"
                         placeholder="種別を選択"
                         value={this.state.type}
                         onChange={changeType}
                         />
                         </FormGroup>
                         */}
                        <div className='text-center'>
                            <DatePicker
                                inline
                                dateFormat='YYYY/MM/DD'
                                selected={this.state.expirationDate}
                                onChange={changeExpiratioDate}
                                todayButton={'今日'}
                            />
                        </div>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={close}>キャンセル</Button>
                    <Button bsStyle='primary' onClick={addItem}>追加</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
