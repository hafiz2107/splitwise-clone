const mongo = require("../../config/db");
const {
  expenseCollection,
  userCollection,
} = require("../../config/collection");
const { ObjectID } = require("bson");
const { uuid } = require('uuidv4');

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
  return new Promise((resolve, reject) => {
    let amountPerPerson = parseFloat(amount / (totalShares + 1)).toFixed(2);
    let incomeFromTransaction =
    type === "Individual"
      ? amountPerPerson
      : amountPerPerson * sharedWith.length;

    sharedWith = sharedWith.map((eachFriend) => {

      return {
        ...eachFriend,
        userId: ObjectID(eachFriend["_id"]),
        amountToPay: incomeFromTransaction,
        expenseName,
        toGive: true,
        _id : uuid()
      };
    });

    let idsToUpdate = sharedWith.map((val) => {
      return val.userId;
    });
    idsToUpdate.push(ObjectID(createdBy));


    try {
      mongo
        .get(expenseCollection)
        .insertOne({
          friends: sharedWith,
          totalExpense: parseFloat(amount).toFixed(2),
          createdBy: ObjectID(createdBy),
          totalPersons: totalShares,
          createdDate,
          incomeFromTransaction: incomeFromTransaction,
          expenseName,
          type,
          createdByUsername,
        })
        .then((result) => {
          if (type === "Group") {
            mongo
              .get(userCollection)
              .updateMany(
                { _id: { $in: idsToUpdate } },
                {
                  $push: {
                    groupTransactions: ObjectID(result.insertedId),
                  },
                }
              )
              .then(() => {
                resolve(true);
              })
              .catch((err) => {
                reject({ reason: "ERR", data: err });
              });
          } else {
            mongo
              .get(userCollection)
              .updateMany(
                { _id: { $in: idsToUpdate } },
                {
                  $push: {
                    individualTransactions: ObjectID(result.insertedId),
                  },
                }
              )
              .then(() => {
                resolve(true);
              })
              .catch((err) => {
                reject({ reason: "ERR", data: err });
              });
          }
        })
        .catch((err) => {
          reject({ reason: "ERR", data: err });
        });
    } catch (err) {
      reject({ reason: "ERR", data: err.errmsg });
    }
  });
};
