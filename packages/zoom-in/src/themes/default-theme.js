const defaultTheme = {
  image: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  overlay: {
    background: '#fff',
    opacity: 1,
    zIndex: 1,
  },
  caption: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.34,
    color: '#000',
    fontFamily: '',
    showCaptionWhenZoomOut: false,
  },
  zoomOptions: {
    transitionDuration: 300,
    transitionFunction: 'cubic-bezier(0.2, 0, 0.2, 1)',
    scrollOffset: 10,
  },
  frame: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
}

export default defaultTheme
