# tag-builder

> A simple tag builder which isn't specific to any markup language

## Installation

`npm install @wmfs/tag-builder`

## Examples

```js
const builder = new TagBuilder()

builder.addTag('!doctype html', { includeClosingTag: false })

const html = builder.addTag('html')

html.addChildTag('head').content('HEAD CONTENT')
html.addChildTag('body').content('BODY CONTENT')

const template = builder.compile()
// template will be '<!doctype html><html><head>HEAD CONTENT</head><body>BODY CONTENT</body></html>'
```


```js
class CustomTagNode extends TagBuilder.TagNode {
  getDataPath () {
    return 'data'
  }

  bindToModel (element, modifier) {
    const attributeName = modifier ? `v-model.${modifier}` : 'v-model'
    const dataPath = `${this.getDataPath(element)}.${element.id}`
    this.addAttribute(attributeName, dataPath)
    return this
  }
}

const builder = new TagBuilder({ TagNode: CustomTagNode })

const div = builder.addTag('div')
const input = div.addChildTag('v-input').bindToModel({ id: 'name' })

const dataPath = input.getDataPath()
// dataPath = 'data'

const template = builder.compile()
// template = '<div><q-input v-model="data.name"></q-input></div>'
```