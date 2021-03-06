const axios = require('axios')
const {Order, CartItem} = require('../models/order.models')
const qs = require('qs')
require('dotenv').config()

const createOrder = async (req, res) => {
  try {
    const data = req.body
    const newOrder = new Order(data)
    await newOrder.save()
    res.status(200).json(newOrder)
  } catch (err) {
    res.status(500).json({error: err.message})
  }
}

const getOrderByUser = async (req, res) => {
  try {
    const {id} = req.body
    const order = await Order.find({user: id}).sort({create: -1})
    res.status(200).json(order)

  } catch (err) {
    res.status(500).json({error: err.message})
  }
}

const payOrder = async (req, res) => {
  try {
    let {price, address, date, id, products, user, isSale, isDelivery, deliveryPrice} = req.body
    price = price * 100
    let positionIdCount = 1;
    let items = products.map((product) => {
      let {_id, name, quantity, priceItem, priceWithSale} = product

      return {
        positionId: positionIdCount++,
        name: name,
        itemCurrency: "643",
        quantity: {"value": quantity, "measure": "единиц"},
        itemPrice: isSale ? priceWithSale * 100 : priceItem * 100,
        itemCode: _id,
      }
    })
    if(isDelivery){
      const productDelivery = {
        positionId: positionIdCount++,
        name: "Доставка",
        itemCurrency: "643",
        quantity: {"value": 1, "measure": "единиц"},
        itemPrice: deliveryPrice * 100,
        itemCode: 'taxi_delivery',
      }
      items.push(productDelivery)
      price = price + deliveryPrice * 100
    }


    const orderBundle =
      {
        "orderCreationDate": date,
        "customerDetails": {
          "email": user.email,
          "phone": user.phone,
          "contact": user.username,
          "deliveryInfo": {
            "deliveryType": "courier", "country": "RU", "city": "Moscow",
            "postAddress": address
          }
        },
        "cartItems": {
          "items": items
        }
      }


    const params = new URLSearchParams()
    params.append("userName", "delivery-bamboobar-api")
    params.append("password", ">@^z-J8XW#'-26~[")
    params.append("returnUrl", process.env.base_url + "thanks/?orderID=" + id)
    params.append("currency", '643')
    params.append("failUrl", process.env.base_url + "?success=false")
    params.append("orderId", id)
    params.append("orderNumber", id)
    params.append("amount", price)
    params.append("orderBundle", JSON.stringify(orderBundle))
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    const url = 'https://3dsec.sberbank.ru/payment/rest/register.do'
    axios.post(url, params, config)
      .then((result) => {
        res.status(200).json(result.data)

      })

  } catch (err) {
    res.status(500).json({error: err.message})
  }
}

const updateOrder = async (req, res) => {
  try {
    const {id, status} = req.body
    const update = await Order.findByIdAndUpdate({_id: id}, {orderStatus: status})
    res.status(200).json({message: "Заказ обновлен"})
  } catch (err) {
    res.status(500).json({erorr: err.message})
  }
}


module.exports = {
  createOrder,
  getOrderByUser,
  payOrder,
  updateOrder
}
