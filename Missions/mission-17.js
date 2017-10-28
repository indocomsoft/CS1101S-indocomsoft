// Source Week 10

//Task 1
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
}
icsbot.Inherits(Player);
icsbot.prototype.__act = function(){
    Player.prototype.__act.call(this);

    // your solution here
    // A function to check if a given argument is a ServiceBot
    var isServiceBot = function(x) {
                           return is_instance_of(x, ServiceBot);
                       };
    
    // Get the current location
    var cur_loc = this.getLocation();
    
    // Retrieve a list of charged weapons
    var charged_weapons = filter(function(x) {
                                     return is_instance_of(x, Weapon)
                                            && !x.isCharging();
                                 }, this.getPossessions());
    
    // Only attack if I have a charged weapon
    if (!is_empty_list(charged_weapons)) {
        // Find service bots in the same room
        var svcbots = filter(isServiceBot, cur_loc.getOccupants());
        // Only attack if there is at least a service bot in the same room
        if (!is_empty_list(svcbots)) {
            // Attack a ServiceBot using a charged Weapon
            this.use(head(charged_weapons), svcbots);
        } else { }
    } else { }
    
    // Find things not owned by anyone yet
    var cur_things = cur_loc.getThings();
    // Preventing "Error: undefined at undefined, line undefined"
    var thing = undefined;
    // Iterate through cur_things to find a keycard
    while (!is_empty_list(cur_things)) {
        thing = head(cur_things);
        // If the current thing is a keycard
        if (is_instance_of(thing, Keycard)) {
            // Take it
            this.take(list(thing));
            // We have picked up **a** Keycard. Stop iterating.
            break;
        } else { }
        cur_things = tail(cur_things);
    }
    
    // Retrieve a list of neighbouring rooms
    var cur_neighbouring = cur_loc.getNeighbours();
    // find out if one of them is ProtectedRoom
    var cur_protectedroom = filter(function(x) {
                                      return is_instance_of(x, ProtectedRoom);
                                  }, cur_neighbouring);
    // If we neighbour at least one protected room
    if (!is_empty_list(cur_protectedroom)) {
        // Move to it
        this.moveTo(head(cur_protectedroom));
    } else { }
};
var newPlayer = new icsbot(shortname);
test_task2(newPlayer);


// Uncomment the following to test
// var newPlayer = new [your class name here](shortname);
// test_task(newPlayer);

// Task 2