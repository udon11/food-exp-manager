import React from 'react'
import {Navbar, Nav, NavItem, Glyphicon} from 'react-bootstrap';
import ItemAddModal from './ItemAddModal';

export default class NavigationBar extends React.Component {
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
