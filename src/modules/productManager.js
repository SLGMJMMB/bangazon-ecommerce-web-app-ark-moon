const baseUrl = "http://127.0.0.1:8000";

const productAPI = {
  getProducts() {
    return fetch(`${baseUrl}/products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(),
    }).then((resp) => resp.json());
  },
  getProductTypes() {
    return fetch(`${baseUrl}/product-types`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(),
    }).then((resp) => resp.json());
  },
  async addProductToCart(productId, product) {
    const resp = await fetch(`${baseUrl}/orders/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify( {product} ),
    });
    return await resp.json();
  },
  async getProductDetail(productId) {
    const resp = await fetch(`${baseUrl}/products/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Authorization: `Token ${sessionStorage.getItem("token")}`,
      },
    });
    return await resp.json();
  },
  postSellableProduct(product) {
    return fetch(`${baseUrl}/sell`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify(product),
    }).then((resp) => resp.json());
  },
};

export default productAPI;
