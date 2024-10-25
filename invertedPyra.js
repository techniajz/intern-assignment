function printInvertedPyramid(n) {
    for (let i = n; i >= 1; --i) {
      let line = '';
  
      for (let k = 0; k < n - i; ++k) {
        line += '  ';
      }

      for (let j = i; j <= 2 * i - 1; ++j) {
        line += '* ';
      }

      for (let j = 0; j < i - 1; ++j) {
        line += '* ';
      }
      console.log(line);
    }
  }

  const n = 5; 
  printInvertedPyramid(n);
  