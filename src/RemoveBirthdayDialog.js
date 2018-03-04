import React from 'react';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
  
class RemoveBirthdayDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.item.id,
            title: props.item.title
        }
        
        // Because JavaScript
        this.cancelClicked = this.cancelClicked.bind(this);
        this.removeClicked = this.removeClicked.bind(this);
    }

    removeClicked() {
        fetch("api/birthdays/" + this.state.id, {
            method: 'DELETE',
            credentials: 'same-origin',            
        })        
        .then( 
            (result) => {
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

    render()  {
        return (<Dialog open="true" onClose={this.cancelClicked}>
                    <DialogTitle>Remove Birthday?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Remove birthday titled {this.state.title}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.cancelClicked} color="primary">
                            No
                        </Button>
                        <Button onClick={this.removeClicked} color="primary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>)
    }


}

export default RemoveBirthdayDialog;