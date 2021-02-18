import React from "react"
import {useSelector, connect} from "react-redux";
import {addQuantity, addToCart, openNotDelivery, removeFromCart, subQuantity} from "../../redux/actions/asideAction";
import { useMediaQuery } from 'react-responsive'

const CatalogItem = ({products, addToCart, addressReducer, openNotDelivery, cart, addQuantity, subQuantity, removeFromCart}) => {
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const addToAside = (product) => {
    if(addressReducer.location || addressReducer.pickup)
      addToCart(product)
    else
      openNotDelivery(true)
  }

  const addToAsideMobile = (event, product) => {
    const target = event.target
    const parent = target.closest('.catalog-item')

    const itemFind = cart.find(item => item.product._id === product._id)
    if(target.className === 'catalog-mobile__plus'){
      addQuantity(product._id, itemFind.quantity, product.price)
    }
    else if(target.className === 'catalog-mobile__minus'){
      if(itemFind.quantity < 2){
        parent.classList.remove('added-one')
        removeFromCart(product._id)
      } else{
        subQuantity(product._id, itemFind.quantity, product.price)
      }
    }
    else{
      parent.classList.add('added-one')
      addToCart(product)
    }
  }

  return (
    products.map((product, index) => {
      return (
        <div
          key={index}
          className="catalog-item"
          onClick={(event) => {isMobile ? addToAsideMobile(event, product): addToAside(product)}}
        >
          <div className="catalog-item__top">
            <h4>{product.name}</h4>
            <span><span className="woocommerce-Price-amount amount">
              <bdi>{product.price}
                <span className="woocommerce-Price-currencySymbol">₽</span></bdi></span></span>
          </div>
          <div className="catalog-item__photo">
            <img src={"http://localhost:5000/" + product.productImage} alt={product.name}/>
            <div className="catalog-photo__general">
              <div className="catalog-photo__gramme"><span>{product.weight} г</span>
              </div>
            </div>
          </div>
          <div className="catalog-mobile__counter" key={cart.find(item => item.product._id === product._id) ? cart.find(item => item.product._id === product._id).quantity : "" }>
              <div className="catalog-mobile__minus"></div>
              <input type="text" defaultValue={cart.find(item => item.product._id === product._id) ? cart.find(item => item.product._id === product._id).quantity : "" } />
              <div className="catalog-mobile__plus"></div>
          </div>

        </div>
      )
    })
  )


}

const mapStateToProps = state => {
  return {
    addressReducer: state.addressReducer,
    cart: state.asideReducer.cart
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (product) => dispatch(addToCart(product)),
    openNotDelivery: (status) => dispatch(openNotDelivery(status)),
    addQuantity: (id, quantity, price) => dispatch(addQuantity(id, quantity, price)),
    subQuantity: (id, quantity, price) => dispatch(subQuantity(id, quantity, price)),
    removeFromCart: (id) => dispatch(removeFromCart(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogItem)
