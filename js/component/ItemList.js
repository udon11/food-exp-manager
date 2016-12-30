import React from 'react'
import {Table, Glyphicon} from 'react-bootstrap';
import moment from 'moment-timezone'

export default class ItemList extends React.Component {
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

            // 日付の差分
            const expirationDateObj = moment.unix(item.expirationDate);
            let expirationDateDiff = null;
            if (expirationDateObj.diff(moment(), "days") < 0) {
                expirationDateDiff = <td className="text-danger">
                    {Math.abs(expirationDateObj.diff(moment(), "days")) + '日前'}
                </td>;
            } else {
                expirationDateDiff = <td>
                    {expirationDateObj.diff(moment(), "days") + '日後'}
                </td>;
            }

            return (
                <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{expirationDateObj.format("YYYY/MM/DD")}</td>
                    {expirationDateDiff}
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
