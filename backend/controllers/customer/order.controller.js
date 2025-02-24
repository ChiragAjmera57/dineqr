const { Order } = require("../../models");
const { Menu, OrderItem } = require("../../models");

const placeOrder = async (req, res) => {
  const { jsonData } = req.body;
  const newOrder = await Order.create({
    status: "pending",
    table_id: jsonData.tableId,
  });
  let totalAmount = 0
  for (let i of jsonData.data) {
    let menuId = i.menuId;
    let quantity = i.quantity;

    const manu = await Menu.findByPk(menuId);
    let priceOfItem = manu.price;
    totalAmount += (quantity * priceOfItem)
    const newOrderItem = await OrderItem.create({
      menu_id: menuId,
      order_id: newOrder.id,
      quantity,
      price: quantity * priceOfItem,
    });
  }
  newOrder.amount = totalAmount
  newOrder.save()
};

module.exports = { placeOrder };
