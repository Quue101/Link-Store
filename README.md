# Stan Store Clone

This is a minimal clone of a "Stan Store"-style link store. It provides a simple web page to list products and a JSON API to add new products.

## Usage

1. Run the server:

```bash
node server.js
```

2. Open your browser at `http://localhost:3000` to see the product list.

3. Add a new product with a POST request to `/api/products` containing JSON with `name`, `description`, `price`, and `link` fields.

Products are stored in `data.json`.
