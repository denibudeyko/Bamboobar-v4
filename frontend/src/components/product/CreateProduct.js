import React, {useState, useCallback, useEffect} from "react"
import axios from "axios"
const CreateProduct = () =>{

  const [form, setForm] = useState({
    name: "", price: "", weight: "", category: ""
  })
  const [file, setFile] = useState()
  const[categories, setCategories] = useState([]);

  const onChangeHandler = event => {
    setForm({...form, [event.target.name] : event.target.value})
  }
  const onAddFileHandler  = event =>{
    const fileOne = event.target.files[0]
    setFile(fileOne)
  }

  useEffect(()=>{
    axios
      .get('/api/category/categories')
      .then(result => setCategories(result.data.data))
  }, [])

  const onSubmitHandler = async(event) =>{
    const data = new FormData()
    const jsonForm = JSON.stringify(form)
    console.log(form)
    data.append("form", jsonForm)
    data.append("file", file)
    event.preventDefault()
    try{
      const response = await axios.post('/api/product/create', data)
      console.log(response, 'axios response')
      setForm({name: "", price: "", weight: "", productImage: "", category: ""})
    }
    catch (e) {
      console.log(e.response.data.message)
    }
  }



  return(
    <div className="create-product" encType="multipart/form-data">
      <form className="form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" onChange={onChangeHandler} required/>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input type="number" name="price" onChange={onChangeHandler} required/>
        </div>
        <div className="form-group">
          <label>Weight</label>
          <input type="text" name="weight" onChange={onChangeHandler} required/>
        </div>
        <div className="form-group">
          <label>productImage</label>
          <input type="file" onChange={onAddFileHandler} name='productImage'/>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" onChange={onChangeHandler}  defaultValue={form.category} >
            {categories.map((category , key) => {
              return(
                <option key={key}  value={category._id}>{category.name}</option>
              )
            })}
          </select>
        </div>
        <div className="form-group">
          <button className="button" onClick={onSubmitHandler}>
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProduct
