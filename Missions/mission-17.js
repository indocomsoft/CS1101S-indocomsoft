// Source Week 10

//Task 1
//-------------------------------------------------------------------------
// Customization
//  - You can personalize your character by setting the following values
//-------------------------------------------------------------------------
var shortname   = "ics";
/* M17 T1 start*/
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
// Graph: list(pair(here, list(neighbour1, neighbour2, ...)), ...)
// Equivalently: list(pair(node, list(neighbours)))
// goal: function (node) { return ...; }
function bfs(graph, goal, start) {
    // To construct the path to follow to reach the node where goal returns true
    function construct_path(last_node) {
        // Initialise with empty path, unknown parent, and last node as child
        var path = [];
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
        // Remove the first element as it is the starting point itself
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
    var parent = undefined;
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
        var filtered = filter(function(x) {
                                  return !isIndex(x.getName(), visited);
                              }, parent_neighbours);
        // Enqueue them into to_visit and mark down their parent to meta
        for_each(function(x) {
                     enqueue(to_visit, x);
                     meta[x.getName()] = parent_node;
                 }, filtered);
        // Mark the current parent node as visited
        visited[parent_node.getName()] = true;
    }
    // If we cannot find anything
    return [];
}
/* M17 T1 end*/

//-------------------------------------------------------------------------
// icsbot
//-------------------------------------------------------------------------

function icsbot(name){
    Player.call(this, name);
    /* M17 T1 start*/
    // Path to follow, if any
    this.path = [];
    // Graph of traversed nodes
    this.visited = [];
    /* M17 T1 end*/

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
    /* M17 T1 begin*/
    var isSecurityDrone = isSomething(SecurityDrone);
    /* M17 T1 end*/
    
    // Get the current location
    var here = this.getLocation();
    // Retrieve a list of charged weapons
    var charged_weapons = filter(isChargedWeapon, this.getPossessions());
    
    // Only attack if I have a charged weapon
    if (!is_empty_list(charged_weapons)) {
        // Find service bots in the same room
        var svcbots = filter(isSomething(ServiceBot), here.getOccupants());
        /* M17 T1 begin*/
        // Find security drones in the same room
        var secdrones = filter(isSomething(SecurityDrone), here.getOccupants());
        /* M17 T1 end*/
        // Only attack if there is at least a service bot in the same room
        if (!is_empty_list(svcbots)) {
            // Attack a ServiceBot using a charged Weapon
            this.use(head(charged_weapons), svcbots);
        /* M17 T1 begin*/
        } else if (!is_empty_list(secdrones)) {
            // Attack a SecurityDrone using a charged Weapon
            this.use(head(charged_weapons), svcbots);
        /* M17 T1 end*/
        } else { }
    } else { }

    // Retrieve a list of Keycards in the current room
    var keycards = filter(isSomething(Keycard), here.getThings());
    // Pick them all up if there is one
    if (!is_empty_list(keycards)) {
        this.take(keycards);
    } else { }
    
    // Retrieve a list of neighbouring rooms
    var neighbours = here.getNeighbours();
    /* M17 T1 begin*/
    // Insert the current node into the visited
    this.visited[here.getName()] = true;
    // make sure anonymous functions can access visited
    var visited = this.visited;
    var unvisited_neighbours = filter(function(x) {
                                          return !isIndex(x.getName(), visited);
                                      }, neighbours);
    // Retrieve a list of keycards I own
    var my_keycards = filter(isSomething(Keycard), this.getPossessions());
    /* M17 T1 end*/

    // find out if one of them is ProtectedRoom
    var protectedroom = filter(function(x) {
                                   return is_instance_of(x, ProtectedRoom);
                               }, neighbours);
    /* M17 T1 begin*/ 
    // If we neighbour at least one protected room and we have a keycard
    if (!is_empty_list(protectedroom) && !is_empty_list(my_keycards)) {
        // Move to the protected room
        this.moveTo(head(protectedroom)); 
    // If we have a path to follow
    } else if (!is_empty_list(this.path)) {
        // Move myself to the next location in the path
        this.moveTo(head(this.path));
        // Proceed to the next location in the path
        this.path = tail(this.path);
    // If I have unvisited neighbour(s)
    } else if (!is_empty_list(unvisited_neighbours)) {
        // Choose arbitrarily: go to the first unvisited neighbour
        this.moveTo(head(unvisited_neighbours));
    } else {
        // Search for a path towards the next unvisited neighbour
        this.path = bfs(this.visited,
                        function(x) {
                            return !isIndex(x.getName(), visited);
                        } , here);
        // Move myself to the next location in the path
        this.moveTo(head(this.path));
        // Proceed to the next location in the path
        this.path = tail(this.path);
    }
    /* M17 T1 end*/
};


// Uncomment the following to test
// var newPlayer = new icsbot(shortname);
// test_task(newPlayer);

// Task 2