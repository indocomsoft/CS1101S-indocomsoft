// Source week 3, 3d_rune

// TASK 1

function steps(r1, r2, r3, r4){
    return overlay(overlay(translate(-1 / 2, -1 / 2, scale(1 / 2, r4)),
                           translate(-1 / 2, 1 / 2, scale(1 / 2, r3))),
                   overlay(translate(1 / 2, 1 / 2, scale(1 / 2, r2)),
                           translate(1 / 2, -1/ 2, scale(1 / 2, r1))));
}

// Test
// show(steps(rcross_bb, sail_bb, corner_bb, nova_bb));

// TASK 2

function tree(n, rune){
    function helper(count){
        return count > n ? rune
                         : overlay_frac(1 / n,
                                        scale(count / n, rune),
                                        helper(count + 1));
    }
    return helper(1);
}

// Test
// show(tree(4, circle_bb));