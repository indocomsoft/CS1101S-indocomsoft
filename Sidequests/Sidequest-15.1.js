// Source Week 6

var grand_laser_angle = math_PI / 12;
var grand_laser_reach = 10000;

function get_name(ship) {
    return head(ship);
}
function get_x(ship) {
    return head(tail(ship));
}
function get_y(ship) {
    return head(tail(tail(ship)));
}
function get_z(ship) {
    return head(tail(tail(tail(ship))));
}

function select_grand_laser_target(hostile_list, friendly_list) {
    function format(ships) {
        if (is_empty_list(ships)) {
            return "";
        } else {
            var cur = head(ships);
            return " ("  + get_name(cur) + "," + get_x(cur) + ","
                    + get_y(cur) + "," + get_z(cur) + ")"
                    + format(tail(ships));
        }
    }
    
    // returns true if a laser fire to ship1 will hit ship2.
    function will_hit(ship1, ship2) {
        var x1 = get_x(ship1);
        var y1 = get_y(ship1);
        var z1 = get_z(ship1);
        var x2 = get_x(ship2);
        var y2 = get_y(ship2);
        var z2 = get_z(ship2);
        var distance12 = math_sqrt(math_pow(x1 - x2, 2)
                                   + math_pow(y1 - y2, 2)
                                   + math_pow(z1 - z2, 2));
        var distance1 = math_sqrt(math_pow(x1, 2) + math_pow(y1, 2)
                                  + math_pow(z1, 2));
        var distance2 = math_sqrt(math_pow(x2, 2) + math_pow(y2, 2)
                                  + math_pow(z2, 2));
        // Use cosine rule to find the distance
        var angle = math_acos((math_pow(distance1, 2) + math_pow(distance2, 2)
                               - math_pow(distance12, 2))
                               / (2 * distance1 * distance2));
        //display(format(list(ship1, ship2)) + ", angle_diff:" + angle + "vs " + grand_laser_angle);
        return distance1 <= grand_laser_reach && distance2 <= grand_laser_reach
               && angle <= grand_laser_angle;
    }
    
    function collateral(ship, ships_list) {
        if (is_empty_list(ships_list)) {
            return [];
        } else {
            var cur = head(ships_list);
            var will_hit_cur = will_hit(ship, cur);
            return will_hit_cur ? pair(cur, collateral(ship, tail(ships_list)))
                                : collateral(ship, tail(ships_list));
        }
    }
    
    function helper(best, hostile_ships) {
        if (is_empty_list(hostile_ships)) {
            return is_pair(best) ? get_name(head(best)) : "none";
        } else {
            var cur = head(hostile_ships);
            var hostile_dead = collateral(cur, hostile_list);
            var friendly_dead = collateral(cur, friendly_list);
            display("Target:" + format(list(cur))
                    + "\nHostiles in area of effect:" + format(hostile_dead)
                    + "\nFriends in area of effect:" + format(friendly_dead));
            var no_of_hostile_dead = length(hostile_dead);
            var cur_best = (best === "none" ? 0 : tail(best));
            if (is_empty_list(friendly_dead) && no_of_hostile_dead > cur_best) {
                return helper(pair(cur, no_of_hostile_dead),
                              tail(hostile_ships));
            } else {
                return helper(best, tail(hostile_ships));
            }
            
        }
    }
    
    return helper("none", hostile_list);
}

// Test

select_grand_laser_target(
    list(list("TIE0001", 890, 700, 906),
         list("TIE0002", 895, 740, 912),
         list("TIE0003", -5634, -102, 8589)),
    list(list("XW0121", 862, 713, 999))
);

/*
select_grand_laser_target(
    list(list("TIE0001", 890, 700, 906),
         list("TIE0002", 895, 740, 912),
         list("TIE0012", 895, 1040, 912),
         list("TIE0003", -564, -192, 8589),
         list("TIE0006", -1, 0, 0),
         list("TIE0004", -895, 740, 912),
         list("TIE0005", -895, 540, 912)),
    list(list("XW0121", -862, 713, 999),
         list("XW0122", 862, 713, 999),
         list("XW0123", -862, 50, 100))
);
*/