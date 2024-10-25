let num = 5;
for (let i = num; i >= 1; i--) {
    for (let j = num - i; j > 0; j--) {
        process.stdout.write("  ");
    }
    for (let k = 0; k < 2 * i - 1; k++) {
        process.stdout.write("* ");
    }
    console.log();
}