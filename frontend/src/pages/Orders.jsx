import { OrderCard } from '../components/cards/OrderCard';
import {Link} from 'react-router'

export const Orders = () => {
  return (
    <div className='h-full w-full'>
      <h1 className="text-center text-3xl font-bold p-2">
        My Orders
      </h1>


       {/* orders begins */}
            <div className="grid mt-4 gap-4 items-center justify-items-center">
              {[1, 2, 3, 4, 5, 6].map((item, index) => {
                return <Link to={`/orders/${item}`} key={index}>
                <OrderCard itemsCount={item}/>
                </Link>
              })}
            </div>
            {/* orders ends */}
    </div>
  )
}