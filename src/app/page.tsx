"use client"
import { Fragment, useState } from 'react';
import myData from './items.json';
import { Dialog, Transition } from '@headlessui/react';
import { Checkout, PricingRules } from '@/lib/utils';

type Item = {
  id: string
  sku: string
  name: string
  currency: string
  price: number
}

export default function Home() {
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [discountedPrices, setDiscountedPrices] = useState<{ [key: string]: number }>({});
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (item: Item) => {
    setCartItems(state =>  ([...state, item]))
  }

  const openModal = () => {
    const myPricingRules = new PricingRules
    const co = new Checkout(myPricingRules);

    cartItems.forEach(cartItem => {
      co.scan(cartItem);
    });
    let discountedItems= co.totalPerItem();
    setDiscountedPrices(discountedItems);
    setTotal(co.total());
    setIsOpen(true);
  }

  const closeModal = () => setIsOpen(false);

  const cartItemsCombined = cartItems.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i)

  return (
    <main className="flex min-h-screen flex-col">
      <div className='h-20 border-b-white border-b-2 items-center flex px-4 justify-between'>
        <div>First Circle</div>
        
        <button className='flex items-center gap-4 bg-purple-500 px-4 py-2 rounded-lg' onClick={openModal}>
          <span>Checkout</span>
          <div className='bg-white text-black rounded-full w-8 h-8 flex items-center justify-center'>{cartItems.length}</div>
        </button>
      </div>
      <div className='flex  justify-center p-12 flex-grow'>
        <div className='flex flex-wrap h-full w-full gap-4 '>
          {Object.values(myData).map(item => (
            <div className='p-4 w-60 border-2 rounded-xl  hover:border-blue-300'>
              <p>{item.name}</p>
              <p>{item.currency+item.price}</p>
              <div className='flex mt-3'>
                <button onClick={() => addToCart(item)} className='flex-grow bg-violet-500 rounded-md'>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Checkout
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className='flex w-full text-black font-bold'>
                      <div className='flex-1'>Item</div>
                      <div className='text-center'>Quantity</div>
                      <div className='flex-1 text-right'>Price</div>
                    </div>
                    {cartItemsCombined.map((item) => {

                      const count = cartItems.filter(cartItem => cartItem.id === item.id).length
                      const hasDiscountedPrice = discountedPrices[item.id] != item.price*count
                      return (
                        <div className='flex w-full text-black'>
                          <div className='flex-1'>{item?.name}</div>
                          <div className=' text-center'>{count}</div>
                          <div className='flex-1 text-right'>
                            <span className={`${hasDiscountedPrice ? 'line-through text-red-500': ''}`}>{item?.currency + ((item?.price || 0)*count)}</span>
                            {hasDiscountedPrice && <span className='ml-2'>{item?.currency + discountedPrices[item.id]}</span>}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-4 flex text-black justify-between bg-slate-400 p-1 rounded-md font-bold">
                    <div>Total</div>
                    <div className=''>${total}</div>
                  </div>
                  <button
                      type="button"
                      className="mt-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Checkout
                    </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </main>
  );
}
