import { useEffect, useState } from "react"



// accepts a generic type, label, and initial value (either a generic type T or a function that returns type T)
// remember that a state can accept value or function, this preserves that behavior

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {


    // GET
    const jsonValue = localStorage.getItem(key)

    console.log(`GET: ${key} => ${jsonValue}`)

    if (jsonValue == null) {
      if (typeof initialValue === "function") {
        // cast initialValue() as needed by typescript defined above, then call it
        return (initialValue as () => T)()
      } else {
        return initialValue
      }
    } else {
      return JSON.parse(jsonValue)
    }
  })

  // store in local storage every time key changess
  useEffect(() => {

    //SET
    localStorage.setItem(key, JSON.stringify(value))

    fetch(`http://localhost:8090/${key.toLowerCase()}`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    })

  }, [value, key])

  // return type using 'as' so typescript knows types
  return [value, setValue] as [T, typeof setValue]
}