import React from 'react';
import ReactDom from 'react-dom';
import Request from 'superagent';
import moment from 'moment-timezone';

import NavigationBar from './component/NavigationBar';
import ItemList from './component/ItemList';

moment.tz.setDefault('Asia/Tokyo');
moment.locale('ja', {
    months: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: "日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split('_'),
    weekdaysShort: '日_月_火_水_木_金_土'.split('_'),
    weekdaysMin: '日_月_火_水_木_金_土'.split('_')
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
