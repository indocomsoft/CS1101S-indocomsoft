// Source Week 5, curve

// Task 1
function reflect_through_y_axis(curve){
    return function(t){
        var ct = curve(t);
        return make_point(-x_of(ct), y_of(ct));
    };
}

// Task 2
// recommended to use connect_rigidly

function connect_ends(curve1, curve2) {
    var curve1_end = curve1(1);
    var curve2_start = curve2(0);
    var translated_curve2 = (translate(x_of(curve1_end) - x_of(curve2_start),
                                       y_of(curve1_end) - y_of(curve2_start)))
                            (curve2);
    return connect_rigidly(curve1, translated_curve2);
}