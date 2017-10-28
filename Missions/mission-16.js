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

function icsbot(name){
    Player.call(this, name);
}
icsbot.Inherits(Player);
icsbot.prototype.__act = function(){
    Player.prototype.__act.call(this);

    // A function to check if a given argument is a ServiceBot
    var isServiceBot = function(x) {
                           return is_instance_of(x, ServiceBot);
                       };
    
    // Get the current location
    var here = this.getLocation();
    
    // Retrieve a list of charged weapons
    var charged_weapons = filter(function(x) {
                                     return is_instance_of(x, Weapon)
                                            && !x.isCharging();
                                 }, this.getPossessions());
    
    // Only attack if I have a charged weapon
    if (!is_empty_list(charged_weapons)) {
        // Find service bots in the same room
        var svcbots = filter(isServiceBot, here.getOccupants());
        // Only attack if there is at least a service bot in the same room
        if (!is_empty_list(svcbots)) {
            // Attack a ServiceBot using a charged Weapon
            this.use(head(charged_weapons), svcbots);
        } else { }
    } else { }

    // Retrieve a list of Keycards in the current room
    var keycards = filter(function(x) {
                              return is_instance_of(x, Keycard);
                          }, here.getThings());
    // Pick them all up if there is one
    if (!is_empty_list(keycards)) {
        this.take(keycards);
    } else { }
    
    // Retrieve a list of neighbouring rooms
    var neighbours = here.getNeighbours();
    // find out if one of them is ProtectedRoom
    var protectedroom = filter(function(x) {
                                   return is_instance_of(x, ProtectedRoom);
                               }, neighbours);
    // If we neighbour at least one protected room
    if (!is_empty_list(protectedroom)) {
        // Move to it
        this.moveTo(head(protectedroom));
    } else { }
};
var newPlayer = new icsbot(shortname);
test_task2(newPlayer);
