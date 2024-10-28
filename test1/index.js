function convertString(input) {
    let words = input.replaceAll('_', ' ').trim(); 
    words.charAt(0).toUpperCase();
    for(let char in words){
        if(char==' '){
            
        }
    }
    return words.toUpperCase() + words.slice(1); 
  }
  
  let str = "  my_name_is_xyz.  ";
  console.log(convertString(str));
  