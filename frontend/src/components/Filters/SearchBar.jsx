import { useState } from 'react'
import { useNavigate  } from 'react-router'
import {useDispatch} from 'react-redux'
import {saveKeyword} from '../../store/slices/productSlice.js'

export const SearchBar = ({placeholderValue}) => {
     const [search, setSearch] = useState("");
     const navigate = useNavigate()
     const dispatch = useDispatch()

     const sendToProductsPage = (e)=>{
        if(e.key === 'Enter'){
          dispatch(saveKeyword(search.trim()))
          setSearch('')
          navigate('/products')
        }
     }

  return (
    <input
          className="p-1 px-2 border border-black bg-white rounded-lg outline-none text-md w-full"
          type="text"
          value={search}
          name="search"
          placeholder={placeholderValue}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={sendToProductsPage}
        />
  )
}
