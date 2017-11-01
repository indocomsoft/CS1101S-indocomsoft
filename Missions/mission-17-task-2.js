// Source Week 10

/* M17 T2
 * Added code to:
 * 1. When encountering adjacent generator room:
 *    a. Remember the location if I do not have a keycard
 *    b. Move to it if I have a keycard
 * 2. Do a breadth-first search to find optimum path to take to find:
 *    a. The generator room once I have a keycard
 *    b. The nearest ServiceBot if I do not have the keycard 
 * 3. For the path created by BFS, check whether I am still following it
 *    If not, I have most likely been evacuated and respawned in a different
 *    location. Then re-do another BFS.
 * 4. For searching of ServiceBot, BFS during every turn since these bots
 *    move around and given the size of 4x4x4, BFS can be done every turn
 *    in reasonable time
 * 5. Avoid entering any ProtectedRoom if I don't have a KeyCard
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

// Helper functions
// Check if x is a defined index in an array
function isIndex(x, arr) {
    return arr[x] !== undefined;
}

// Breadth-First Search
// graph: list(room, room, ...)
// goal: function (node) { return ...; }
// start: room
function bfs(graph, goal, start) {
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

    // Attack in order of preference of
    // (1) ServiceBot and no KeyCard, (2) SecurityDrone
    function attack() {
        // Get the current location
        var here = self.getLocation();
        // Retrieve a list of charged weapons
        var charged_weapons = filter(isChargedWeapon, self.getPossessions());
        // Retrieve a list of keycards I own
        var my_keycards = filter(isSomething(Keycard), self.getPossessions());
        // Only attack if I have a charged weapon
        if (!is_empty_list(charged_weapons)) {
            // Find service bots in the same room
            var svcbots = filter(isSomething(ServiceBot), here.getOccupants());
            // Find security drones in the same room
            var secdrones = filter(isSomething(SecurityDrone),
                                               here.getOccupants());
            if (!is_empty_list(svcbots) && is_empty_list(my_keycards)) {
                // Attack a ServiceBot using a charged Weapon
                self.use(head(charged_weapons), svcbots);
            } else if (!is_empty_list(secdrones)) {
                // Attack a SecurityDrone using a charged Weapon
                self.use(head(charged_weapons), svcbots);
            } else { }
        } else { }
        // Retrieve a list of Keycards in the current room
        var keycards = filter(isSomething(Keycard), here.getThings());
        // Pick them all up if there is one
        if (!is_empty_list(keycards)) {
            self.take(keycards);
        } else { }
    }
    // Search for path towards the nearest instance of Thing obj
    function search_thing(obj) {
        self.path = bfs(self.visited,
                        function(x) {
                          return !is_empty_list(
                                     filter(isSomething(obj),
                                            x.getThings()));
                        }, self.getLocation());
    }
    // Search for path towards the nearest instance of Occupant obj
    // But avoid going into ProtectedRoom if we have no KeyCard
    function search_occupant(obj) {
        // Retrieve the list of keycards I own
        var my_keycards = filter(isSomething(Keycard), self.getPossessions());
        self.path = bfs(self.visited,
                        function(x) {
                           return !is_empty_list(filter(isSomething(ServiceBot),
                                                        x.getOccupants()))
                                   && (is_empty_list(my_keycards)
                                            ? !isSomething(ProtectedRoom)(x)
                                            : true);
                        }, self.getLocation());
    }
    
    attack();

    // Get the current location
    var here = self.getLocation();
    // Retrieve a list of neighbouring rooms
    var neighbours = here.getNeighbours();
    // Insert the current room into visited
    this.visited[here.getName()] = true;
    // make sure anonymous functions can access visited
    var visited = this.visited;
    var unvisited_neighbours = filter(function(x) {
                                          return !isIndex(x.getName(), visited);
                                      }, neighbours);
    // Retrieve the list of keycards I own
    var my_keycards = filter(isSomething(Keycard), this.getPossessions());

    // find out if one of them is ProtectedRoom
    var protectedroom = filter(isSomething(ProtectedRoom), neighbours);
    // find out if any of the ProtectedRoom contains generator(s)
    var genroom = filter(function(x) {
                            return !is_empty_list(filter(isSomething(Generator),
                                                         x.getThings()));
                         }, protectedroom);
    // If indeed we have found the generator room, remember it
    if (!is_empty_list(genroom)) {
        this.genRoomName = head(genroom).getName();
    } else { }


    // Conditionals for which next room to take.
    // If I have a keycard
    if (!is_empty_list(my_keycards)) {
        // If I neighbour at least a generator room
        if (!is_empty_list(genroom)) {
            this.moveTo(head(genroom));
        // If I neighbour at least one protected room and I have a keycard
        // Fulfilling requirement of M17 T2 and requirement of M16
        } else if (!is_empty_list(protectedroom)) {
            this.moveTo(head(protectedroom));
        // If we have a path to follow and we are still on track
        } else if (length(this.path) > 1 && here === head(this.path)) {
            // Proceed to the next room in the path
            this.path = tail(this.path);
            this.moveTo(head(this.path));
            // TOO MANY ERRORS? 91% SCANNED ONLY?
            // I HAVE TO DEBUG THE CALL STACK OF THIS PROGRAMME TO 100%
            // WHEN I HAVE ERRORS NO MATTER WHAT. WORK HARDER!
        } else {
            // BFS towards the generator room
            search_thing(Generator);
            // Move myself to the next location in the path
            this.moveTo(head(this.path));
        }
    // If I do not have a keycard
    } else {
        // Move towards the nearest ServiceBot and attack
        // BFS towards the nearest ServiceBot
        // but avoid entering ProtectedRoom since we do not yet have a keycard
        search_occupant(ServiceBot);
        // Move myself to the next location in the path
        this.moveTo(head(this.path));
        // ATTACK!
        attack();
    }
};


// Uncomment the following to test
// var newPlayer = new icsbot(shortname);
// test_task(newPlayer);