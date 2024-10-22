const path = require("path");
const router = require("express").Router();
const { products, orders } = require("../models/index");
const Stripe = require("stripe");
const stripe = Stripe(
  `pk_test_51OUyRXBzE7RBUe9gYdNS6nh6Bp9CLvOLWBaAnqKPXInOKqiyl7mPDsjbCtk2hlVAcPTv82oyo0kYi5s7d2oPX5jg00VMjjPeUa`
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return;
  try {
    const product = products.findByPk(id);
    const getOneProduct = await product;
    res.render("productDetails", { product: getOneProduct });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.get("/", async (req, res) => {
  try {
    const getProducts = products.findAll();
    if (!getProducts) {
      return res.send({ message: "no product" });
    }
    const pr = await getProducts;

    res.render("productList", { products: pr });
  } catch (error) {}
});

router.post("/create-checkout-session", async (req, res) => {
  const { id } = req.body;
  try {
    const rawProduct = await products.findByPk(id);
    const product = rawProduct.toJSON();

    if (!product) {
      return res.status(404).send("Product not found");
    }
    console.log(product);
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://products/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get("host")}/cancel`,
    });

    console.log(session);
    res.json({ id: session.id });
    // res.redirect(303, session.url);
  } catch (error) {}
});

router.get("/success", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  // Save order details in the database
  const order = await orders.create({
    product_id: session.metadata.product_id,
    total: session.amount_total / 100,
    stripe_id: session.id,
    status: "paid",
  });

  const product = await products.findByPk(order.product_id);

  res.render("success", { product, order });
});

module.exports = router;
