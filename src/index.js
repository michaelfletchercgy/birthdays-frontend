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
            isLoaded: false,
            isEditable: false,
            isAdding: false,
            items: []
        }
        this.addClicked = this.addClicked.bind(this);
    }

    componentDidMount() {
        fetch("/api/birthdays", { credentials: 'same-origin' })
            .then( response => response.json() )
            .then( 
                (result) => {
                    this.setState({
                        isLoaded: true,
                        isEditable: false,
                        isAdding: false,
                        items: result
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        isEditable: false,
                        isAdding: false,
                        items: []
                    });
                }
            )
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
    


    render() {
        
        if (this.state.isLoaded) {
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
