function reversedPyramidPattern(rows) {
    for (let i = rows -1; i >= 0; i--) {
      for(let j=i;j<rows-1;j++){
        process.stdout.write(" ");
      }

      for(let j=0;j<2*i+1;j++){
        process.stdout.write("*");
      }
      console.log();
    }
}
  
  reversedPyramidPattern(5);
  