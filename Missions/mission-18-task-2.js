// Source Week 10

/* M18 T2
 * 
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
// graph: list(room, room, ...)
// goal: function (node) { return ...; }
// start: room
function bfs(goal, start) {
    // To construct the path to follow to reach the node where goal returns true
    function construct_path(last_node) {
        // Initialise with empty path, unknown parent, and last node as child
        var path = pair(last_node, []);
        // STOP SAYING I NEED NOT INITIALIZE TO UNDEFINED, YOU LITTLE PIECE OF
        // ... SOFTWARE!
        // YOU THROW ERROR EVERYTIME I DO AN ASSIGNMENT WITHOUT DECLARATION
        // OR DECLARATION WITHOUT INITIAL VALUE
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
        // FFS IT'S NOT A BLOODY LOOP
        // STOP SAYING RANDOM THINGS AND START MAKING SENSE
        var filtered = filter(function(x) {
                                  return !isIndex(x.getName(), visited);
                              }, parent_neighbours);
        // Enqueue them into to_visit and mark down their parent to meta
        // AGAIN? YOU THINK WHAT? I STUPID ISIT?
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
        // Initialize variables to prevent
        // "Error undefined at undefined, line undefined"
        var svcbots = undefined;
        var secdrones = undefined;
        var to_attack = undefined;
        // If I have a charged MeleeWeapon
        if (!is_empty_list(charged_melee)) {
            // Find service bots in the same room
            svcbots = filter(isSomething(ServiceBot), here.getOccupants());
            // Find security drones in the same room
            secdrones = filter(isSomething(SecurityDrone),
                                               here.getOccupants());
            // Avoid attacking ServiceBot if I already have a KeyCard so as not
            // to aggravate them and spawn even more SecurityDrones
            // to_attack = (is_empty_list(my_keycards)
            //                     ? svcbots
            //                     : append(svcbots, secdrones));
            to_attack = append(svcbots, secdrones);
            self.use(head(charged_melee), to_attack);
        } else { }
        // If I have a charged RangedWeapon
        if (!is_empty_list(charged_ranged)) {
            var cur_ranged = head(charged_ranged);
            svcbots = enum_obj_dir(ServiceBot, cur_ranged.getRange());
            secdrones = enum_obj_dir(SecurityDrone, cur_ranged.getRange());
            // Avoid attacking ServiceBot if I already have a KeyCard so as not
            // to aggravate them and spawn even more SecurityDrones
            // to_attack = (is_empty_list(my_keycards)
            //                     ? svcbots
            //                     : append(svcbots, secdrones));
            to_attack = append(svcbots, secdrones);
            self.use(cur_ranged, to_attack);
        } else { }

        // If I have a charged SpellWeapon
        if (!is_empty_list(charged_spell)) {
            var cur_spell = head(charged_spell);
            var dir = find_optimum_dir(cur_spell.getRange());
            self.use(cur_spell, dir);
        } else { }

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
                                            x.getThings()))
                                 && (is_empty_list(my_keycards)
                                            ? !isSomething(ProtectedRoom)(x)
                                            : true);
                        }, self.getLocation());
    }
    // Search for path towards the nearest instance of Occupant obj
    // But avoid going into ProtectedRoom if we have no KeyCard
    function search_occupant(obj) {
        // Retrieve the list of keycards I own
        var my_keycards = filter(isSomething(Keycard), self.getPossessions());
        self.path = bfs(function(x) {
                           return !is_empty_list(filter(isSomething(ServiceBot),
                                                        x.getOccupants()))
                                   && (is_empty_list(my_keycards)
                                            ? !isSomething(ProtectedRoom)(x)
                                            : true);
                        }, self.getLocation());
    }
    // Enumerate Occupant obj in a specified range
    
    attack();

    // Get the current location
    var here = self.getLocation();
    // Retrieve a list of neighbouring rooms
    var neighbours = here.getNeighbours();
    // Insert the current room into visited
    self.visited[here.getName()] = true;
    var unvisited_neighbours = filter(function(x) {
                                          return !isIndex(x.getName(),
                                                          self.visited);
                                      }, neighbours);
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
    if (!is_empty_list(my_keycards)) {
        // If I neighbour at least a generator room
        if (!is_empty_list(genroom)) {
            var move_target = head(genroom);
        // If I neighbour at least one protected room and I have a keycard
        // Fulfilling requirement of M17 T2 and requirement of M16
        } else if (!is_empty_list(protectedroom)) {
            var move_target = head(protectedroom);
            // TOO MANY ERRORS? 91% SCANNED ONLY?
            // I HAVE TO DEBUG THE CALL STACK OF THIS PROGRAMME TO 100%
            // WHEN I HAVE ERRORS NO MATTER WHAT. WORK HARDER!
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
        // BFS towards the nearest ServiceBot
        search_occupant(ServiceBot);
        // Move myself to the next location in the path
        var move_target = head(self.path);
    }
    self.moveTo(move_target);
    attack();
};

// Uncomment the following to test
// var newPlayer = new icsbot(shortname);
// test_task2(newPlayer);