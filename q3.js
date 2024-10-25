str = "" //as patterns directly cant be displayed in console
for (let i = 1; i <= 5; i++) {
  for (let j = 1; j <= i; j++) {
    str += " "
  }
  for (let k = 10; k >= i * 2; k--) {
    str += "*"
  }
  str += "\n"
}
console.log(str)