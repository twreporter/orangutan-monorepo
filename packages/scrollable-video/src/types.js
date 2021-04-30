/**
 *
 *
 * @typedef {Object} Data
 * @property {AppProps} appProps
 * @property {Caption[]} captions
 * @property {Theme} theme
 * @property {Video} video
 */

/**
 * @typedef {Object} AppProps
 * @property {number} secondPerVh
 * @property {CaptionsSetting} captionsSetting
 */

/**
 * @exports
 * @typedef {Object} Caption
 * @property {string} text
 * @property {number} time - The time when this caption appears (seconds).
 * @property {'center'|'left'|'right'} xBoxAlign - The local horizontal alignment of the box of this caption. It will overwrite the global xBoxAlign.
 * @property {string} xPosition - The local horizontal position of this caption relative to viewport. It will overwrite the global xPosition.
 * @property {string} xOffset - The horizontal offset of this caption based on xPosition.
 * @property {'top'|'bottom'} yBoxAlign - The local vertical alignment of the box of this caption. It will overwrite the global yBoxAlign.
 * @property {string} yPosition - The local vertical position of this caption relative to viewport. It will overwrite the global yPosition.
 * @property {string} yOffset - The vertical offset of this caption based on yPosition.
 * @property {'left'|'center'|'right'|'justify'} textAlign - The local text alignment of this caption
 */

/**
 * @typedef {Object} Theme
 * @property {string} mq.mobileWidth 瀏覽者視窗在多少寬度以下時套用手機設定
 * @property {string} mq.captions.color 字幕的文字顏色
 * @property {string} mq.captions.fontWeight 字幕的字體粗細
 * @property {string} mq.captions.fontStyle 字幕的字體樣式
 * @property {string} mq.captions.fontFamily 字幕的字型清單
 * @property {string} mq.captions.fontSize 字幕的字型大小
 * @property {string} mq.captions.mobileFontSize 字幕的字型大小（手機時）
 * @property {string} mq.captions.link.color 字幕的超連結文字顏色
 * @property {string} mq.captions.link.underlineColor 字幕的超連結底線顏色
 * @property {string} mq.captions.box.width 字幕方塊寬度
 * @property {string} mq.captions.box.mobileWidth 字幕方塊寬度（手機時）
 * @property {string} mq.captions.box.spanPadding 字幕行方塊邊白（非手機時）
 * @property {string} mq.captions.box.mobilePadding 字幕方塊邊白（手機時）
 * @property {string} mq.captions.box.background 字幕方塊的底色
 * @property {string} mq.captions.lineHeight 字幕行高
 * @property {string} mq.captions.mobileLineHeight 字幕行高（手機時）
 */

/**
 * @typedef {Object} Video
 * @property {VideoSource[]} sources - The Sources of the video. The order matters. The browser will use the first source it support.
 */

/**
 * @typedef {Object} VideoSource
 * @property {string} type - The MIME media type of the resource. Ex: 'video/mp4'
 * @property {string} src - The address of the media resource
 * @property {number} maxWidth - The maximum width suitable for this source
 */

/**
 * @typedef {Object} CaptionsSetting
 * @property {string} xBoxAlign - The global horizontal alignment of the caption box. Must be one of 'left', 'center', or 'right'.
 * @property {string} xPosition - The global horizontal position of the captions relative to viewport.. Example:
      { xBoxAlign: 'left', xPosition: '50px' } means the position is 50px from the left edge of viewport to right
      { xBoxAlign: 'center', xPosition: '50px' } means the position is 50 px from the center of viewport to right
      { xBoxAlign: 'right', xPosition: '8.7%' } means the position is 8.7% (related to the section width) from the right edge of viewport to left
 * @property {string} yBoxAlign - The global vertical alignment. Must be one of 'bottom' or 'top'.
 * @property {string} yPosition - The global vertical position of the captions relative to viewport. Example:
      { yBoxAlign: 'top', yPosition: '50px' } means the position is 50px from the top edge of viewport to bottom
      { yBoxAlign: 'bottom', yPosition: '5%' } means the position is 5% (related to the section height, which is "viewport height * vhPerSecond * duration") from the bottom edge of viewport to top
 * @property {string} textAlign - The global text alignment of all captions
*/

export default {}
