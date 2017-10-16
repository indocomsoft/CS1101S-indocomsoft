// Source Week 5, curve

// Task 1
// Useful functions that you might need:

function compose (f, g) {
    return function (x) {
        return f(g(x));
    };
}

function identity(x) {
    return x; 
    
}

function repeated(f, n) {
    if (n === 0) {
        return identity;
    } else {
        return compose(f, repeated(f, n - 1));
    }
}

// Task 1
function arc(t){
    return make_point(math_sin(math_PI * t),
                      math_cos(math_PI * t));
}

function show_points_gosper(level, number_of_points, initial_curve){
    return (draw_points_on(number_of_points))
            ((squeeze_rectangular_portion(-0.5, 1.5, -0.5, 1.5))
                ((repeated(gosperize, level)) (initial_curve)));
}

// testing
//show_points_gosper(7, 1000, arc);
//show_points_gosper(5, 500, arc);

// Task 2
// Task 2

function your_param_gosper(level, angle_at){
    if (level === 0) {
        return unit_line;
    } else {
        return (your_param_gosperize(angle_at(level)))
                        (your_param_gosper(level - 1, angle_at));
    }
}

function your_param_gosperize(theta){
    return function(curve){
        return put_in_standard_position(
                     connect_ends((rotate_around_origin(theta))(curve),
                                  (rotate_around_origin(-theta))(curve)));
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

// testing
//(draw_connected(200))(your_param_gosper(10, function(n){ return math_PI / (n + 2); }));
//(draw_connected(200))(your_param_gosper(5, function(n){ return math_PI / 4 / math_pow(1.3, n); }));

// Task 3
// Task 3

//sample tests:
//(timed((timed(gosper_curve))(100)))(0.1);
//(timed((timed(param_gosper))(100, function(level){ return math_PI/4; })))(0.1);
//(timed((timed(your_param_gosper))(100, function(level){ return math_PI/4; })))(0.1);

/*
(timed((timed(gosper_curve))(100)))(0.1);
Runtime 1: Total Duration: 826ms
Runtime 2: Total Duration: 667ms
Runtime 3: Total Duration: 692ms
Runtime 4: Total Duration: 796ms
Runtime 5: Total Duration: 829ms
Average Total Duration: 762ms

(timed((timed(param_gosper))(100, function(level){ return math_PI/4; })))(0.1);
Runtime 1: Total Duration: 867ms
Runtime 2: Total Duration: 783ms
Runtime 3: Total Duration: 771ms
Runtime 4: Total Duration: 754ms
Runtime 5: Total Duration: 800ms
Average Total Duration: 795ms

(timed((timed(your_param_gosper))(100, function(level){ return math_PI/4; })))(0.1);
Runtime 1: Total Duration: 1143ms
Runtime 2: Total Duration: 1074ms
Runtime 3: Total Duration: 1103ms
Runtime 4: Total Duration: 997ms
Runtime 5: Total Duration: 943ms
Average Total Duration: 1052ms

It is apparent that gosper_curve is slightly faster than param_gosper
(by around 4%) while your_param_gosper is significantly slower than
param_gosper (by around 25%).

The slightly slower speed of param_gosper as compared to gosper_curve
is due to the param_gosper having to call angle_at during every call
of param_gosper as it recurses.

The significantly slower speed of your_param_gosper is due to it calling
functions connect_end and put_in_standard_position which involves many
evaluations of curve(t), translate, and scale. These additional
steps result in its abysmal performance in comparison to the other two
functions.
*/