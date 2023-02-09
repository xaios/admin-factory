export default function(num, next) {
  if (num) {
    let load = 0
    return () => ++load === num && next()
  } else {
    next()
  }
}
