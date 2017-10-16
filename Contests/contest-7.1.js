// Source Week 5, curve

// Your submission here
function julius_curve_contest_0(){
    // draw_connected_squeezed_to_window 200
    return function(t){
        var t2 = t * 2 * math_PI;
        return make_point(16 * math_pow(math_sin(t2), 3),
                          13 * math_cos(t2) - 5 * math_cos(2 * t2) - 2 * math_cos(3 * t2) - math_cos(4 * t2));
    };
}

function julius_curve_contest_1(){
    // draw_connected_squeezed_to_window 2000
    return function(t){
        var t2 = t * 12 * math_PI;
        var a = math_exp(math_cos(t2)) - 2 * math_cos(4 * t2) - math_pow(math_sin(t2 / 12), 5);
        return make_point(math_sin(t2) * a,
                          math_cos(t2) * a);
    };
}

function julius_curve_contest_2(){
    // draw_connected_squeezed_to_window 2000
    return function(t){
        var t2 = (t + 1/12) * 6 * math_PI;
        return make_point(t2 - 1.6 * math_cos(24 * t2),
                          t2 - 1.6 * math_sin(25 * t2));
    };
}


