import React from 'react';
import ReactDom from 'react-dom';
import DatePicker from 'react-datepicker';
import {Navbar, Nav, NavItem, Button, Glyphicon, Modal, Table, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import Request from 'superagent';
import moment from 'moment';
moment.updateLocale('en', {
    weekdays: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
    weekdaysShort: ["日", "月", "火", "水", "木", "金", "土"],
    relativeTime: {
        future: "%s後",
        past: "%s前",
        s: "seconds",
        m: "1分",
        mm: "%d分",
        h: "1時間",
        hh: "%d時間",
        d: "1日",
        dd: "%d日",
        M: "1ヶ月",
        MM: "%dヶ月",
        y: "1年",
        yy: "%d年"
    }
});

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            itemList: [],
            showItemAddModal: false
        };
        this.fetchItemList = this.fetchItemList.bind(this);
    }

    componentDidMount() {
        this.fetchItemList();
    }

    fetchItemList() {
        Request
            .get('/ajax/item/get')
            .end((err, res)=> {
                if (err) {
                    console.error(err);
                    return;
                }
                if (!res) {
                    return;
                }
                const jsonResponse = JSON.parse(res.text);
                this.setState({itemList: jsonResponse});
            });
    }

    /**
     * アイテムの追加
     */
    addItem(name, type, expirationDate) {
        return new Promise((resolve, reject) => {
            const query = {
                name: name,
                type: type,
                expirationDate: expirationDate.toString()
            };

            Request
                .get('/ajax/item/add')
                .query(query)
                .end((err, res) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }
                    resolve(res);
                });
        });
    }

    /**
     * アイテムの削除
     */
    removeItem(id) {
        return new Promise((resolve, reject) => {
            const query = {
                id: id
            };
            Request
                .get('/ajax/item/remove')
                .query(query)
                .end((err, res) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }
                    resolve(res);
                });
        });
    }

    render() {
        const open = () => {
            this.setState({showItemAddModal: true});
        };
        const close = () => {
            this.setState({showItemAddModal: false});
        };

        return (
            <div>
                <NavigationBar
                    {...this.state}
                    open={open}
                    close={close}
                    addItem={this.addItem}
                    fetchItemList={this.fetchItemList}
                />

                <ItemList
                    {...this.state}
                    removeItem={this.removeItem}
                    fetchItemList={this.fetchItemList}
                />
            </div>
        )
    }
}

class NavigationBar extends React.Component {
    render() {
        return (
            <Navbar fixedTop fluid>
                <Navbar.Header>
                    <Navbar.Brand>FoodExpManager</Navbar.Brand>
                </Navbar.Header>

                <Nav pullRight>
                    <NavItem>
                        <Glyphicon
                            glyph="glyphicon glyphicon-plus"
                            onClick={this.props.open}
                        />
                    </NavItem>
                </Nav>

                <ItemAddModal
                    showModal={this.props.showItemAddModal}
                    close={this.props.close}
                    {...this.props}
                />
            </Navbar>
        );
    }
}

class ItemAddModal extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            type: '',
            expirationDate: moment()
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
                                type="text"
                                placeholder="アイテム名を入力"
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
                                dateFormat="YYYY/MM/DD"
                                selected={this.state.expirationDate}
                                onChange={changeExpiratioDate}
                            />
                        </div>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={close}>キャンセル</Button>
                    <Button bsStyle="primary" onClick={addItem}>追加</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

class ItemList extends React.Component {
    render() {
        if (this.props.itemList.length === 0) {
            return <div></div>;
        }

        const itemListElements = this.props.itemList.map((item) => {
            const removeItem = () => {
                this.props.removeItem(item._id).then(() => {
                    this.props.fetchItemList();
                }).catch((err) => {
                    console.log(err);
                    alert('アイテムの削除に失敗');
                });
            };

            return (
                <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{moment(item.expirationDate).format("YYYY/MM/DD")}</td>
                    <td>{moment(item.expirationDate, "YYYY/MM/DD").fromNow()}</td>
                    <td>
                        <Glyphicon
                            className='text-danger'
                            glyph="glyphicon glyphicon-remove-sign"
                            onClick={removeItem}
                        />
                    </td>
                </tr>
            )
        });
        return (
            <Table>
                <thead>
                <tr>
                    <th>品名</th>
                    <th>期限</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>

                <tbody>
                {itemListElements}
                </tbody>
            </Table>
        );
    }
}

ReactDom.render(<App/>, document.getElementById('app'));
