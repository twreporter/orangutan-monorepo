import { useState } from 'react'

export default initialValue => {
  const [imageLinks, setImageLink] = useState(initialValue)

  return {
    imageLinks,
    addImageLink: link => {
      setImageLink([...imageLinks, link])
    },
    deleteImageLink: imageIndex => {
      const newImageLinks = imageLinks.filter(
        (e, index) => index !== imageIndex
      )
      setImageLink(newImageLinks)
    },
  }
}
