import React from 'react';
import ReactDom from 'react-dom';
import Request from 'superagent';
import moment from 'moment-timezone';

import NavigationBar from './component/NavigationBar';
import ItemList from './component/ItemList';

moment.tz.setDefault('Asia/Tokyo');

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
     *
     * @param name Item name
     * @param type Item type
     * @param expirationDate moment object
     * @returns {Promise}
     */
    addItem(name, type, expirationDate) {
        return new Promise((resolve, reject) => {
            const query = {
                name: name,
                type: type,
                expirationDate: expirationDate.unix()
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
     * アイテムの更新
     */
    updateItem(id, expirationDate) {
        console.log(expirationDate);
        return new Promise((resolve, reject) => {
            const query = {
                id: id,
                expirationDate: expirationDate
            };
            Request
                .get('/ajax/item/update')
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
                    updateItem={this.updateItem}
                    removeItem={this.removeItem}
                    fetchItemList={this.fetchItemList}
                />
            </div>
        )
    }
}

ReactDom.render(<App/>, document.getElementById('app'));
