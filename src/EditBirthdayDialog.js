import React from 'react';
import {Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
  } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { captureException } from '@sentry/browser';
  
class EditBirthdayDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            id: props.item.id,
            title: props.item.title,
            year: props.item.year,
            month: props.item.month,
            months: [],
            day: props.item.day,
            days: []            
        }
        
        // Because JavaScript
        this.cancelClicked = this.cancelClicked.bind(this);
        this.addClicked = this.addClicked.bind(this);
        this.titleTextChanged = this.titleTextChanged.bind(this);
        this.yearTextChanged = this.yearTextChanged.bind(this);
        this.monthTextChanged = this.monthTextChanged.bind(this);
        this.dayTextChanged = this.dayTextChanged.bind(this);
        this.loadDays = this.loadDays.bind(this)
    }

    makeBirthdayJson(mth) {
        return {
            id: this.state.id,
            title: this.state.title,
            year: this.state.year,
            month: mth,
            day: this.state.day
        }
    }


    loadDays(mth) {
        //ok, this isn't working, the setState isn't updated yet.
        //alert(this.state.month);
        fetch("api/birthdays/day/list", { 
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            
            body: JSON.stringify(this.makeBirthdayJson(mth))
        })
        .then( response => response.json() )
        .then( response => { 
            this.setState({
                days: response
            });                
        })
        .catch( (err) => { 
            captureException(err);
        });
    }


    
    componentDidMount() {
        this.loadDays(this.state.month);

        fetch("api/birthdays/month/list", { credentials: 'include' })
            .then( response => response.json() )
            .then( response => { 
                this.setState({
                    months: response
                });                
            })
            .catch( (err) => { 
                captureException(err);
            });
    }

    


    addClicked() {
        fetch("api/birthdays/" + this.state.id, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
                id: this.state.id,
                title: this.state.title,
                year: this.state.year,
                month: this.state.month,
                day: this.state.day
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
                captureException(error);

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
        var mth = "" + e.target.value;

        // TODO at some point should adjust this, this isnt' json., its an obecjt.
        var json = this.makeBirthdayJson(mth)

        fetch("api/birthdays/month/set", {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(json)
        })        
        .then( response => response.json() )
        .then( (result) => {
                this.setState(result);
                this.loadDays(mth);
            },
            (error) => {
                captureException(error);
            }
        )
    }

    dayTextChanged(e) {
        let newState = { };
        Object.assign(newState, this.state);
        newState.day = e.target.value;
        this.setState(newState);
    }

    render()  {
        return (<Dialog open={true} onClose={this.newDialogCanceled}>
                    <DialogTitle>New Birthday</DialogTitle>
                    <DialogContent>
                        <TextField
                            id="title"
                            label="Title"
                            required={true}
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
                            select={true}
                            id="month"
                            label="Month"
                            required={true}
                            value={this.state.month}
                            onChange={this.monthTextChanged}
                        >
                                {this.state.months.map(option => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                ))}
                            
                        </TextField>                        
                    </DialogContent>
                    <DialogContent>
                        <TextField
                            select={true}
                            id="day"
                            label="Day"
                            required={true}
                            value={this.state.day}
                            onChange={this.dayTextChanged}
                        >
                            {this.state.days.map(option => (
                                <MenuItem key={option} value={option}>
                                {option}
                                </MenuItem>
                            ))}
                        </TextField>
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