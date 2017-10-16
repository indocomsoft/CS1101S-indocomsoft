// Mission Sidequest 2.1: Runic Carpets

// Source Week 3, rune_2d

// Task 1:
// Write a function that takes in a rune and a number and returns an image
// such that the rune is placed in the center with the rune repeated n times
// along all 4 borders

function persian(rune, count) {
    var horizontal_border = border(rune, count);
    var qtr_centre_border = border(quarter_turn_right(rune), count - 2);
    var centre_content = make_cross(rune);
    var centre = quarter_turn_left(stack_border_content(count,
                                                        qtr_centre_border,
                                                        centre_content));
    return stack_border_content(count, horizontal_border, centre);
}

// Tests
// show(persian(nova_bb, 7));
// show(persian(make_cross(rcross_bb), 8));