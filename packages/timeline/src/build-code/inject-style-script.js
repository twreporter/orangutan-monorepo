import crypto from 'crypto'

const replaceMap = {
  '"': '\\"',
  "'": "\\'",
  '`': '\\`',
}

/**
 *
 *
 * @param {string} string
 * @returns {string} an escaped CSS string
 */
function escape(string) {
  return String(string).replace(/["'`]/g, matched => {
    return replaceMap[matched] || matched
  })
}

/**
 *
 *
 * @param {string} [styleTag=''] an HTML string containing <style>...</style> tags
 * @returns {string} an HTML string with JavaScript code that will inject <style> to <head>
 */
export function buildInjectStyleScript(styleTag = '') {
  const styleContent = styleTag
    .replace(/<\/?style.*?>/g, '') /* trim <style> and </style> tag */
    .replace(
      /\s+/g,
      ' '
    ) /* sequences of whitespace characters (including line breaks) will collapse into a single whitespace */
    .replace(/\/\*[\s\S]*?\*\/|(:)?\/\/.*/g, (fullMatch, capturingGroup1) =>
      capturingGroup1 ? fullMatch : ''
    ) /* remove comments */ /* replacement function with capturing group works as negative lookbehind */
  const styleHash = crypto
    .createHash('md5')
    .update(styleContent, 'utf8')
    .digest('hex')
  return `
<script>(function () {
var id = 'timeline-${styleHash}';
var target = document.getElementById(id);
if (!target) {
  try {
    var node = document.createElement('style');
    node.id = id;
    node.innerHTML = '${escape(styleContent)}';
    document.head.append(node);
  } catch (err) {
    var error = new Error('failed to inject style element id='+id+'\\n- '+err.message);
    console.error(error);
}}})()</script>
`
}
