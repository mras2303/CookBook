import React, { Component } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from 'react-select'
import { API_GET_INGREDIENTS } from '../../../api';
import { Container, FullContainer, Label } from './style'
import { ADD_NEW_INGREDIENT, NAME, CHOOSE_SOME_INGREDIENTS } from '../../../texts';

const ButtonStyle = {
    padding: '5px',
    fontWeight: 'bold',
    color: 'white'
}

class IngredientsSelect extends Component{
    state = {
        selectedOption: null,
        options: [],
        open: false,
        name: ''
    }

    handleClickOpen = () => this.setState({ open: true })
    handleClose = () => this.setState({ open: false })
    changeIngredient = e => this.setState({ name: e.target.value })
    addNewIngredient = () => {
        this.setState({ open: false });
        const { name, options, selectedOption } = this.state
        axios
        .post(API_GET_INGREDIENTS, {name})
        .then(({ data }) => {
            data.value = data.id; 
            data.label = data.name
            this.setState({ options: options ? [...options, data] : data })
            this.setState({ selectedOption: selectedOption ? [ ...selectedOption, data ] : data })
        })
        .catch(error => {
            console.log(error)
        })
    }
    
    componentDidMount(){
        axios
        .get(API_GET_INGREDIENTS)
        .then(({ data }) => {
            const options = data.map(d => { d.value = d.id; d.label = d.name; return d })
            this.setState({ options })
        })
        .catch(error => {
            console.log(error)
        })
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
        const ingredients = selectedOption.map(option => option.value)
        this.props.onChangeValue(ingredients)
    }
    
    render(){
        const { selectedOption, options, open } = this.state;
        return (
            <FullContainer>
                <ToastContainer autoClose={1000} position={toast.POSITION.TOP_CENTER} />
                <Label>{CHOOSE_SOME_INGREDIENTS}</Label>
                <Container>
                    <Select value={selectedOption} onChange={this.handleChange} options={options} isMulti/>
                    <div>
                        <Button style={ButtonStyle} onClick={this.handleClickOpen}>+</Button>
                        <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">{ADD_NEW_INGREDIENT}</DialogTitle>
                            <DialogContent>
                                <TextField onChange={this.changeIngredient} autoFocus margin="dense" id="name" label={NAME} type="text" fullWidth/>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">Cancel</Button>
                                <Button onClick={this.addNewIngredient} color="primary">Add</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Container>
            </FullContainer>
        )
    }
}

export default IngredientsSelect