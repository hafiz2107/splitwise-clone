import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import InputField from "../shared/InputField";
import AutoCompleteInput from "../shared/AutoCompleteInput";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react";
import { lookUpFriend } from "../../services/lookup";
import { FormatDate, ToastError, ToastSuccess } from "../../common/functions";
import axios from "axios";

export default function CreateGroupManager({ handleDialogueStatus }) {
  const { control, handleSubmit, register, setValue } = useForm();
  const [friends, setFriends] = useState([]);
  const userId = localStorage.getItem("_id");
  useEffect(() => {
    lookUpFriend(userId).then((result) => {
      if(result.length > 0){
        setFriends(result);
      }else{
        ToastError("Please add some friends to continue")
      }
    });
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        createdBy: localStorage.getItem("_id"),
        amount: data.totalExpense,
        sharedWith: data.friends,
        createdDate: FormatDate(new Date()),
        totalShares: data.friends.length,
        expenseName: data.groupname,
        createdByUsername: localStorage.getItem("username"),
        type:"Group"
      };
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/add-group-expenses`,
          payload
        )
        .then((response) => {
          handleDialogueStatus(false);
          if (response.data.status === 200 && response.data.success) {
            ToastSuccess("Succesfully added Group Expenses");
          } else if (!response.data.success) {
            ToastError(response.data.message);
          }
        })
        .catch((err) => {
          ToastError("Something Went wrong");
        });
    } catch (err) {
      ToastError("Something went wrong");
    }
  };
  const onChangeSelection = (value, name) => {
    setValue(name, value);
  };
  return (
    <>
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Create Groups</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <InputField
              name={"groupname"}
              id={"groupname"}
              required={true}
              title={"Group Name"}
              type={"text"}
              register={register}
            />
            <InputField
              name={"totalExpense"}
              id={"totalExpense"}
              required={true}
              title={"Total Expense"}
              type={"text"}
              register={register}
            />
            <AutoCompleteInput
              name={"friends"}
              id={"friends"}
              control={control}
              options={friends}
              label={"Add Friends"}
              onChangeSelection={onChangeSelection}
            />
            {/* <Button type="submit">Submit</Button> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogueStatus(false)}>Cancel</Button>
            <Button type="submit" autoFocus>
              Create Group
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
