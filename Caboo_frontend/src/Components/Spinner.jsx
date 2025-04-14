import React, { useEffect, useState } from 'react'

const Spinner = ({children}) => {

  const [ShowSpinner , setShowSpinner] = useState(true)

  return (
    <>
    {ShowSpinner ? (
        <div className="min-h-screen flex flex-col   items-center justify-center ">
          <div
            className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"
          ></div>
          <h2 className="text-zinc-900 dark:text-black mt-4">Loading...</h2>
        </div>
      ) : (
        children
      )}
      </>
  )
}

export default Spinner