// Source Week 10

/* M18 T2
 * Changing the code at the next room conditional to arm the bomb when moving
 * to Generator room, and then flee.
 * Fleeing mode: search for nearest service bot outside the bomb range.
 * Failing that, search for nearest drone. Failing that, if inside the bomb
 * range, move outside the bomb range. If already outside the bomb range, move
 * randomly.
*/


//-------------------------------------------------------------------------
// Customization
//  - You can personalize your character by setting the following values
//-------------------------------------------------------------------------
var shortname   = "ics";

// Queue data structure
function make_queue() {
    return pair([], []);
}

function is_empty_queue(q) {
    return is_empty_list(head(q));
}

function enqueue(q, item) {
    if (is_empty_queue(q)) {
        set_head(q, pair(item, []));
        set_tail(q, head(q));
    } else {
        set_tail(tail(q), pair(item, []));
        set_tail(q, tail(tail(q)));
    }
}

function dequeue(q) {
    var front = head(head(q));
    set_head(q, tail(head(q)));
    return front;
}

function peek(q) {
    return head(head(q));
}

// Helper functions
// Check if x is a defined index in an array
function isIndex(x, arr) {
    return arr[x] !== undefined;
}

// Breadth-First Search
// goal: function (node) { return ...; }
// start: room
// room_condition: function (node) { return ...; }
function bfs(goal, start, room_condition) {
    // To construct the path to follow to reach the node where goal returns true
    function construct_path(last_node) {
        // Initialise with empty path, unknown parent, and last node as child
        var path = pair(last_node, []);
        // Preventing "Error undefined at undefined, line undefined"
        var parent = undefined;
        var child = last_node;
        // When we have not reached starting point
        while(child !== start) {
            // Find the parent in meta
            parent = meta[child.getName()];
            // Insert it in path
            path = pair(parent, path);
            // set parent as the new child for the next iteration
            child = parent;
        }
        return tail(path);
    }
    // A queue to store which nodes to visit next
    var to_visit = make_queue();
    // A list to store visited nodes
    var visited = [];
    // A dictionary to maintain parent info used for path formation
    var meta = [];
    // Start is the end of the path which has no parent
    meta[start.getName()] = [];
    
    // First to search is start
    enqueue(to_visit, start);

    // Initialise variables
    // to prevent "Error undefined at undefined, line undefined"
    // Those interpreter warnings on the side that says this is not needed
    // is lying! SAD! FAKE NEWS!
    var parent_node = undefined;
    var parent_neighbours = undefined;

    // When not all nodes have been visited
    while (!is_empty_queue(to_visit)) {
        // Get the front of the queue
        parent_node = dequeue(to_visit);
        // If this fulfills the goal
        if (goal(parent_node)) {
            // Return path constructed with current node as the last node
            return construct_path(parent_node);
        } else { }

        // Extract the node's neighbours
        parent_neighbours = parent_node.getNeighbours();
        // Find out which neighbour nodes have not been visited
        // and fulfills room_condition
        var rc = room_condition;
        var filtered = filter(function(x) {
                                  return !isIndex(x.getName(), visited)
                                          && rc(x);
                              }, parent_neighbours);
        // Enqueue them into to_visit and mark down their parent to meta
        for_each(function(x) {
                     enqueue(to_visit, x);
                     meta[x.getName()] = parent_node;
                 }, filtered);
        // Mark the current parent node as visited
        visited[parent_node.getName()] = true;
    }
    // If we cannot find anything (unlikely)
    return [];
}




//-------------------------------------------------------------------------
// icsbot
//-------------------------------------------------------------------------

function icsbot(name){
    Player.call(this, name);
    // Path to follow, if any
    this.path = [];
    // Graph of traversed nodes
    this.visited = [];
    // Room name of generator room
    this.genRoomName = undefined;
    // Flag whether in fleeing mode
    this.fleeing = false;
    // Bomb armed
    this.bomb_armed = undefined;
    // Range of the Bomb armed
    this.bomb_range = undefined;
}
icsbot.Inherits(Player);
icsbot.prototype.__act = function(){
    Player.prototype.__act.call(this);

    // your solution here
    // Abstraction for is_instance_of
    var isSomething = function(obj) {
                          return function(x) {
                                     return is_instance_of(x, obj);
                                 };
                      };
    // A function to check if a given argument is a charged weapon
    var isChargedWeapon = function(x) {
                              return isSomething(Weapon)(x) && !x.isCharging();
                          };
    var isSecurityDrone = isSomething(SecurityDrone);
    // Allow subroutines to access this
    var self = this;

    // For RangedWeapon, enumerate all objects instances of obj within range
    function enum_obj_dir(obj, range) {
        var here = self.getLocation();
        function helper(exits, acc) {
            function help(dir, loc, count, acc) {
                if (count > range || !loc) {
                    return acc;
                } else {
                    var obj_there = filter(isSomething(obj), loc.getOccupants());

                    return help(dir,
                                loc.getExit(dir),
                                count + 1,
                                append(obj_there, acc));
                }
            }
            if (is_empty_list(exits)) {
                return acc;
            } else {
                var cur = head(exits);
                return helper(tail(exits), append(help(cur,
                                                       here.getExit(cur),
                                                       1,
                                                       []), acc));
            }
        }
        var obj_here = filter(isSomething(obj), here.getOccupants());
        return append(obj_here, helper(here.getExits(), []));
    }

    // For SpellWeapon, find optimum direction to shoot at
    // Includes the current room because, mission requirement
    // This is to account for when there is no bot/drone in range,
    // But there is a bot/drone in my room
    // If there is no good direction, return undefined
    function find_optimum_dir(range) {
        var here = self.getLocation();
        // max: pair(dir, no_killed)
        function helper(exits, max) {
            function help(dir, loc, count, acc) {
                if (count > range || !loc) {
                    return acc;
                } else {
                    var no_killed = length(filter(function(x) {
                                               return isSomething(ServiceBot)
                                                  || isSomething(SecurityDrone);
                                             }, loc.getOccupants()));
                    return help(dir,
                                loc.getExit(dir),
                                count + 1,
                                acc + no_killed);
                }
            }
            if (is_empty_list(exits)) {
                return head(max);
            } else {
                var cur = head(exits);
                // initial loc = here because, use SpellWeapon in any valid
                // direction would also kill any bot in my room.
                // This is to account for when there is no bot/drone in range,
                // But there is a bot/drone in my room
                var no_killed = help(cur, here, 1, 0);
                return helper(tail(exits), 
                              (tail(max) > no_killed ? max
                                                     : pair(cur, no_killed)));
            }
        }
        return helper(here.getExits(), pair(undefined, 0));
    }


    // Attack in order of preference of
    // (1) ServiceBot and no KeyCard, (2) SecurityDrone
    function attack() {
        // Get the current location
        var here = self.getLocation();
        // Retrieve a list of charged weapons
        var charged_weapons = filter(isChargedWeapon, self.getPossessions());
        // Enumerate charged weapons of each type
        var charged_melee = filter(isSomething(MeleeWeapon), charged_weapons);
        var charged_ranged = filter(isSomething(RangedWeapon), charged_weapons);
        var charged_spell = filter(isSomething(SpellWeapon), charged_weapons);
        // Retrieve a list of keycards I own
        var my_keycards = filter(isSomething(Keycard), self.getPossessions());
        // If I have charged MeleeWeapon
        for_each(function(x){
                    // Find service bots in the same room
                    var svcbots = filter(isSomething(ServiceBot),
                                         here.getOccupants());
                    // Find security drones in the same room
                    var secdrones = filter(isSomething(SecurityDrone),
                                           here.getOccupants());
                    var to_attack = append(svcbots, secdrones);
                    self.use(x, to_attack);
                 }, charged_melee);
        // If I have charged RangedWeapon
        for_each(function(x) {
                    var cur_ranged = x;
                    var svcbots = enum_obj_dir(ServiceBot, cur_ranged.getRange());
                    var secdrones = enum_obj_dir(SecurityDrone,
                                                 cur_ranged.getRange());
                    var to_attack = append(svcbots, secdrones);
                    self.use(cur_ranged, to_attack);   
                 }, charged_ranged);
        for_each(function(x) {
                    var cur_spell = x;
                    var dir = find_optimum_dir(cur_spell.getRange());
                    if (dir !== undefined) {
                        self.use(cur_spell, dir);
                    } else { }
                 }, charged_spell);

        // Retrieve a list of Keycards in the current room
        var keycards = filter(isSomething(Keycard), here.getThings());
        // Pick them all up if there is one
        if (!is_empty_list(keycards)) {
            self.take(keycards);
        } else { }
    }
    // Search for path towards the nearest instance of Thing obj
    // But avoid going into ProtectedRoom if we have no KeyCard
    function search_thing(obj) {
        // Retrieve the list of keycards I own
        var my_keycards = filter(isSomething(Keycard), self.getPossessions());
        self.path = bfs(function(x) {
                          return !is_empty_list(
                                     filter(isSomething(obj),
                                            x.getThings()));
                        }, self.getLocation(),
                        (is_empty_list(my_keycards)
                            ? function(x) {
                                return !isSomething(ProtectedRoom)(x); }
                            : function(x) { return true; }));
    }
    // Search for path towards the nearest instance of Occupant obj
    // But avoid going into ProtectedRoom if we have no KeyCard
    function search_occupant(obj) {
        // Retrieve the list of keycards I own
        var my_keycards = filter(isSomething(Keycard), self.getPossessions());
        self.path = bfs(function(x) {
                           return !is_empty_list(filter(isSomething(ServiceBot),
                                                        x.getOccupants()))
                                    && (self.fleeing
                                            ? not_within_bomb_range(x)
                                            : true);
                        }, self.getLocation(),
                        (is_empty_list(my_keycards)
                            ? function(x) {
                                return !isSomething(ProtectedRoom)(x); }
                            : function(x) { return true; }));
    }
    
    function not_within_bomb_range(room) {
        function helper(exits) {
            function help(dir, loc, count) {
                if (count > self.bomb_range || !loc) {
                    return false;
                } else if (loc === self.bomb_armed) {
                    return true;
                } else {
                    return help(dir, loc.getExit(dir), count + 1);
                }
            }
            if (is_empty_list(exits)) {
                return false;
            } else {
                var cur = head(exits);
                return help(cur, here, 1) ? true
                                          : helper(tail(exits));
            }
        }
        return !helper(room.getExits());
    }

    
    attack();

    // Get the current location
    var here = self.getLocation();

    // If we are in a generator room
    if (!is_empty_list(filter(isSomething(Generator), here.getThings()))) {
        self.fleeing = true;
        var bomb = filter(isSomething(Bomb), self.getPossessions());
        self.bomb_range = head(bomb).getRange();
        self.bomb_armed = head(bomb);
        self.use(head(bomb));
    } else { }

    // Retrieve a list of neighbouring rooms
    var neighbours = here.getNeighbours();
    // Insert the current room into visited
    self.visited[here.getName()] = true;
    // Retrieve the list of keycards I own
    var my_keycards = filter(isSomething(Keycard), self.getPossessions());

    // find out if one of them is ProtectedRoom
    var protectedroom = filter(isSomething(ProtectedRoom), neighbours);
    // find out if any of the ProtectedRoom contains generator(s)
    var genroom = filter(function(x) {
                            return !is_empty_list(filter(isSomething(Generator),
                                                         x.getThings()));
                         }, protectedroom);
    // If indeed we have found the generator room, remember it
    if (!is_empty_list(genroom)) {
        self.genRoomName = head(genroom).getName();
    } else { }


    // Conditionals for which next room to take.
    // If I have a keycard
    if (!is_empty_list(my_keycards) && !self.fleeing) {
        // If I neighbour at least a generator room
        if (!is_empty_list(genroom)) {
            var move_target = head(genroom);
        // If we have a path to follow and we are still on track
        } else if (length(self.path) > 1 && here === head(self.path)) {
            // Proceed to the next room in the path
            self.path = tail(self.path);
            var move_target = head(self.path);
        } else {
            // BFS towards the generator room
            search_thing(Generator);
            // Move myself to the next location in the path
            var move_target = head(self.path);
        }
    // If I do not have a keycard, move towards the nearest ServiceBot and attack
    } else {
        var my_keycards = filter(isSomething(Keycard), self.getPossessions());
        here = self.getLocation();
        // BFS towards the nearest ServiceBot (or if not fleeing, nearest
        // keycard because fleeing implies we have the bomb, thus we do not need
        // keycard anymore)
        self.path = bfs(function(x) {
                          return (self.fleeing
                                    ? false
                                    : !is_empty_list(
                                        filter(function(y) {
                                                 return isSomething(Keycard)(y);
                                               },
                                               x.getThings())))
                                || !is_empty_list(
                                     filter(function(y) {
                                              return isSomething(ServiceBot)(y);
                                            },
                                            x.getOccupants()))
                                && (self.fleeing
                                            ? not_within_bomb_range(x)
                                            : true);
                        }, self.getLocation(),
                        (is_empty_list(my_keycards)
                            ? function(x) {
                                return !isSomething(ProtectedRoom)(x); }
                            : function(x) { return true; })
                        // if we are fleeing and not within bomb range, then
                        // do not use any room within bomb range as a path
                        //
                        // otherwise, either we are not in fleeing mode
                        // or we are within bomb range. In both cases,
                        // we do not care if our path is within bomb range
                        // as long as we get to our objective (nearest keycard
                        // or servicebot in the former case, nearest servicebot
                        // outside bomb range in the latter case)
                        && ((self.fleeing && not_within_bomb_range(here))
                                ? not_within_bomb_range
                                : function(x) { return true; }));
        // If there isn't any
        if (is_empty_list(self.path)) {
            // BFS towards the nearest SecurityDrone
            search_occupant(SecurityDrone);
            // If there isn't any

            // If we're fleeing and within bomb range
            if (self.fleeing && !not_within_bomb_range(here)) {
                // BFS outside of bomb range if in fleeing mode.
                // Move randomly otherwise
                self.path = bfs(function(x) {
                                    return (self.fleeing
                                                ? not_within_bomb_range(x)
                                                : false); 
                                }, self.getLocation(),
                                function(x) { return true; });
            // if not in fleeing mode, then just move randomly
            } else if(is_empty_list(self.path)) {
                this.moveTo(list_ref(neighbours,
                            math_floor(math_random() * length(neighbours))));
            } else { }
        } else { }
        // Move myself to the next location in the path
        var move_target = head(self.path);
    }
    self.moveTo(move_target);
    attack();
};

// Uncomment the following to test
// var newPlayer = new icsbot(shortname);
// test_task2(newPlayer);