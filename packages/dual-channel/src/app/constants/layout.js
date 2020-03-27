export const mockupScreenWidth = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  hd: 1440,
}

const mockupArticleContainerWidth = {
  mobile: 327,
  tablet: 500,
  desktop: 380,
  hd: 426,
}

export const articleContainerWidth = {
  mobile: `${(mockupArticleContainerWidth.mobile / mockupScreenWidth.mobile) *
    100}%`,
  tablet: `${(mockupArticleContainerWidth.tablet / mockupScreenWidth.tablet) *
    100}%`,
  desktop: `${mockupArticleContainerWidth.desktop}px`,
  hd: `${mockupArticleContainerWidth.hd}px`,
}

const mockupPageContainerWidth = {
  mobile: 337,
  tablet: 556,
  desktop: 664,
  hd: 700,
}

export const pageContainerWidth = {
  mobile: `${(mockupPageContainerWidth.mobile / mockupScreenWidth.mobile) *
    100}%`,
  tablet: `${mockupPageContainerWidth.tablet}px`,
  desktop: `${mockupPageContainerWidth.desktop}px`,
  hd: `${mockupPageContainerWidth.hd}px`,
}
