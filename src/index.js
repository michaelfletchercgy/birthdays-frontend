import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import Birthday from './Birthday'
import registerServiceWorker from './registerServiceWorker';

class Birthdays extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            isLoaded: false,
            isEditable: false,
            isAdding: false,
            user: "",
            password: "",
            items: []
        }

        // Because JavaScript        
        this.addClicked = this.addClicked.bind(this);
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
        fetch("/api/birthdays", { credentials: 'include' })
            .then( response => { 
                if (response.status === 401) {
                    this.setState({
                        isLoggedIn: false,
                        isLoaded: false,
                        isEditable: false,
                        isAdding: false,
                        items: []
                    });
                } else {
                    response.json().then( (data) => { 
                        this.setState({
                            isLoggedIn: true,
                            isLoaded: true,
                            isEditable: false,
                            isAdding: false,
                            items: data
                        });
                    });                    
                }
            })
            .catch( (err) => { 
                alert('oh no, something bad happened:' + err)
            });
    }

    addClicked() {
        let items =this.state.items;
        items.push({ id: 0, title:""});
        this.setState({
            isLoaded: true,
            isEditable: false,
            items: items
        })
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
                <div>
                
                <table>
                    <thead>
                        <tr>
                            <td></td>
                            <td>Title</td>
                            <td>Year</td>
                            <td>Month</td>
                            <td>Day</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.items.map(item => (
                            <Birthday key={item.id} item={item} />
                        ))}
                    </tbody>
                </table>

                <button onClick={this.addClicked}>Add</button>

                </div>
            )
        } else {
            return (<p>Loading</p>)
        }

    }
}

ReactDOM.render(<Birthdays />, document.getElementById('root'));
registerServiceWorker();
