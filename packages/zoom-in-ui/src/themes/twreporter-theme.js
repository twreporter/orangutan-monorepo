const desktopTheme = {
  image: {
    marginTop: 32,
    marginLeft: 42,
    marginRight: 42,
    marginBottom: 15,
  },
  caption: {
    side: 'bottom',
    align: 'left',
    marginBottom: 24,
    width: 578,
  },
}

const hdTheme = {
  image: {
    marginTop: 32,
    marginLeft: 42,
    marginRight: 42,
    marginBottom: 15,
  },
  caption: {
    side: 'right',
    align: 'bottom',
    marginRight: 30,
    width: 265,
  },
}

const tabletTheme = {
  image: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 15,
  },
  caption: {
    side: 'bottom',
    align: 'left',
    marginLeft: 40,
    marginBottom: 24,
    marginRight: 30,
    width: 578,
  },
}

export default {
  desktop: desktopTheme,
  hd: hdTheme,
  tablet: tabletTheme,
}
