export const mockImgSrc = [
  'https://static01.nyt.com/newsgraphics/2016/08/14/men-100-meters-bolt-horizontal/09c0dfe010da583c01f23709a11f6153e10cbb7b/bolt-100m-race-a3698x450.jpg',
]

export const mockImgSrcs = Array.apply(null, Array(5)).map(() => {
  const min = 50
  const max = 500
  const height = Math.floor(Math.random() * (max - min + 1)) + min
  const width = Math.floor(Math.random() * (max - height + 1)) + height
  return `https://picsum.photos/${width}/${height}`
})
