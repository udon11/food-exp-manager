import React from 'react';
import ReactDom from 'react-dom';
import {
    Navbar,
    Nav,
    NavItem,
    Button,
    Glyphicon,
    Modal,
    Table,
    FormGroup,
    FormControl,
    ControlLabel
} from 'react-bootstrap';
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
    }

    componentDidMount() {
        this.fetchItemList();
    }

    fetchItemList() {
        Request
            .get('/ajax/get')
            .end((err, res)=> {
                if (err) {
                    console.error(err);
                    return;
                }
                if (!res || !res.text || res.text === '') {
                    return;
                }
                const jsonResponse = JSON.parse(res.text);
                this.setState({itemList: jsonResponse.itemList});
            });
    }

    addItem(name, expirationDate) {
        return new Promise((resolve, reject) => {
            const query = {
                name: name,
                expirationDate: expirationDate
            };

            Request
                .get('/ajax/addItem')
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
                />

                <ItemList
                    {...this.state}
                />
            </div>
        )
    }
}

class NavigationBar extends React.Component {
    render() {
        return (
            <Navbar fixedTop fluid>
                <Navbar.Brand>FoodExpManager</Navbar.Brand>

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
            expirationDate: ''
        }
    }

    render() {
        const close = () => {
            this.props.close();
        };
        const changeName = (e) => {
            this.setState({name: e.target.value});
        };
        const changeExpiratioDate = (e) => {
            this.setState({expirationDate: e.target.value});
        };
        const addItem = () => {
            this.props.addItem(this.state.name, this.state.expirationDate).then(() => {
                close();
                this.setState(
                    {
                        name: '',
                        expirationDate: ''
                    }
                );
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
                        <FormGroup>
                            <ControlLabel>賞味(消費)期限</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="賞味(消費)期限を入力"
                                value={this.state.expirationDate}
                                onChange={changeExpiratioDate}
                            />
                        </FormGroup>
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
        const itemListElements = this.props.itemList.map((item, i) => {
            return (
                <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.expirationDate}</td>
                    <td>{moment(item.expirationDate, "YYYY/MM/DD").fromNow()}</td>
                </tr>
            )
        });
        return (
            <div className='container-fuluid'>
                <Table fluid>
                    <thead>
                    <tr>
                        <th>品名</th>
                        <th>期限</th>
                        <th></th>
                    </tr>
                    </thead>

                    <tbody>
                    {itemListElements}
                    </tbody>
                </Table>
            </div>
        );
    }
}

ReactDom.render(<App/>, document.getElementById('app'));
