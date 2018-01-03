import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { withStyles } from 'material-ui/styles';

import Birthday from './Birthday'
import AppBar from 'material-ui/AppBar';
import MenuIcon from 'material-ui-icons/Menu';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import 'typeface-roboto'
import registerServiceWorker from './registerServiceWorker';
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import MoreHoriz from 'material-ui-icons/MoreHoriz';
  
  
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
            adding: false,
            user: "",
            password: "",
            items: []
        }

        // Because JavaScript        
        this.addClicked = this.addClicked.bind(this);
        this.loadData = this.loadData.bind(this);
        this.addDialogFinished = this.addDialogFinished.bind(this);

        this.loginClicked = this.loginClicked.bind(this);
        this.userTextChanged = this.userTextChanged.bind(this);
        this.passwordTextChanged = this.passwordTextChanged.bind(this);                
    
    }

    loginClicked() {
        fetch("/api/login?user_id=" + this.state.user + "&password=" + this.state.password,
            { credentials: 'same-origin' }
        )
        .then((result) => { 
            let newState = { };
            Object.assign(newState, this.state);
            newState.isLoggedIn=true;
            this.setState(newState);
        });
        
    }



    componentDidMount() {
        this.loadData();
    }

    loadData() {
        fetch("/api/birthdays", { credentials: 'include' })
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
        newState.adding = true;
        this.setState(newState);

    }

    addDialogFinished() {
        let newState = { };
        Object.assign(newState, this.state);
        newState.adding = false;
        this.setState(newState);

        this.loadData();
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
                            <IconButton className={this.props.classes.menuButton} color="contrast" aria-label="Menu">
                                <MenuIcon />
                            </IconButton>

                            <Typography type="title" color="inherit" className={this.props.classes.flex}>
                                Birthdays
                            </Typography>
                            
                            <Button color="contrast" onClick={this.addClicked}>Add</Button>
                        </Toolbar>
                    </AppBar>
                    <List>
                        {this.state.items.map(item => (
                            <ListItem key={item.id}>
                                <ListItemText insetChildren={true} 
                                    primary={item.title} 
                                    secondary={item.year + "/" + item.month + "/" + item.day} />
                                <ListItemSecondaryAction>
                                    <IconButton aria-label="Comments">
                                        <MoreHoriz />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}                    
                    </List>
                    { this.state.adding && 
                        <Birthday onDialogFinished={this.addDialogFinished} />
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

