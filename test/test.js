/* eslint-env mocha */

const chai = require('chai')
const expect = chai.expect

const TagBuilder = require('./../lib')

describe('Tag Builder', () => {
  it('simple test 1', () => {
    const builder = new TagBuilder()

    builder.addTag('!doctype html', { includeClosingTag: false })

    const html = builder.addTag('html')

    html.addChildTag('head').content('HEAD CONTENT')
    html.addChildTag('body').content('BODY CONTENT')

    const template = builder.compile()

    expect(template).to.eql('<!doctype html><html><head>HEAD CONTENT</head><body>BODY CONTENT</body></html>')
  })

  it('simple test 2', () => {
    const builder = new TagBuilder()

    const ul = builder
      .addTag('ul')
      .addAttribute('class', 'bordered')

    ul.addChildTag('li').content('List item 1')
    ul.addChildTag('li').content('List item 2')
    ul.addChildTag('li').content('List item 3')

    const template = builder.compile()
    expect(template).to.eql('<ul class="bordered"><li>List item 1</li><li>List item 2</li><li>List item 3</li></ul>')
  })

  it('extending TagNode', () => {
    const builder = new TagBuilder()

    builder.TagNodeBuilder.prototype.getDataPath = function () { return 'data' }
    builder.TagNodeBuilder.prototype.bindToModel = function (element, modifier) {
      const attributeName = modifier ? `v-model.${modifier}` : 'v-model'
      const dataPath = `${this.getDataPath(element)}.${element.id}`
      this.addAttribute(attributeName, dataPath)
      return this
    }

    const div = builder.addTag('div')
    const input = div.addChildTag('q-input').bindToModel({ id: 'name' })

    const dataPath = input.getDataPath()
    expect(dataPath).to.eql('data')

    const template = builder.compile()
    expect(template).to.eql('<div><q-input v-model="data.name"></q-input></div>')
  })

  it('extending TagNode 1', () => {
    class ComponentBuilder extends TagBuilder {
      constructor (element, options) {
        super()

        this.TagNodeBuilder.prototype.getDataPath = function () { return 'data' }
        this.TagNodeBuilder.prototype.bindToModel = function (element, modifier) {
          const attributeName = modifier ? `v-model.${modifier}` : 'v-model'
          const dataPath = `${this.getDataPath(element)}.${element.id}`
          this.addAttribute(attributeName, dataPath)
          return this
        }

        if (element) this.showWhen = element.showWhen
        if (options) this.disableShowWhen = options.disableShowWhen || false
      }

      compile () {
        let template = ''

        if (this.showWhen && !this.disableShowWhen) template += `<template v-if="${this.showWhen}">`

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

        if (this.showWhen && !this.disableShowWhen) template += '</template>'

        return template
      }
    }

    const builder = new ComponentBuilder({}, {})

    const div = builder.addTag('div')
    const input = div.addChildTag('q-input').bindToModel({ id: 'name' })

    const dataPath = input.getDataPath()
    expect(dataPath).to.eql('data')

    const template = builder.compile()
    expect(template).to.eql('<div><q-input v-model="data.name"></q-input></div>')
  })
})
