const TagNode = require('./TagNode')

class TagBuilder {
  constructor () {
    this.rootTags = []
    this.TagNodeBuilder = TagNode
  }

  addTag (tagName, options) {
    const tagNode = new this.TagNodeBuilder(tagName, options)
    this.rootTags.push(tagNode)
    return tagNode
  }

  compile () {
    let template = ''

    function processTagArray (rootTags) {
      rootTags.forEach(tag => {
        let line = `<${tag.name}${tag.attributes.length > 0 ? ` ${tag.attributes.join(' ')}` : ''}>`

        if (tag.tagContent !== null) {
          line += tag.tagContent
        }

        template += line

        processTagArray(tag.childTags)

        if (tag.options.includeClosingTag) {
          template += `</${tag.name}>`
        }
      })
    }

    processTagArray(this.rootTags)

    return template
  }
}

module.exports = TagBuilder
