// Source Week 4, curve

// Task 1
var test_curve = function(t) {
    return make_point(t, 0.5 + (math_sin(4 * (math_PI * t)) / 2));
};

function stack(c1, c2){
    function scale_xy(x_factor, y_factor){
        return function(curve){
            return function(t){
                var ct = curve(t);
                return make_point(x_factor * x_of(ct), y_factor * y_of(ct));
            };
        };
    }
    var scale_half_y = scale_xy(1, 0.5);
    return connect_rigidly((translate(0, 0.5))(scale_half_y(c1)),
                           scale_half_y(c2));
}

// Task 2
var test_curve = function(t) {
    return make_point(t, 0.5 + (math_sin(4 * (math_PI * t)) / 2));
};

function stack_frac(frac, c1, c2){
    function scale_xy(x_factor, y_factor){
        return function(curve){
            return function(t){
                var ct = curve(t);
                return make_point(x_factor * x_of(ct), y_factor * y_of(ct));
            };
        };
    }
    return connect_rigidly((translate(0, 1 - frac))((scale_xy(1, frac))(c1)),
                           (scale_xy(1, 1 - frac))(c2));
}

