function convertHours(currDate) {
    let hours = currDate.getHours();
    let minutes = currDate.getMinutes();
    if (hours > 12) {
        hours -= 12; 
    } else if (hours === 0) {
        hours = 12; 
    }
    return { hours, minutes }; 
}

const date = new Date();
const { hours: hrs, minutes: min } = convertHours(date); 
console.log(`Curr time is: ${hrs}:${min}min`);
 