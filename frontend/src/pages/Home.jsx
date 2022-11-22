import { Container, Stack, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import CreateGroupManager from "../components/CreateGroupComponent/CreateGroupManager";
import AddFriendsManager from "../components/AddFriendsComponent/AddFriendsComponent";
import IndividualExpenseManager from "../components/AddExpenseComponent/AddIndividualExpenses";
import ViewTransactionsManager from "../components/ViewTransactionsComponent/ViewTransactionsManager";
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
  const [transactions, setTransactions] = useState("");
  const navigation = useNavigate();

  useEffect(() => {
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }/get-dashboard?userId=${localStorage.getItem("_id")}`
      )
      .then((result) => {
        if (
          (result.data.status === 200 || result.data.status === 204) &&
          result.data.success
        ) {
          if (result.data.data.length > 0) {
            let row = [];
            result.data.data.map((eachData) => {
              !eachData.settled_up &&
                row.push({
                  id: eachData["_id"],
                  date: eachData.created_date,
                  transactionName: eachData.expenseName,
                  message:
                    eachData.creator_id.toString() ===
                    localStorage.getItem("_id")
                      ? `${eachData.borrower.username} owes you ${eachData.split_amount}`
                      : `You owes ${eachData.creator.username} ${eachData.split_amount}`,
                  type: eachData.type,
                });
            });
            setData(row);
          } else {
            setData([]);
          }
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
    transactions && setTransactions(status)
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
  const handleLogout = () => {
    localStorage.clear();
    navigation("/");
  };

  const handleRowClick = (params) => {
    const { id } = params.row;
    setTransactions(id);
  };

  return (
    <>
      <div className="dt-mui">
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          style={{ height: 400, width: "100%" }}
          onRowClick={handleRowClick}
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
        {transactions && (
          <ViewTransactionsManager
            handleDialogueStatus={handleDialogueStatus}
            transactionId={transactions}
          />
        )}
      </Container>
    </>
  );
}
