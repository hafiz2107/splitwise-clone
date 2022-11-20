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
  import { lookUpUsers } from "../../services/lookup";
import axios from "axios";
import { ToastError, ToastSuccess } from "../../common/functions";
  
  export default function AddFriendsManager({ handleDialogueStatus }) {
    const { control, handleSubmit, setValue } = useForm();
    const [friends,setFriends] =useState([])
    const userId = localStorage.getItem('_id')
    useEffect(()=>{
      lookUpUsers(userId).then((result)=>{
        if(result.length > 0){
          setFriends(result)
        }else{
          ToastError("No Users Found")
        }
      })
    },[])
  
    const onSubmit = (data) => {
      const payload = {
        userId : userId,
        friendsList: data.friendsList
      }
  
      axios.post(`${process.env.REACT_APP_API_URL}/add-friends`,payload).then((response)=>{
        handleDialogueStatus(false)
        if(response.data.status === 200 && response.data.success){
          ToastSuccess("Succesfully added friends")
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
          <DialogTitle id="alert-dialog-title">Add Friends</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <AutoCompleteInput
                name={"friendsList"}
                id={"friendsList"}
                control={control}
                options={friends}
                label={"Add Friends"}
                onChangeSelection={onChangeSelection}
                singleInput={false}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleDialogueStatus(false)}>
                Cancel
              </Button>
              <Button type="submit" autoFocus>
                Add Friends
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </>
    );
  }
  