const { product } = require("../../models");
const midtransClient = require("midtrans-client");

exports.getProducts = async (req, res) => {
  try {
    const data = await product.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await product.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const dataAddProduct = req.body;

    await product.create(dataAddProduct);

    const data = await product.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.orderProduct = async (req, res) => {
  const { customer, order_id, total_amount } = req.body;

  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-IpIt8RS_xOZ1LU0beqK7qaz-",
    });

    let parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: total_amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: customer.name,
        last_name: "",
        email: customer.email,
        phone: customer.phone,
      },
    };

    snap.createTransaction(parameter).then((transaction) => {
      const transactionToken = transaction.token;
      res.send({
        status: "success",
        data: {
          token: transactionToken,
        },
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error",
      status: "server error",
    });
  }
};
