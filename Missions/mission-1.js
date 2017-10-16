// Source Week 3, rune_2d

// TASK 1

// Hello, my name is Julius!

/* One interesting fact about me is that
 * my first computer was a Pentium II 233 Mhz
 * running MS-DOS 6.22
 */



// TASK 2

function mosaic(picture1, picture2, picture3, picture4) {
    //Arranging them to:
    // picture4 picture1
    // picture3 picture2
    return stack(beside(picture4,picture1),
                 beside(picture3,picture2));
}

// Test
show(mosaic(rcross_bb, sail_bb, corner_bb, nova_bb));

// TASK 3

function upside_down_mosaic(picture1, picture2, picture3, picture4) {
    return turn_upside_down(mosaic(picture1,picture2,picture3,picture4));
}

// Test
show(upside_down_mosaic(rcross_bb, sail_bb, corner_bb, nova_bb));

// TASK 4

function julius(p1, p2, p3, p4, transform) {
    return transform(mosaic(p1,p2,p3,p4));
}

// Test
show(julius(rcross_bb, sail_bb, corner_bb, nova_bb, make_cross));