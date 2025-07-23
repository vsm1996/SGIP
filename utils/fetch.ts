import { useEffect, useState } from "react"
import apiClient from "@/services/api-client"
import { AxiosResponse, CanceledError } from "axios"

export const useFetch = () => {
  const [posts, setPosts] = useState<any>([])
  const [error, setErrorMessage] = useState<any>()

  useEffect(() => {
    apiClient
      .get('/post')
      .then(async (res: AxiosResponse) => {
        const newData = await res.data.reverse()
        setPosts(newData)
      })
      .catch((err) => {
        if (err instanceof CanceledError) return
        console.log(err.response)
        setErrorMessage(err.response?.data.error)
      })
  }, []
  )

  return { posts, error }
}