import NormJson from '@root/tools/norm_json'

function Import(validator, next) {
  let input = document.createElement('input')
  input.type = 'file'
  input.onchange = async () => {
    let file = input.files[0]
    let reader = new FileReader
    reader.onload = () => next(reader.result)

    if (validator) {
      let result = await validator(file)
      result && reader.readAsText(file)
    } else {
      reader.readAsText(file)
    }
  }
  input.click()
}

export function ImportJson(validator) {
  return new Promise(resolve => {
    Import(validator, data => {
      data = NormJson(data, { array_able: true })
      data && resolve(data)
    })
  })
}

export function ImportText(validator) {
  return new Promise(resolve => Import(validator, resolve))
}

function Export(name, data) {
  let a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob(['\ufeff', data]))
  a.download = name
  a.click()
}

export function ExportJson(name, data) {
  Export(name, JSON.stringify(data))
}

export function ExportText(name, data) {
  Export(name, data)
}

let head

function FormatHead(column, name) {
  column.forEach(i => {
    if (i.children) {
      FormatHead(i.children, name.concat(i.title))
    } else if (i.key) {
      i = JSON.parse(JSON.stringify(i))
      i.title = name.concat(i.title).join(' - ')
      head.push(i)
    }
  })
}

function FormatData(data) {
  return `"${String(data).replace(/"/g, '""')}"`
}

export function ExportCsv(option) {
  head = []
  FormatHead(option.head, [])
  ExportText(`${option.name}.csv`, [head.map(i => i.title), ...option.list.map(i => head.map(n => i[n.key]))].map(i => i.map(FormatData).join(',')).join('\r\n'))
}
