import React, { useState, useEffect } from "react";
import OrderCard from "./OrderCard";
import orderProductManager from "../../modules/orderProductManager";
import orderManager from "../../modules/orderManager";
import productManager from "../../modules/productManager";

const OrdersList = (routerProps) => {
  // this stores the products that are connected with the active order
  const [shoppingCart, setShoppingCart] = useState([]);
  // this stores all of the user's products
  const [orders, setOrders] = useState([]);
  // this stores the user's single active order
  const [openOrder, setOpenOrder] = useState({});
  // this stores all of the products available on Bangazon
  const [products, setProducts] = useState([]);
  // this stores the total of the open order
  const [total, setTotal] = useState([]);

  const props = routerProps.routerProps;

  const getProducts = () => {
    productManager.getProducts().then((products) => {
      setProducts(products);
    });
  };

  const getShoppingCartProducts = () => {
    // get all of the users orders
    orderManager.getUserOrders().then((orders) => {
      setOrders(orders);
      // filter out just the single open order
      const openOrder = orders.filter((order) => order.payment_type === null);
      setOpenOrder(openOrder);
      // if there is an open order, get the products associated with that order
      if (openOrder.length !== 0) {
        orderProductManager
          .getOrderProductsByOrder(openOrder[0].id)
          .then((products) => {
            setShoppingCart(products);
            // add the price of each product to the order total
            let orderTotal = 0;
            products.forEach(
              (product) => (orderTotal += parseInt(product.product.price))
            );
            setTotal(orderTotal.toFixed(2));
          });
      }
    });
  };

  const cancelOrder = () => {
    orderManager
      .deleteOrder(openOrder[0].id)
      .then(() =>
        orderManager.getUserOrders().then((orders) => {
          setOrders(orders);
        })
      )
      .then(window.alert("You have successfully cancelled your order!"))
      .then(props.history.push("/buy"));
  };

  useEffect(() => {
    getShoppingCartProducts();
    getProducts();
  }, []);

  if (openOrder.length === 0) {
    return (
      <div className="shoppingCart">
        <button type="button" onClick={() => props.history.push("/buy")}>
          Browse Products
        </button>
        <button type="button" onClick={() => props.history.push("/cart")}>
          Back to My Cart
        </button>
        <h1>Current Open Order:</h1>
        <div>
          <h3>
            You have not started an order yet. Browse products and add them to
            your cart.
          </h3>
        </div>
      </div>
    );
  } else {
    return (
      <div className="shoppingCart">
        <button type="button" onClick={() => props.history.push("/buy")}>
          Browse More Products
        </button>
        <button type="button" onClick={() => props.history.push("/cart")}>
          Back to My Cart
        </button>

        <h1>Current Open Order:</h1>
        <h2>
          Please verify the items in your order and then click 'complete order'.
        </h2>
        <div>
          {shoppingCart.map((shoppingCart) => (
            <OrderCard
              key={shoppingCart.id}
              shoppingCart={shoppingCart}
              {...routerProps}
            />
          ))}
        </div>
        <h1>Order Total: ${total}</h1>
        <button
          type="button"
          onClick={() => props.history.push("/orderpayment")}
        >
          Complete Order
        </button>
        <button type="button" onClick={cancelOrder}>
          Cancel Order
        </button>
      </div>
    );
  }
};

export default OrdersList;
