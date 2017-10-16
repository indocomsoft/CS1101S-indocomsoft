// Source Week 4, curve

// TASK 1

// Part 1
// unit_line_at : Number -> Curve

// Part 2
function vertical_line(pt, length){
    return function(t){
        return make_point(x_of(pt), y_of(pt)+ t * length);
    };
}

// Part 3
// vertical_line : (Point, Number) -> Curve

// Part 4
// (draw_connected(200))(vertical_line(make_point(0.5, 0.25), 0.5));

// TASK 2

function three_quarters(pt){
   return function(t){
       return make_point(x_of(pt) - 1 + math_cos(3 / 2 * math_PI * t),
                         y_of(pt) + math_sin(3 / 2 * math_PI * t));
   };
}

// Test
// (draw_connected_squeezed_to_window(200))(three_quarters(make_point(0.5, 0.25)));

// TASK 3

function s_generator(pt){
    return function(t){
        return t <= 0.5 ? (three_quarters(pt))(2 * t)
                        : (three_quarters(make_point(x_of(pt), y_of(pt) - 2)))
                                 (-2 * t + 4 / 3);
    };
}

// Test
// (draw_connected_squeezed_to_window(200))(s_generator(make_point(0.5, 0.25)));