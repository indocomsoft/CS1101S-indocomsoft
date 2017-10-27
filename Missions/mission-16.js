//Source Week 10

// Task 1
var engine = new DeathCubeEngine(STEP_MODE, LAYOUT16A);
var bot1_place = engine.__deathcube[0][2][1];
var bot2_place = engine.__deathcube[0][3][2];
var bot1 = MakeAndInstallBot("b1", bot1_place, 2);
var bot2 = MakeAndInstallBot("b2", bot2_place, 3);
engine.__start();
engine.__runRounds(10);

/*
(a) bot1 is more "restless"
(b) inertia parameter passed to MakeAndInstalBot is the mecahnism that determine
    who is more "restless". This is because the bots will only move when 
    math_floor(math_random()&this.__inertia) === 0. The larger inertia is, the 
    lower the probability that the left hand side will be equal to 0. In this
    case, bot1 has a probability of moving during each round of 0.5 while that
    of bot2 is 0.333
(c) On average they will be making a move at the same time every six rounds.
    This is not the observation when we simulate 10 rounds due to the low sample
    size. It may seem to happen way more often or way less often than every six
    rounds, but with sufficiently large sample size, the frequency will regress
    to the mean of every six rounds.
*/

// Task 2
//-------------------------------------------------------------------------
// Customization
//  - You can personalize your character by setting the following values
//-------------------------------------------------------------------------
var shortname   = "ics";
//-------------------------------------------------------------------------
// icsbot
//-------------------------------------------------------------------------
// /* Uncomment this when you have set your class name
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
    } else {
        // Find **a** room neighbouring that contains ServiceBot
        var room_with_svcbots = filter(function(x) {
                                         var cur = x.getOccupants();
                                         return !is_empty_list(cur)
                                                && !is_empty_list(
                                                     filter(isServiceBot, cur)
                                                    );
                                       }, cur_neighbouring);
        // If indeed there is a neighbouring room that contains ServiceBot
        if (!is_empty_list(room_with_svcbots)) {
            // Move to that room
            this.moveTo(head(room_with_svcbots));
        } else {
            // An array containing all possible directions
            var directions = ["north", "south", "east", "west", "up", "down"];
            // Pick a direction randomly
            var cur_dir = directions[math_round(math_random() * 5)];
            // Keep on picking randomly if we cannot go to that direction
            // IF ONLY THE SOURCE HAS DO-WHILE CONSTRUCT
            while (is_empty_list(cur_loc.getExit(cur_dir))) {
                cur_dir = directions[math_round(math_random() * 5)];
            }
            this.go(cur_dir);
        }
        
        // We are in the new room. ATTACK AGAIN!
        // Get the current location
        cur_loc = this.getLocation();
        
        // Retrieve a list of charged weapons
        charged_weapons = filter(function(x) {
                                         return is_instance_of(x, Weapon)
                                                && !x.isCharging();
                                     }, this.getPossessions());
        
        // Only attack if I have a charged weapon
        if (!is_empty_list(charged_weapons)) {
            // Find service bots in the same room
            svcbots = filter(isServiceBot, cur_loc.getOccupants());
            // Only attack if there is at least a service bot in the same room
            if (!is_empty_list(svcbots)) {
                // Attack a ServiceBot using a charged Weapon
                this.use(head(charged_weapons), svcbots);
            } else { }
        } else { }
        
        // Find things not owned by anyone yet
        cur_things = cur_loc.getThings();
        // Preventing "Error: undefined at undefined, line undefined"
        thing = undefined;
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
        
    }
};
var newPlayer = new icsbot(shortname);
test_task2(newPlayer);
// */