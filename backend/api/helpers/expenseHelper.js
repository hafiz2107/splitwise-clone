const mongo = require("../../config/db");
const {
  expenseCollection,
  userCollection,
  transaction,
} = require("../../config/collection");
const { ObjectID } = require("bson");
const { uuid } = require("uuidv4");

exports.createIndividualExpense = ({
  amount,
  totalShares,
  sharedWith,
  createdBy,
  createdDate,
  expenseName,
  type,
  createdByUsername,
}) => {
  return new Promise(async (resolve, reject) => {
    let amountPerPerson = (amount / (totalShares + 1)).toFixed(2);

    let expenses = {
      expenseName: expenseName,
      settled_up: false,
      creator_id: ObjectID(createdBy),
      creator: {
        _id: ObjectID(createdBy),
        username: createdByUsername,
      },
      created_date: createdDate,
      borrower_id: ObjectID(sharedWith["_id"]),
      borrower: sharedWith,
      type,
      group: type == "Group" ? "group_id" : null,
      split_amount: parseFloat(amountPerPerson),
    };
    let result = await checkIfTheUserOwesSomeOne(
      expenses.creator_id,
      expenses.borrower_id
    );

    if (result == null) {
      const {insertedId} = await createNewExpense(expenses);
      createTransactions(
        insertedId,
        expenseName,
        amount,
        totalShares + 1,
        type,
        expenses.split_amount,
        createdByUsername
      );
      resolve(true);
    } else {
      let settled_up, amountToSettle;
      if (result.split_amount - amountPerPerson == 0) {
        createTransactions(
          result._id,
          expenseName,
          amount,
          totalShares + 1,
          type,
          expenses.split_amount,
          createdByUsername
        );
        settled_up = true;
        amountToSettle = 0;
        updateAmount(
          expenses.creator_id,
          expenses.borrower_id,
          amountToSettle,
          settled_up,
          expenseName
        );
        resolve(true);
      }
      if (result.split_amount - amountPerPerson > 0) {
        createTransactions(
          result._id,
          expenseName,
          amount,
          totalShares + 1,
          type,
          expenses.split_amount,
          createdByUsername
        );
        settled_up = false;
        amountToSettle = -parseFloat(amountPerPerson);
        updateAmount(
          expenses.creator_id,
          expenses.borrower_id,
          amountToSettle,
          settled_up,
          expenseName
        );
        resolve(true);
      }
      if (result.split_amount - amountPerPerson < 0) {
        expenses = {
          ...expenses,
          split_amount:
            parseFloat(amountPerPerson) - parseFloat(result.split_amount),
        };
        let obj = await updateAmount(
          expenses.creator_id,
          expenses.borrower_id,
          0,
          true,
          expenseName
        );

        let resultOfCheckUser = await checkIfTheUserOwesSomeOne(
          expenses.borrower_id,
          expenses.creator_id
        );
        if (resultOfCheckUser == null) {
          const { insertedId } = await createNewExpense(expenses);
          createTransactions(
            insertedId,
            expenseName,
            amount,
            totalShares + 1,
            type,
            expenses.split_amount,
            expenses.borrower.username
          );

          resolve(true);
        } else {
          amountToSettle = parseFloat(
            resultOfCheckUser.split_amount - amountPerPerson
          );
          let updatedResult = await updateAmount(
            expenses.borrower_id,
            expenses.creator_id,
            parseFloat(expenses.split_amount),
            false,
            expenseName
          );
          createTransactions(
            resultOfCheckUser._id,
            expenseName,
            amount,
            totalShares + 1,
            type,
            amountToSettle,
            expenses.borrower.username
          );
          resolve(true);
        }
      }
    }
  });
};

exports.getTransactionhelper = (id) => {
  return new Promise((resolve, reject) => {
    try {
      mongo
        .get(transaction)
        .find({ trans_id: ObjectID(id) })
        .toArray()
        .then((result) => {
          if(result.length > 0){
            resolve(result);
          }else{
            resolve(false)
          }
        })
        .catch((err) => {
          reject({ reason: "ERR", data: null })
        });
    } catch (err) {
      reject({ reason: "ERR", data: err.errmsg })
    }
  });
};

// Check if the user Owes to the person in the added friend
function checkIfTheUserOwesSomeOne(creator_id, borrower_id) {
  return mongo
    .get(expenseCollection)
    .findOne({
      creator_id: borrower_id,
      borrower_id: creator_id,
    })
    .then((result) => {
      return result;
    });
}

function createNewExpense(expenses) {
  return mongo
    .get(expenseCollection)
    .insertOne(expenses)
    .then((insertedResult) => {
      return insertedResult;
    });
}

function updateAmount(
  creator_id,
  borrower_id,
  amountToSettle,
  settled_up,
  expenseName
) {
  if (!amountToSettle) {
    return mongo
      .get(expenseCollection)
      .updateOne(
        {
          creator_id: borrower_id,
          borrower_id: creator_id,
        },
        {
          $set: {
            settled_up: settled_up,
            split_amount: amountToSettle,
            expenseName: expenseName,
          },
        }
      )
      .then((updatedResult) => {
        return updatedResult;
      });
  } else {
    return mongo
      .get(expenseCollection)
      .updateOne(
        {
          creator_id: borrower_id,
          borrower_id: creator_id,
        },
        {
          $inc: { split_amount: amountToSettle },
          $set: { settled_up: settled_up, expenseName: expenseName },
        }
      )
      .then((updatedResult) => {
        return updatedResult;
      });
  }
}

function createTransactions(
  trans_id,
  expenseName,
  totalAmount,
  totalShares,
  type,
  splits,
  createdBy
) {
  return mongo
    .get(transaction)
    .insertOne({
      trans_id,
      expenseName,
      totalAmount: parseFloat(totalAmount),
      totalShares,
      type,
      splits,
      createdBy,
    })
    .then((result) => {
      return result;
    });
}
