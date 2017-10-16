// Source Week 5, curve

// Task 1
/*
1) Yes, it does. Using the substitution model, ct is equivalent to curve(t).
Hence, x_of(ct) and y_of(ct) are equivalent to x_of(curve(t)) and
y_of(curve(t)) respectively. Hence, pixel_rotate and rotate_around_origin are
equivalent functions which work and achieve the same purpose.

2) Each gosperize function call invokes either the function
rotate_around_origin or pixel_rotate. Each time function rotate_around_origin
is invoked, curve(t) is called only once. However,  each time function
pixel_rotate is invoked, curve(t) is called twice. Inspecting function
gosper_curve, it would iteratively calls function gosperize, level times,
using the output at a level as the input for the next level.

Hence, for the case function gosper_curve uses rotate_around_origin:
gosper_curve(1) results in curve(t) being called once in total.
gosper_curve(2) results in curve(t) being called twice in total.
gosper_curve(3) results in curve(t) being called thrice in total.
Therefore, it can be generalised that gosper_curve(level) using
rotate_around_origin results in curve(t) being called level times in total.
Thus, in this case gosper_curve is a process whose time is linear in the level.

However, for the case function gosper_curve uses pixel_rotate:
gosper_curve(1) results in curve(t) being called twice in total.
gosper_curve(2) results in curve(t) being called four times in total.
gosper_curve(3) results in curve(t) being called eight times in total.
Therefore, it can be generalised that gosper_curve(level) using pixel_rotate
results in curve(t) being called 2^level times in total. Thus, in this case
gosper_curve is a process whose time is exponential in the level.
*/

// Task 2
function dragonize(n, curve) {
    if(n === 0) {
        return curve;
    } else {
        var c = dragonize(n - 1, curve);
        return put_in_standard_position(connect_ends
                   ((rotate_around_origin(-math_PI / 2))(c), invert(c)));
    }
}

function invert(curve) {
    return function(t) {
               return curve(1 - t);
           };
}

function connect_ends(curve1, curve2){
    var curve1_end = curve1(1);
    var curve2_start = curve2(0);
    var translated_curve2 = (translate(x_of(curve1_end) - x_of(curve2_start),
                                       y_of(curve1_end) - y_of(curve2_start)))
                            (curve2);
    return connect_rigidly(curve1, translated_curve2);
}

// Test
//(draw_connected_squeezed_to_window(1000))(dragonize(200, unit_line));
