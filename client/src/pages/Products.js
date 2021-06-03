import { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import CardProduct from "../components/Products/CardProduct";
import { API } from "../config/api";

const Products = () => {
  const [products, setProducts] = useState(null);
  const [loading, setloading] = useState(true);

  const getProducts = async () => {
    const response = await API.get("/products");
    setProducts(response.data.data);
    setloading(false);
  };
  const onClickBuy = async (data) => {
    console.log(data);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify(data);
    const dataTransaction = await API.post("/transaction", body, config);

    const dataSetTokenOrder = {
      order_id: dataTransaction.data.data.transaction.id,
      total_amount: dataTransaction.data.data.transaction.total,
      customer: {
        name: "user", //untuk field customer_name jika dibutuhkan,
        email: "user@mail.com", //untuk field customer_email jika dibutuhkan,
        id: 2, //untuk field customer_id jika dibutuhkan
        phone: "0821432432",
      },
    };

    const responseToken = await API.post(
      "/order",
      JSON.stringify(dataSetTokenOrder),
      config
    );

    const token = responseToken.data.data.token;

    window.snap.pay(token, {
      onSuccess: async function (result) {
        console.log("success");
        console.log(result);
        const { order_id, gross_amount, payment_type } = result;
        const body = {
          order_id,
          gross_amount,
          payment_type,
        };
        await API.post("/mail-notification", JSON.stringify(body), config);
      },
      onPending: async function (result) {
        console.log("pending");
        console.log(result);
        const { order_id, gross_amount, payment_type } = result;
        const body = {
          order_id,
          gross_amount,
          payment_type,
        };
        await API.post("/mail-notification", JSON.stringify(body), config);
      },
      onError: function (result) {
        console.log("error");
        console.log(result);
      },
      onClose: function () {
        console.log("customer closed the popup without finishing the payment");
      },
    });
  };
  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const midtransClientKey = "SB-Mid-client-AJZcYn3Goo4xd6hx";

    const scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", midtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);
  if (loading) return <div>Loading....</div>;

  return (
    <div>
      <h1>Products</h1>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item key={product.id}>
            <CardProduct item={product} handleBuy={onClickBuy} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Products;
