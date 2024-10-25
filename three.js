//Question3 - write a Reversed Pyramid star pattern

let r = 5;
for (let i = r; i >= 1; i--) {
    for (let j = r - i; j > 0; j--) {
        process.stdout.write("  ");
    }
    for (let k = 0; k < 2 * i - 1; k++) {
        process.stdout.write("* ");
    }
    console.log();
}