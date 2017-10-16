// Source Week 4

// Task 1: Koch curve

function connect_ends(curve1, curve2){
    var curve1_end = curve1(1);
    var curve2_start = curve2(0);
    var translated_curve2 = (translate(x_of(curve1_end) - x_of(curve2_start),
                                       y_of(curve1_end) - y_of(curve2_start)))
                            (curve2);
    return connect_rigidly(curve1, translated_curve2);
}

function kochize(level) {
    // kochize takes in level and outputs the function
    // that draws the koch curve at that level
    if (level === 0) {
        return unit_line;
    } else {
        var prev = kochize(level - 1);
        return (scale(1/3))
                 (connect_ends(prev,
                    connect_ends((rotate_around_origin(math_PI / 3))(prev),
                      connect_ends((rotate_around_origin(-math_PI / 3))(prev),
                                   prev))));
    }
}

function show_connected_koch(level, number_of_points) {
    return (draw_connected(number_of_points))(kochize(level));
}

// Test
// show_connected_koch(5, 4000);

// Task 2: Snowflake

// Hint: Make use of tools you have already learnt to draw out the 
// complete snowflake

function connect_ends(curve1, curve2){
    var curve1_end = curve1(1);
    var curve2_start = curve2(0);
    var translated_curve2 = (translate(x_of(curve1_end) - x_of(curve2_start),
                                       y_of(curve1_end) - y_of(curve2_start)))
                            (curve2);
    return connect_rigidly(curve1, translated_curve2);
}

function kochize(level) {
    // kochize takes in level and outputs the function
    // that draws the koch curve at that level
    if (level === 0) {
        return unit_line;
    } else {
        var prev = kochize(level - 1);
        return (scale(1/3))
                 (connect_ends(prev,
                    connect_ends((rotate_around_origin(math_PI / 3))(prev),
                      connect_ends((rotate_around_origin(-math_PI / 3))(prev),
                                   prev))));
    }
}

var snowflake2 = kochize(5);
var snowflake1 = (rotate_around_origin(2 * math_PI / 3))(snowflake2);
var snowflake3 = (rotate_around_origin(-2 * math_PI / 3))(snowflake2);
var snowflake = connect_ends(snowflake1, connect_ends(snowflake2,
                                                      snowflake3));

// Test
// (draw_connected_full_view_proportional(10000))(snowflake);