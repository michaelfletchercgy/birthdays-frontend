import React from 'react';


class Birthday extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditable: props.item.id === 0,
            id: props.item.id,
            title: props.item.title,
            year: props.item.year == null ? "" : props.item.year,
            month: props.item.month,
            day: props.item.day
        }
        
        // Because JavaScript
        this.editClicked = this.editClicked.bind(this);
        this.saveClicked = this.saveClicked.bind(this);
        this.titleTextChanged = this.titleTextChanged.bind(this);
        this.yearTextChanged = this.yearTextChanged.bind(this);
        this.monthTextChanged = this.monthTextChanged.bind(this);
        this.dayTextChanged = this.dayTextChanged.bind(this);
    }

    editClicked() {
        let newState = { };
        Object.assign(newState, this.state);
        newState.isEditable = true;
        this.setState(newState);
    }

    saveClicked() {
        fetch("/api/birthdays/" + this.state.id, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                id: this.state.id,
                title: this.state.title,
                year: this.state.year === "" ? null : Number(this.state.year),
                month: Number(this.state.month),
                day: Number(this.state.day)
            })
        })        
        .then( response => response.json() )
        .then( 
            (result) => {
                this.setState({
                    isEditable: false,
                    id: result.id,
                    title: result.title,
                    year: result.year == null ? "" : result.year,
                    month: result.month,
                    day: result.day
                })
            },
            (error) => {
                alert('boom:' + error);
            }
        )
    }

    titleTextChanged(e) {
        let newState = { };
        Object.assign(newState, this.state);
        newState.title = e.target.value;
        this.setState(newState);
    }

    yearTextChanged(e) {
        let newState = { };
        Object.assign(newState, this.state);
        newState.year = e.target.value;
        this.setState(newState);
    }

    monthTextChanged(e) {
        let newState = { };
        Object.assign(newState, this.state);
        newState.month = e.target.value;
        this.setState(newState);
    }

    dayTextChanged(e) {
        let newState = { };
        Object.assign(newState, this.state);
        newState.day = e.target.value;
        this.setState(newState);
    }

    render()  {
        if (this.state.isEditable) {
            return (
                <tr>
                    <td>{this.state.id}</td>
                    <td><input type="text" value={this.state.title} onChange={this.titleTextChanged} /></td>
                    <td><input type="text" value={this.state.year} onChange={this.yearTextChanged} /></td>
                    <td><input type="text" value={this.state.month} onChange={this.monthTextChanged} /></td>
                    <td><input type="text" value={this.state.day} onChange={this.dayTextChanged} /></td>
                    <td><button onClick={this.saveClicked}>Save</button></td>
                </tr>
            )
        } else {
            return (
                <tr>
                    <td>{this.state.id}</td>
                    <td>{this.state.title}</td>
                    <td>{this.state.year}</td>
                    <td>{this.state.month}</td>
                    <td>{this.state.day}</td>
                    <td><button onClick={this.editClicked}>Edit</button></td>
                </tr>
            )
        }
    }


}

export default Birthday;