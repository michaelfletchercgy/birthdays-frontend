import React from 'react';

import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import MoreHoriz from 'material-ui-icons/MoreHoriz';

import { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';


class BirthdayItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            anchor: null
        }
    }

    openMenu = event => {
        this.setState({
            open: true,
            anchor: event.currentTarget
        });
    }

    closeMenu = event => {
        this.setState({
            open: false,
            anchor: null
        });
    }

    editClicked = event => { 
        this.props.editClicked(this.props.item);
        this.closeMenu();
    }

    removeClicked = event => { 
        this.props.removeClicked(this.props.item);
        this.closeMenu();
    }

    render() {
        return (
            <ListItem key={this.props.item.id}>
                <ListItemText insetChildren={true} 
                        primary={this.props.item.title} 
                        secondary={this.props.item.year + "/" + this.props.item.month + "/" + this.props.item.day} />
                <ListItemSecondaryAction>
                    <IconButton aria-label="Comments" onClick={this.openMenu}>
                        <MoreHoriz />
                    </IconButton>
                    <Menu open={this.state.open}
                          onClose={this.closeMenu}
                          anchorEl={this.state.anchor}>
                        <MenuItem onClick={this.editClicked}>Edit</MenuItem>
                        <MenuItem onClick={this.removeClicked}>Remove</MenuItem>
                    </Menu>
                </ListItemSecondaryAction>    
            </ListItem>
        )
    }
}

export default BirthdayItem;