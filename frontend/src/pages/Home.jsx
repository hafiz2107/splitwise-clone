import { Container, Stack, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import CreateGroupManager from "../components/CreateGroupComponent/CreateGroupManager";
import AddFriendsManager from "../components/AddFriendsComponent/AddFriendsComponent";
import IndividualExpenseManager from "../components/AddExpenseComponent/AddIndividualExpenses";
import { useEffect } from "react";
import axios from "axios";
import { ToastError } from "../common/functions";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Home() {
  const [createGroup, setCreateGroup] = useState(false);
  const [addExpense, setAddExpense] = useState(false);
  const [friends, setAddFriends] = useState(false);
  const [data, setData] = useState({});
  const navigation = useNavigate();
  useEffect(() => {
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }/get-dashboard?userId=${localStorage.getItem("_id")}`
      )
      .then((result) => {
        if (result.data.status === 200 && result.data.success) {
          let row = [];
          result.data.data.map((eachData, i) => {
            return eachData.friends.map((eachFriend, i) => {
              return row.push({
                id: eachFriend["_id"] + Math.random(),
                transactionName: eachFriend.expenseName,
                message:
                  eachData.type === "Individual"
                    ? localStorage.getItem("_id") ===
                        eachFriend["userId"].toString() && eachFriend.toGive
                      ? `You owe ${eachFriend.amountToPay} to ${eachData.createdByUsername}`
                      : `${eachFriend.username} owes you ${eachFriend.amountToPay}`
                    : localStorage.getItem("_id") ===
                      eachData["createdBy"].toString()
                    ? `${eachFriend.username} owes you ${eachFriend.amountToPay}`
                    : `${
                        eachFriend.username === localStorage.getItem("username")
                          ? "You"
                          : eachFriend.username
                      } Owes ${eachFriend.amountToPay} to ${
                        eachData.createdByUsername
                      }`,
                date: eachData.createdDate,
                type: eachData.type,
              });
            });
          });
          setData(row);
        } else {
          ToastError("Unautherised Access");
          navigation("/");
        }
      });
  }, [addExpense, createGroup]);

  const columns = [
    { field: "date", headerName: "Date", width: 300, align: "centre" },
    {
      field: "transactionName",
      headerName: "Transaction Name / Group Name",
      width: 400,
      align: "centre",
    },
    { field: "message", headerName: "Message", width: 400, align: "centre" },
    { field: "type", headerName: "Type", width: 300, align: "centre" },
  ];

  const handleDialogueStatus = (status) => {
    createGroup && setCreateGroup(status);
    friends && setAddFriends(status);
    addExpense && setAddExpense(status);
  };
  const handleCreateGroup = () => {
    setCreateGroup(true);
  };
  const handleAddFriends = () => {
    setAddFriends(true);
  };
  const handleAddExpense = () => {
    setAddExpense(true);
  };
  const handleLogout = ()=>{
    localStorage.clear()
    navigation('/')
  }
  return (
    <>
      <div className="dt-mui">
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          style={{ height: 400, width: "100%" }}
        />
      </div>
      <Container>
        <Stack spacing={2}>
          <Item>
            <button onClick={handleCreateGroup}>Create Group</button>
          </Item>
          <Item>
            <button onClick={handleAddExpense}>Add Expense</button>
          </Item>
          <Item>
            <button onClick={handleAddFriends}>Add Friends</button>
          </Item>
          <Item>
            <button onClick={handleLogout}>Logout</button>
          </Item>
        </Stack>
        {createGroup && (
          <CreateGroupManager handleDialogueStatus={handleDialogueStatus} />
        )}
        {friends && (
          <AddFriendsManager handleDialogueStatus={handleDialogueStatus} />
        )}
        {addExpense && (
          <IndividualExpenseManager
            handleDialogueStatus={handleDialogueStatus}
          />
        )}
      </Container>
    </>
  );
}
