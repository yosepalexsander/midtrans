const { product, transaction } = require("../../models");
const { v4: uuidV4 } = require("uuid");
const midtransClient = require("midtrans-client");
const nodemailer = require("nodemailer");

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await transaction.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: product,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      order: [["id", "DESC"]],
    });

    res.send({
      status: "success",
      data: transactions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.addTransaction = async (req, res) => {
  const dataAddProduct = {
    id: uuidV4(),
    productId: req.body.id,
    total: req.body.price,
  };

  console.log(dataAddProduct);
  try {
    const createdTransaction = await transaction.create(dataAddProduct);

    const transactionNew = await transaction.findOne({
      where: {
        id: createdTransaction.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        transaction: transactionNew,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    await transaction.update(req.body, {
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: "data has been updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

const MIDTRANS_CLIENT_KEY = "SB-Mid-client-AJZcYn3Goo4xd6hx";
const MIDTRANS_SERVER_KEY = "SB-Mid-server-IpIt8RS_xOZ1LU0beqK7qaz-";

const core = new midtransClient.CoreApi();

core.apiConfig.set({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

const handleTransaction = async (status, transactionId) => {
  await transaction.update(
    {
      status,
    },
    {
      where: {
        id: transactionId,
      },
    }
  );
};

exports.notification = async (req, res) => {
  try {
    const data = req.body;
    const statusResponse = await core.transaction.notification(data);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    console.log("statusReponse", statusResponse);
    console.log(
      `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
    );

    // Sample transactionStatus handling logic

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        // TODO set transaction status on your database to 'challenge'
        // and response with 200 OK
        handleTransaction("PENDING", orderId);
        res.status(200);
      } else if (fraudStatus == "accept") {
        // TODO set transaction status on your database to 'success'
        // and response with 200 OK
        handleTransaction("FINISH", orderId);
        res.status(200);
      }
    } else if (transactionStatus == "settlement") {
      handleTransaction("FINISH", orderId);
      res.status(200);
    } else if (transactionStatus === "deny") {
      handleTransaction("DENY", orderId);
      res.status(200);
    } else if (transactionStatus == "cancel" || transactionStatus == "expire") {
      handleTransaction("EXPIRECANCEL", orderId);
      res.status(200);
    } else if (transactionStatus == "pending") {
      handleTransaction("PENDING", orderId);
      res.status(200);
    }
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

exports.sendMail = async (req, res) => {
  const { order_id, payment_type, gross_amount } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "testdev0209@gmail.com",
        pass: "test@12345",
      },
    });

    const mailOptions = {
      from: "testdev0209@gmail.com", //sender
      to: "yosepalexsander9@gmail.com", //receiver
      subject: "Transaction notification",
      html: `<h5>Order id: ${order_id}</h5>
      <h5>gross amount: ${gross_amount}</h5>
      <h5>payment type: ${payment_type}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info.envelope);
    res.status(201);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};
