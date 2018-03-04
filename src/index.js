import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { withStyles } from 'material-ui/styles';

import EditBirthdayDialog from './EditBirthdayDialog'
import RemoveBirthdayDialog from './RemoveBirthdayDialog'
import BirthdayItem from './BirthdayItem'
import AppBar from 'material-ui/AppBar';
import MenuIcon from 'material-ui-icons/Menu';
import PersonIcon from 'material-ui-icons/Person';
import ScheduleIcon from 'material-ui-icons/Schedule';
import { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import 'typeface-roboto'
import registerServiceWorker from './registerServiceWorker';
import List from 'material-ui/List';
import Drawer from 'material-ui/Drawer';  
import ListSubheader from 'material-ui/List/ListSubheader';
const styles = {
    root: {
      width: '100%',
    },
    flex: {
      flex: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
  };

class Birthdays extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            isLoaded: false,
            editingItem: null,
            removingItem: null,
            drawerOpen: false,
            sortBy: "next",
            user: "",
            password: "",
            items: []
        }

        // Because JavaScript        
        this.addClicked = this.addClicked.bind(this);
        this.editClicked = this.editClicked.bind(this);
        this.removeClicked = this.removeClicked.bind(this);
        this.loadData = this.loadData.bind(this);
        this.editDialogFinished = this.editDialogFinished.bind(this);
        this.removeDialogFinished = this.removeDialogFinished.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);

        this.loginClicked = this.loginClicked.bind(this);
        this.userTextChanged = this.userTextChanged.bind(this);
        this.passwordTextChanged = this.passwordTextChanged.bind(this);                

        this.sortByName = this.sortByName.bind(this);                
        this.sortByBirthday = this.sortByBirthday.bind(this);                
    
    }

    toggleDrawer() {
        this.setState({
            drawerOpen: !this.state.drawerOpen
        });        
    }

    sortByName() {
        this.setState({
            sortBy: "title"
        });
        
        this.toggleDrawer();
        this.loadData("title");

        // TODO Ponder how to get state into the render, or perhaps when loadData actually happens as wel have to
        // load data wtice here.
    }

    sortByBirthday() {
        this.setState({
            sortBy: "next"
        });
        
        this.toggleDrawer();
        this.loadData("next");
    }

    loginClicked() {
        fetch("api/login?user_id=" + this.state.user + "&password=" + this.state.password,
            { credentials: 'same-origin' }
        )
        .then((result) => { 
            let newState = { };
            Object.assign(newState, this.state);
            newState.isLoggedIn=true;
            this.setState(newState);
            this.loadData(this.state.sortBy);
        });
        
    }

    componentDidMount() {
        this.loadData(this.state.sortBy);
    }

    loadData(sortBy) {
        fetch("api/birthdays?sort=" + sortBy, { credentials: 'include' })
            .then( response => { 
                if (response.status === 401) {
                    this.setState({
                        isLoggedIn: false,
                        isLoaded: false,
                        items: []
                    });
                } else {
                    response.json().then( (data) => { 
                        this.setState({
                            isLoggedIn: true,
                            isLoaded: true,
                            items: data
                        });
                    });                    
                }
            })
            .catch( (err) => { 
                alert('oh no, something bad happened:' + err)
            });
    }


    handleClickOpen = () => {
        this.setState({ open: true });
    };

    addClicked() {
        let newState = { };
        Object.assign(newState, this.state);
        newState.editingItem = {
            id: 0,
            title: "",
            year: "",
            month: "",
            day: ""
        };
        this.setState(newState);

    }

    editClicked(item) {
        this.setState({
            editingItem: item
        });
    }

    removeClicked(item) {
        this.setState({
            removingItem: item
        });
    }

    editDialogFinished() {
        this.setState({
            editingItem: null
        });
        
        this.loadData(this.state.sortBy);
    }

    removeDialogFinished() {
        this.setState({
            removingItem: null
        });

        this.loadData(this.state.sortBy);
    }

    userTextChanged(e) {
        let newState = { };
        Object.assign(newState, this.state);
        newState.user = e.target.value;
        this.setState(newState);
    }

    passwordTextChanged(e) {
        let newState = { };
        Object.assign(newState, this.state);
        newState.password = e.target.value;
        this.setState(newState);
    }

    render() {
        if (!this.state.isLoggedIn) {
            return (<div>
            <p>User:<input type="text" value={this.state.user} onChange={this.userTextChanged} /></p>
            <p>Password:<input type="password" value={this.state.password} onChange={this.passwordTextChanged} /></p>
            <p><button onClick={this.loginClicked}>Login</button></p>
            </div>);
        } else if (this.state.isLoaded) {
            return (
                <div className={this.props.classes.root}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton className={this.props.classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer}>
                                <MenuIcon />
                            </IconButton>

                            <Typography type="title" color="inherit" className={this.props.classes.flex}>
                                Birthdays
                            </Typography>
                            
                            <Button color="inherit" onClick={this.addClicked}>Add</Button>
                        </Toolbar>
                    </AppBar>
                    <Drawer open={this.state.drawerOpen}>
                            <div
                                tabIndex={0}
                                role="button"
                            >
                                <List subheader={<ListSubheader>Sorting</ListSubheader>}>
                                    <ListItem button onClick={this.sortByBirthday}>
                                        <ListItemIcon>
                                            <ScheduleIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Sort by birthday" />
                                    </ListItem>
                                    <ListItem button  onClick={this.sortByName}>
                                        <ListItemIcon>
                                            <PersonIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Sort by name" />
                                    </ListItem>
                                </List>
                            </div>
                    </Drawer>
                    <List>
                        {this.state.items.map(item => 
                            (<BirthdayItem key={item.id} item={item} editClicked={this.editClicked} removeClicked={this.removeClicked}/>)
                        )}                    
                    </List>
                    { this.state.editingItem != null && 
                        <EditBirthdayDialog item={this.state.editingItem} onDialogFinished={this.editDialogFinished} />
                    }
                    { this.state.removingItem != null &&
                        <RemoveBirthdayDialog item={this.state.removingItem} onDialogFinished={this.removeDialogFinished} />
                    }
                </div>
            )
        } else {
            return (<p>Loading</p>)
        }

    }
}

let StyledBirthdays = withStyles(styles)(Birthdays)

ReactDOM.render(<StyledBirthdays />, document.getElementById('root'));
registerServiceWorker();

