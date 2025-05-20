"use client";
import React, { useEffect, useState } from 'react'
import { IoIosSwap } from "react-icons/io";

export default function page() {
  const [amount, setAmount] = useState<number>(1)
  const [fromCurrency, setFromCurrency] = useState<string>('BTC')
  const [toCurrency, setToCurrency] = useState<string>('USD')
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const crypto = ['BTC', 'ETH', 'LTC', 'XRP', 'ADA', 'DOGE', 'SOL', 'BNB', 'DOT', 'AVAX', 
  'MATIC', 'SHIB', 'TRX', 'LINK', 'UNI', 'XLM', 'ATOM', 'JPY', 'GBP'];

  const cash = ['USD', 'EUR','JPY','GBP','AUD','CAD','CNY','INR','SGD','CHF','KRW','BRL']

  const handleConvert = async () => {
    try {
      if (amount <= 0) {
        setError("Please enter a valid amount")
      }
      setLoading(true)
      const response = await fetch(`/api/rate?from=${fromCurrency}&to=${toCurrency}`);
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Conversion failed")
        return
      }

      const convertedAmount = amount * data.rate
      setResult(parseFloat(convertedAmount.toFixed(8)))
      setLastUpdated(new Date(data.timestamp).toLocaleDateString())

      const interval = setInterval(async () => {
        const updatedResponse = await fetch(`/api/rate?from=${fromCurrency}&to=${toCurrency}`);
        const updatedData = await updatedResponse.json()

        if (updatedResponse.ok) {
          const updatedConverted = amount * updatedData.rate
          setResult(parseFloat(updatedConverted.toFixed(8)))
          setLastUpdated(new Date(updatedData.timestamp).toLocaleDateString())
        }
      }, 30000)

      return () => clearInterval(interval)
    } catch (err) {
      setError("An error occurred during conversion")
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (result !== null) {
      handleConvert()
    }
  }, [fromCurrency, toCurrency])


  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors'>
      <main className='container mx-auto px-4 py-12'>
        {/* converter card */}
        <div className='max-w-lg mx-auto p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl'>
          <div className='space-y-3'>
            <label className='block text-sm font-bold text-black dark:text-white'>Amount</label>
            <div className='relative'>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  setAmount(!isNaN(value) ? Math.max(0, value) : 0)
                }}
                className='w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition  '
                min="0.1"
                step="0.1"
                placeholder='0.0'
              />

              {
                fromCurrency !== toCurrency && lastUpdated && (
                  <div className='absolute right-4 mt-2 text-sm front-bold text-black dark:text-white'>
                        Last updated: {lastUpdated}
                  </div>
                )
              }

            </div>
          </div>

          {/* Currency selection */}
          <div className='grid grid-cols-2 gap-6 mt-5'>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">From</label>
              <select
              value={fromCurrency}
              onChange={(e)=> setFromCurrency(e.target.value)}
              className='w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition  '
              >
                 <optgroup label='Crypto'>
               {crypto.map((currency)=> (
                  <option key={currency} value={currency}>{currency}</option>
               ))}
               </optgroup>
               <optgroup label='Cash'>
                {cash.map((currency)=> (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">To</label>
              <select
              value={toCurrency}
              onChange={(e)=> setToCurrency(e.target.value)}
              className='w-full px-4 py-3 rounded-lg bg-gray-100 dark:text-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition  '
              >
               
                <optgroup label='Cash'>
                {cash.map((currency)=> (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
                </optgroup>
                <optgroup label='Crypto'>
               {crypto.map((currency)=> (
                  <option key={currency} value={currency}>{currency}</option>
               ))}
               </optgroup>
              </select>
            </div>
          </div>

          {/* swap button */}
          <button
          onClick={()=> {
            setFromCurrency(toCurrency)
            setToCurrency(fromCurrency)
            setResult(null)
            handleConvert()
          }}
            className=" mt-2 w-full py-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2 font-medium transition hover:bg-blue-200 dark:hover:bg-blue-900/40"
          >
            <IoIosSwap size={20}/>
            Swap currencies
          </button>

          {/* converter button */}
          <button
          onClick={handleConvert}
          disabled={loading}
          className={`w-full py-3 rounded-lg mt-5 font-semibold shadow-md hover:shadow-lg transform transition hover:-translate-y-0.5
          ${loading 
            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
          }`}
          >
            {loading ? 'Converting...' : "Converter now"}
          </button>

          { error ? (
              <div className='mt-6 p-4 bg-red-50 dark:bg-red-900/20 boder'>
                <p className='text-sm text-red-600'>{error}</p>
              </div>
          ) : (
            result != null && (
              <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Result</p>
                    {lastUpdated && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">Updated: {lastUpdated}</p>
                    )}
                  </div>
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {amount} {fromCurrency} = {result.toFixed(6)} {toCurrency}
                  </p>
                  <div className="mt-2 text-right text-xs text-gray-500 dark:text-gray-400">
                    Real-time rate from CoinGecko
                  </div>
                </div>
            )
          )
            
          }
        </div>
      </main>
    </div>
  )
}


