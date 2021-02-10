import React, {useState, useEffect} from "react";
import {connect} from 'react-redux'
import AsideItem from "./AsideItem";
import Order from "../modal/Order";
import AsideDelivery from "../catalog/AsideDelivery";
import {openRegister} from "../../redux/actions/modalAction";
import {emptyCart} from "../../redux/actions/asideAction";

const Aside = ({cart, address, addressReducer, user, openRegister, emptyCart}) => {

  const [total, setTotal] = useState("0")
  const [sale, setSale] = useState(0)
  const [percent, setPercent] = useState("0")

  useEffect(() => {
    let totalPrice = 0;
    if(!cart.length){
      setTotal(0)
    }
    cart.forEach(item => {
      totalPrice += item.priceGroup;
      setTotal(totalPrice)
    })
    setPercent(totalPrice / addressReducer.deliveryMin * 100)
  }, [cart])


  useEffect(() => {
    if(addressReducer.deliverySale){
      setSale(total - total * .20)
    }
  }, [total])

  return (
    <aside className="aside aside-ready">
      <div className="aside-control">
        <div className="aside-title"><span>Мой заказ</span>
        </div>
        <div className="aside-close" onClick={() => emptyCart()}>
          <img src="http://delivery.bamboobar.su/wp-content/themes/bamboobar/static/img/assets/aside/close.svg"
               alt="Close"/>
        </div>
        {(addressReducer.deliverySale) ? (
          <div className="aside-sale">Скидка 20% активировано </div>
        ) : ""}
      </div>
      {address ? (
        <>
          <div className="aside-items">
            {cart.map((item, index) => {
              return (
                <AsideItem key={index} item={item}/>
              )
            })}
          </div>
          <AsideDelivery total={total} sale={sale} percent={percent} cart={cart}/>
        </>
      ) : ""}
      <div className="aside-delivery__button">

        {address ? (
          <>
            {(user) ? (
              <Order
                cart={cart}
                total={sale ? sale : total}
                time={addressReducer.deliveryTime}
                isSale={sale ? true: false}
                typename={addressReducer.deliveryMin > total ? 'notedit' : ""}/>
            ) : (
              <div onClick={() => openRegister()} className={"button button-checkout"}>
                <span>Оформить заказ</span>
              </div>
            )}

          </>
        ) : (
          <a href="#banner" className="button button-checkout">
            <span>Указать адресс</span>
          </a>
        )}
      </div>
    </aside>
  )
}

const mapStateToProps = (state) => {
  return {
    cart: state.asideReducer.cart,
    address: state.addressReducer.address,
    addressReducer: state.addressReducer,
    user: state.authReducer.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openRegister: () => dispatch(openRegister()),
    emptyCart: () => dispatch(emptyCart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Aside)
