// Source Week 3, 2d_rune

// Tip: When testing, call show on the interpreter (right side) after running your programs;
//      Calling show on the left side may not work. 


// TASK 1:

//function fractal assumes that n is larger than 0.
function fractal(pic, n){
    return n === 1 ? pic : beside(pic, fractal(stackn(2, pic), n - 1));
}

// Testing
// show(fractal(make_cross(rcross_bb), 7));

// TASK 2:

function hook(frac) {
    return stack(black_bb,
                 quarter_turn_right(stack_frac(frac, black_bb, blank_bb)));
}

// Testing
// show(hook(1/5));

// TASK 3:

function spiral(gradient, n) {
    return n <= 0 ? blank_bb
                  : stack_frac(gradient, hook(1/2 * gradient),
                               quarter_turn_right(spiral(gradient, n-1)));
}

// Testing
// show(spiral(1/5, 3));