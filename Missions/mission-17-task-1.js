// Source Week 10

/* M17 T1
 * Added icsbot.visited property that stores as key-value pairs rooms visited
 * as visited["room-123"] = true.
 *
 * Added code to 
 * 1. Remember the room I am in (through icsbot.visited)
 * 2. Attack drones (on top of the code to attack bots)
 * 3. Move towards an unvisited room if I neighbour one or a random one
 *    otherwise
*/

// Helper functions
// Check if x is a defined index in an key-value pair
function isIndex(x, arr) {
    return arr[x] !== undefined;
}

//-------------------------------------------------------------------------
// Customization
//  - You can personalize your character by setting the following values
//-------------------------------------------------------------------------
var shortname   = "ics";

//-------------------------------------------------------------------------
// icsbot
//-------------------------------------------------------------------------

function icsbot(name){
    Player.call(this, name);
    // Graph of traversed nodes
    this.visited = [];

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
    
    // Get the current location
    var here = this.getLocation();
    // Retrieve a list of charged weapons
    var charged_weapons = filter(isChargedWeapon, this.getPossessions());
    
    // Only attack if I have a charged weapon
    if (!is_empty_list(charged_weapons)) {
        // Find service bots in the same room
        var svcbots = filter(isSomething(ServiceBot), here.getOccupants());
        // Find security drones in the same room
        var secdrones = filter(isSomething(SecurityDrone), here.getOccupants());
        // Only attack in order of preference of
        // (1) ServiceBot, (2) SecurityDrone
        if (!is_empty_list(svcbots)) {
            // Attack a ServiceBot using a charged Weapon
            this.use(head(charged_weapons), svcbots);
        } else if (!is_empty_list(secdrones)) {
            // Attack a SecurityDrone using a charged Weapon
            this.use(head(charged_weapons), svcbots);
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
    // Insert the current room into visited
    this.visited[here.getName()] = true;
    // make sure anonymous functions can access visited
    var visited = this.visited;

    var unvisited_neighbours = filter(function(x) {
                                          return !isIndex(x.getName(), visited);
                                      }, neighbours);
    // Retrieve a list of keycards I own
    var my_keycards = filter(isSomething(Keycard), this.getPossessions());

    // find out if one of them is ProtectedRoom
    var protectedroom = filter(isSomething(ProtectedRoom), neighbours);

    // If we neighbour at least one protected room
    if (!is_empty_list(protectedroom)) {
        // Move to the protected room
        this.moveTo(head(protectedroom)); 
    // If I have unvisited neighbour(s)
    } else if (!is_empty_list(unvisited_neighbours)) {
        // Choose arbitrarily: go to the first unvisited neighbour
        this.moveTo(head(unvisited_neighbours));
    } else {
        // Pick any random neighbour to move to
        this.moveTo(list_ref(neighbours,
                             math_floor(math_random() * length(neighbours))));
    }
};


// Uncomment the following to test
// var newPlayer = new icsbot(shortname);
// test_task(newPlayer);
