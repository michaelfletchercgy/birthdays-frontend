import React from 'react';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
  } from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
  
class EditBirthdayDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            id: props.item.id,
            title: props.item.title,
            year: props.item.year,
            month: props.item.month,
            day: props.item.day
        }
        
        // Because JavaScript
        this.cancelClicked = this.cancelClicked.bind(this);
        this.addClicked = this.addClicked.bind(this);
        this.titleTextChanged = this.titleTextChanged.bind(this);
        this.yearTextChanged = this.yearTextChanged.bind(this);
        this.monthTextChanged = this.monthTextChanged.bind(this);
        this.dayTextChanged = this.dayTextChanged.bind(this);
    }

    addClicked() {
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
                });
                this.props.onDialogFinished();
            },
            (error) => {
                alert('boom:' + error);
            }
        )
    }

    cancelClicked() {
        this.props.onDialogFinished();
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
        return (<Dialog open="true" onClose={this.newDialogCanceled}>
                    <DialogTitle>New Birthday</DialogTitle>
                    <DialogContent>
                        <TextField
                            id="title"
                            label="Title"
                            required="true"
                            value={this.state.title}
                            onChange={this.titleTextChanged}
                            />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            id="year"
                            label="Year"
                            value={this.state.year}
                            onChange={this.yearTextChanged}
                            />
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            id="month"
                            label="Month"
                            required="true"
                            value={this.state.month}
                            onChange={this.monthTextChanged}
                            />
                    </DialogContent>                            
                    <DialogContent>
                        <TextField
                            id="day"
                            label="Day"
                            required="true"
                            value={this.state.day}
                            onChange={this.dayTextChanged}
                            />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.cancelClicked} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.addClicked} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>)
    }


}

export default EditBirthdayDialog;