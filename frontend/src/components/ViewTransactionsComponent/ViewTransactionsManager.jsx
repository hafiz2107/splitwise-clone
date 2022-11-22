import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import { ToastError} from "../../common/functions";
import Accordions from '../shared/Accordions'
import { useState } from "react";

export default function ViewTransactionsManager({
  handleDialogueStatus,
  transactionId,
}) {
    const [data,setData] = useState([])
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/get-transactions?id=${transactionId}`
      )
      .then((response) => {
        if (response.data.success) {
            if(response.data.status === 204){
                setData([])
                ToastError("No data found");
            }else{
                setData(response.data.data)
            }
        } else if (!response.data.success) {
          ToastError(response.data.message);
        }
      })
      .catch((err) => {
        ToastError("Something Went wrong");
      });
  }, []);


  return (
    <>
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={'xl'}
      >
        <DialogTitle id="alert-dialog-title">
          Transactions
        </DialogTitle>
        <DialogContent>
            {
                data.length > 0 && data.map((eachData)=>{
                    return (<Accordions 
                        data={eachData}
                    />)
                })
            }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogueStatus(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
