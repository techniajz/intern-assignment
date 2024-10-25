//Question5 - Convert a time from 24hr format to 12hr format with AM?PM

function convertHours(currDate){
    let hours = currDate.getHours();

    if(hours>12){
        hours -= 12;
    }
    else if(hours==0){
        hours == 12;
    }

    return hours;
}