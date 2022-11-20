import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
  } from "@mui/material";
  import AutoCompleteInput from "../shared/AutoCompleteInput";
  import { useForm } from "react-hook-form";
  import { useState } from "react";
  import { useEffect } from "react";
  import { lookUpFriend } from "../../services/lookup";
import axios from "axios";
import { FormatDate, ToastError, ToastSuccess } from "../../common/functions";
import InputField from "../shared/InputField";
  
  export default function IndividualExpenseManager({ handleDialogueStatus }) {
    const { control, handleSubmit, setValue,register } = useForm();

    const [friends,setFriends] =useState([])
    const userId = localStorage.getItem('_id')
    useEffect(()=>{
      lookUpFriend(userId).then((result)=>{
        if(result.length > 0){
          setFriends(result)
        }else{
          ToastError("Please add some friends to continue")
        }
      })
    },[])
  
    const onSubmit = (data) => {
      const payload = {
        createdBy : localStorage.getItem('_id'),
        amount : data.expense,
        sharedWith:[data.friendsList],
        createdDate:FormatDate(new Date()),
        totalShares:1,
        expenseName:data.expenseName,
        createdByUsername:localStorage.getItem('username'),
        type:"Individual"
      }
      axios.post(`${process.env.REACT_APP_API_URL}/add-individual-expenses`,payload).then((response)=>{
        handleDialogueStatus(false)
        if(response.data.status === 200 && response.data.success){
          ToastSuccess("Succesfully added Expenses")
        }else if(!response.data.success){
          ToastError(response.data.message)
        }
      }).catch((err)=>{
        ToastError("Something Went wrong")
      })
    };
    const onChangeSelection = (value, name) => {
      setValue(name, value);
    };
    return (
      friends && <>
        <Dialog
          open={true}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Individual Expenses</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
            <InputField
              name={"expenseName"}
              id={"expenseName"}
              required={true}
              title={"Expense Label"}
              type={"text"}
              register={register}
            />
            <InputField
              name={"expense"}
              id={"expense"}
              required={true}
              title={"Expense Amount"}
              type={"text"}
              register={register}
              classname="mt-2"
            />
              <AutoCompleteInput
                name={"friendsList"}
                id={"friendsList"}
                control={control}
                options={friends}
                label={"Add Friends to Share"}
                onChangeSelection={onChangeSelection}
                singleInput={true}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleDialogueStatus(false)}>
                Cancel
              </Button>
              <Button type="submit" autoFocus>
                Add Expense
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </>
    );
  }
  