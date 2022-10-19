export default function(source, length, is_full) {
  let list = []

  source = JSON.parse(JSON.stringify(source))

  if (is_full) while (source.length % length) source.push('')

  while (source.length) list.push(source.splice(0, length))

  return list
}
