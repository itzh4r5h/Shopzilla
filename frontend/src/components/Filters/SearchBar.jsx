import { useState } from 'react'
import { useNavigate  } from 'react-router'
import {useDispatch} from 'react-redux'
import {saveKeyword as serachProduct} from '../../store/slices/productSlice'
import {saveKeyword as searchUser} from '../../store/slices/adminSlice'

export const SearchBar = ({placeholderValue,path}) => {
     const [search, setSearch] = useState("");
     const navigate = useNavigate()
     const dispatch = useDispatch()

     const sendToProductsPage = (e)=>{
        if(e.key === 'Enter'){

          if(path.includes('products')){
            dispatch(serachProduct(search.trim()))
          }
          else if(path.includes('users')){
            dispatch(searchUser(search.trim()))
          }
          navigate(path)
        }
     }

  return (
    <input
          className="p-1 px-2 border border-black bg-white rounded-lg outline-none text-md w-full"
          type="text"
          value={search}
          name="search"
          autoComplete='off'
          placeholder={placeholderValue}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={sendToProductsPage}
        />
  )
}
