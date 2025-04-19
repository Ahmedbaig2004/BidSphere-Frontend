import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const DarkModeToggle = () => {
    const [darkMode,setdarkMode]=useState(localStorage.getItem("theme")==="dark")

    useEffect(()=>{
        if(darkMode){
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme","dark")
        }
        else{
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme","light")

        }
    },[darkMode])

  return (
    <div>
        <button
      onClick={() => setdarkMode(!darkMode)}
      className="p-2 rounded dark:bg-gray-700 text-black dark:text-white"
    >
      {darkMode ? "🌙" : "☀️"}
    </button>
    </div>
  )
}

export default DarkModeToggle
