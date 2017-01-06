import React from 'react'
import {Table, Glyphicon} from 'react-bootstrap';
import moment from 'moment-timezone'
import DatePicker from 'react-datepicker';

export default class ItemList extends React.Component {
    render() {
        if (this.props.itemList.length === 0) {
            return <div></div>;
        }

        const itemListElements = this.props.itemList.map((item) => {
            // 更新処理
            const updateItem = (expirationDate) => {
                this.props.updateItem(item._id, expirationDate.unix()).then(() => {
                    this.props.fetchItemList();
                }).catch((err) => {
                    console.log(err);
                    alert('アイテムの更新に失敗');
                });
            };

            // 削除処理
            const removeItem = () => {
                this.props.removeItem(item._id).then(() => {
                    this.props.fetchItemList();
                }).catch((err) => {
                    console.log(err);
                    alert('アイテムの削除に失敗');
                });
            };

            // 日付の差分表示
            const expirationDateObj = moment.unix(item.expirationDate);
            const expirationDateDiff = expirationDateObj.diff(moment(moment().format("YYYY/MM/DD"), "YYYY/MM/DD"), "days");
            const expirationMonthDiff = expirationDateObj.diff(moment(moment().format("YYYY/MM/DD"), "YYYY/MM/DD"), "month");
            let expirationDateDiffDom = null;
            if (expirationDateDiff < 0) {
                expirationDateDiffDom =
                    <td className="text-danger">
                        {Math.abs(expirationDateDiff) + '日前'}
                    </td>;
            } else {
                expirationDateDiffDom =
                    <td>
                        {expirationMonthDiff > 0 ? expirationMonthDiff + 'ヵ月後' : expirationDateDiff + '日後'}
                    </td>;
            }

            return (
                <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>
                        <DatePicker
                            dateFormat="YYYY/MM/DD"
                            selected={expirationDateObj}
                            onChange={updateItem}
                        />
                    </td>
                    {expirationDateDiffDom}
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
                    <th style={{width: '37%'}}>品名</th>
                    <th style={{width: '32%'}}>期限</th>
                    <th style={{width: '23%'}}>残り</th>
                    <th style={{width: '8%'}}>Del</th>
                </tr>
                </thead>

                <tbody>
                {itemListElements}
                </tbody>
            </Table>
        );
    }
}
