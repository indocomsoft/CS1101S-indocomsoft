// Source Week 10

//-------------------------------------------------------------------------
// README
//-------------------------------------------------------------------------
// Your answer here...


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//  Code for adventure game
//  Make your changes below and mark them out clearly
//
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++



//-------------------------------------------------------------------------
// NamedObject
//-------------------------------------------------------------------------
function NamedObject(name){
    this.__objName = name;
    this.__type = "NamedObject";
}
// For student use
NamedObject.prototype.getName = function(){
    return this.__objName;
};
// End of methods for student use
//-------------------------------------------------------------------------





//-------------------------------------------------------------------------
// MobileObject
//-------------------------------------------------------------------------
function MobileObject(name, location){
    NamedObject.call(this, name);
    this.__location = location;
    this.__type = "MobileObject";
}
MobileObject.Inherits(NamedObject);
// For student use
MobileObject.prototype.getPlace = function(){
    return this.__location;
};
// End of methods for student use
MobileObject.prototype.__setPlace = function(newLocation){
    this.__location = newLocation;
};
MobileObject.prototype.__install = function(){
    this.__setPlace(this.__location);
};
MobileObject.prototype.__remove = function(oldLocation){
    this.__setPlace(undefined);
    oldLocation.__delThing(this);
};

function MakeAndInstallMobileObject(name, place){
    var newMobileObject = new MobileObject(name, place);
    newMobileObject.__install();
    return newMobileObject;
}
//-------------------------------------------------------------------------






//-------------------------------------------------------------------------
// Thing
//-------------------------------------------------------------------------
function Thing(name, initLoc){
    MobileObject.call(this, name, initLoc);

    this.__owner = undefined;
    this.__type = "Thing";
}
Thing.Inherits(MobileObject);
// For student use
Thing.prototype.getPlace = function(){
    if(this.isOwned()){
        return this.__owner.getPlace();
    }else{
        return MobileObject.prototype.getPlace.call(this);
    }
};

Thing.prototype.__install = function () {
    this.getPlace().__addThing(this);
    return MobileObject.prototype.__install.call(this);
};
Thing.prototype.isOwned = function () {
    if (this.__owner === undefined){
        return false;
    } else {
        return true;
    }
};
Thing.prototype.getOwner = function(){
    return this.__owner;
};
// End of methods for student use
Thing.prototype.__setOwner = function(newOwner){
    this.__owner = newOwner;
};

function MakeAndInstallThing(name, birthplace){
    var newThing = new Thing(name, birthplace);
    newThing.__install();
    return newThing;
}
//-------------------------------------------------------------------------






//-------------------------------------------------------------------------
// Place
//-------------------------------------------------------------------------
function Place(name){
    NamedObject.call(this, name);

    this.__neighbourMap   = [];
    this.__things         = [];
    this.__type = "Place";
}
Place.Inherits(NamedObject);
// For student use
Place.prototype.getThings = function(){
    return this.__things;
};
Place.prototype.getExits = function(){
    return map(head, this.__neighbourMap);
};
Place.prototype.getNeighbours = function(){
    return map(tail, this.__neighbourMap);
};
Place.prototype.getNeighbourTowards = function(dir){
    var place = assoc(dir, this.__neighbourMap);
    return place ? tail(place)
                 : false;
};
Place.prototype.addNeighbour = function(direction, newNeighbour){
    if(assoc(direction, this.__neighbourMap)){
        display("Direction already assigned " + direction + " " + this.getName());
    } else {
        this.__neighbourMap = pair(pair(direction, newNeighbour),
                                   this.__neighbourMap);
    }
};
Place.prototype.acceptsPerson = function(persion){
    return true;
};
// End of methods for student use
Place.prototype.__addThing = function(newThing){
    if(!is_empty_list(member(newThing, this.__things))){
        display(newThing.getName() + " is already at " + this.getName());
    }else{
        this.__things = append(this.__things, list(newThing));
    }
};
Place.prototype.__delThing = function(thing){
    if(is_empty_list(member(thing, this.__things))){
        display(thing.getName() + " is not at " + this.getName());
    }else{
        this.__things = remove(thing, this.__things);
    }
};
//-------------------------------------------------------------------------



function associationProcedure(proc, select){
    function helper(xs){
        if(is_empty_list(xs)){
            return undefined;
        } else if(proc(head(xs))){
            return select(head(xs));
        } else {
            return helper(tail(xs));
        }
    }
    return helper;
}



function findObject(name, objectList){
    return (associationProcedure((function(obj){
                                   return obj.getName() === name;
                                }),
                                (function(obj){
                                    return obj;
                                })))(objectList);
}


// Utility function to list:
function listing(items, nothing) {
    return tail(accumulate(function (item, p) {
                               if (head(p) === 0) {
                                   return pair(1, item);
                               } else if (head(p) === 1) {
                                   return pair(2, item + " and " + tail(p));
                               } else {
                                   return pair(2, item + ", " + tail(p));
                               }
                           }, pair(0, nothing), items));
}



//-------------------------------------------------------------------------
// Person
//-------------------------------------------------------------------------
function Person(name, initLoc, threshold){
    MobileObject.call(this, name, initLoc);

    this.__possessions  = list();
    this.__threshold = threshold;
    this.__type = "Person";
}
Person.Inherits(MobileObject);
// For student use
Person.prototype.getPossessions = function(){
    return this.__possessions;
};
Person.prototype.listPossessions = function(){
    this.say("I have " + listing(map(function(p) {return p.getName();}, this.__possessions), "nothing"));
    return this.__possessions;
};
Person.prototype.say = function(stuff){
    if(stuff === undefined || stuff === ""){
        stuff = "Oh, nevermind.";
    } else {;}
    display("At " + this.getPlace().getName() + ": " +
                    this.getName() + " says -- " + stuff);
};
Person.prototype.haveFit = function(){
    this.say("Yaaah! I am upset!");
};
Person.prototype.surroundings = function() {
    var self = this;
    var excludeMyself = filter(function(thing) {
        return thing !== self;
    }, this.getPlace().getThings());
    var otherThingNames = map(function(thing){ 
        return "" + thing.getName(); 
    }, excludeMyself);
    return listing(otherThingNames, "nothing");
};
Person.prototype.lookAround = function(){
    var self = this;
    var otherThings = map(function(thing){ return thing.getName(); },
                          filter(function(thing){ return thing !== self; },
                                 this.getPlace().getThings()));
    this.say("I see " + this.surroundings());
    return otherThings;
};
Person.prototype.take = function(thing){
    if(is_string(thing)){
        // Referencing object by string
        var obj = findObject(thing, this.getPlace().getThings());

        if(obj !== undefined){
            this.take(obj);
        } else {
            this.say("There is nothing called \"" + thing + "\" around me");
        }
    } else if (type(thing) === "Thing" && !thing.isOwned()){
        var takeMsg = "At " + this.getPlace().getName() + ": " +
                      this.getName() + " takes: " + thing.getName();
        this.__possessions = append(this.__possessions, list(thing));
        thing.__setOwner(this);
        thing.__remove(this.getPlace());
        display(takeMsg);
    } else if (type(thing) === "NamedObject") {
        display(thing.getName() + " cannot be taken");
    } else {;}
};
Person.prototype.drop = function(thing){
    if(is_string(thing)){
        // Referencing object by string
        var obj = findObject(thing, this.getPossessions());

        if(obj !== undefined){
            this.drop(obj);
        } else {
            this.say("I have nothing called \"" + thing + "\" in my possession");
        }
    } else if(type(thing) === "Thing" && thing.getOwner() === this){
        var dropMsg = "At " + this.getPlace().getName() + ": " +
                      this.getName() + " drops: " + thing.getName();
        this.__possessions = remove(thing, this.__possessions);
        thing.__setOwner(undefined);
        thing.__setPlace(this.getPlace());
        thing.__install();
        display(dropMsg);
    } else if(type(thing) === "NamedObject") {
        display(thing.getName() + " cannot be dropped");
    } else {;}
};
Person.prototype.move = function(){
    if(math_floor(math_random() * this.__threshold) === 0){
        this.__act();
    } else {;}
};
Person.prototype.__act = function(){
    var nextPlace = randomNeighbour(this.getPlace());
    if(nextPlace){
        this.moveTo(nextPlace);
    } else {;}
};
Person.prototype.moveTo = function(newLoc){
    var currLoc     = this.getPlace();
    if(currLoc === newLoc){
        display(this.getName() + " is already at " +
                currLoc.getName());
        return false;
    } else if  (newLoc.acceptsPerson(this)){
        changePlace(this, newLoc);
        map(function(thing){ return changePlace(thing, newLoc); },
            this.__possessions);
        display(this.getName() + " moves from " + currLoc.getName() + " to " + newLoc.getName());
        greetPeople(this, otherPeopleAtPlace(this, newLoc));
        return true;
    }else{
        display(this.getName() + " can't move from " +
                        currLoc.getName() + " to " + newLoc.getName());
        return false;
    }
};
Person.prototype.go = function(direction){
    var currLoc = this.getPlace();
    var newLoc  = currLoc.getNeighbourTowards(direction);
    if(newLoc === false){
        display(this.getName() + " cannot go " +
                        direction + " from " + currLoc.getName());
    } else {
        this.moveTo(newLoc);
    }
};
Person.prototype.install = function(){
    addToClockList(this);
    this.getPlace().__addThing(this);
    MobileObject.prototype.__install.call(this);
};

function MakeAndInstallPerson(name, birthplace, threshold){
    var newPerson = new Person(name, birthplace, threshold);
    newPerson.install();
    return newPerson;
}
//-------------------------------------------------------------------------






//-------------------------------------------------------------------------
// Troll
//-------------------------------------------------------------------------
function Troll(name, birthplace, threshold){
    Person.call(this, name, birthplace, threshold);
    this.__type = "Troll";
}
Troll.Inherits(Person);
Troll.prototype.act = function(){
    var others = otherPeopleAtPlace(this, this.getPlace());
    if(!is_empty_list(others)){
        this.eatPerson(pickRandom(others));
    } else {;}
};
Troll.prototype.eatPerson = function(person){
    this.say("Growl.... I'm going to eat you, " + person.getName());
    goToHeaven(person);
    this.say("Chomp chomp " + person.getName() + " tastes yummy!");
};

function MakeAndInstallTroll(name, birthplace, threshold){
    var newTroll = new Troll(name, birthplace, threshold);
    newTroll.install();
    return newTroll;
}
//-------------------------------------------------------------------------



function goToHeaven(person){
    person.moveTo(heaven);
    removeFromClockList(person);
}

var heaven = new Place("Heaven");



//-------------------------------------------------------------------------


var __clockList = [];
var __theTime = 0;



function initialiseClockList(){
    __clockList = [];
}



function addToClockList(ship){
    __clockList = pair(ship, __clockList);
}



function removeFromClockList(ship){
    __clockList = filter(function(s){ return s.getName() !== ship.getName(); },
                         __clockList);
}

function clock(){
    display("\n");
    __theTime = __theTime + 1;
    map(function(x){ return x.move(); },
        __clockList);
}



function currentTime(){
    return __theTime;
}



function runClock(n){
    if(n > 0){
        clock();
        runClock(n - 1);
    } else {;}
}



//-------------------------------------------------------------------------
// Misc procedures
//-------------------------------------------------------------------------


//Bridges gap between mobileObj and place..
// best it's not internal to either one.
function changePlace(mobileObj, newPlace){
    var oldPlace = mobileObj.getPlace();
    mobileObj.__setPlace(newPlace);
    oldPlace.__delThing(mobileObj);
    newPlace.__addThing(mobileObj);
}


function randomNeighbour(place){
  return pickRandom(place.getNeighbours());
}



function otherPeopleAtPlace(person, place){
    return filter(function(obj){ return (type(obj) === "Person") && obj !== person; },
                  place.getThings());
}



function greetPeople(person, people){
    if(!is_empty_list(people)){
        person.say("Hi " + listing(map(function(x){ return x.getName(); }, people), "nobody"));
    } else {;}
}



function list_length(xs){
    if(is_empty_list(xs)){
        return 0;
    } else {
        return 1 + list_length(tail(xs));
    }
}



function pickRandom(xs){
    if(is_empty_list(xs)){
        return false;
    } else {
        return list_ref(xs, math_floor(math_random() * list_length(xs)));
    }
}



//-------------------------------------------------------------------------
// Other interesting procedures
//-------------------------------------------------------------------------

function SDCard(name, birthplace, id){
    Thing.call(this, name, birthplace);
    this.__id = id;
}
SDCard.Inherits(Thing);
SDCard.prototype.getID = function(){
    return this.__id;
};

function MakeAndInstallSDCard(name, birthplace, id){
    var newSDCard = new SDCard(name, birthplace, id);
    newSDCard.__install();
    return newSDCard;
}

function copySDCard(card){
    var name = "copy of " + card.getName();
    var place = card.getPlace();
    var id = card.getID();

    return MakeAndInstallSDCard(name, place, id);
}
//-------------------------------------------------------------------------






//-------------------------------------------------------------------------
// Code for Adventure Game
//-------------------------------------------------------------------------

initialiseClockList();

// Here we define the places in our world

var centralLibrary = new Place("Central Library");
var forum = new Place("Forum");
var lt15 = new Place("lt15");
var artsCanteen = new Place("Arts Canteen");
var com1OpenArea = new Place("COM1 Open Area");
var sr1 = new Place("SR1");
var com1Classrooms = new Place("COM1 Classrooms");
var bengOffice = new Place("Beng Office");
var bingOffice = new Place("Bing Office");
var com1LiftLobbyTop = new Place("COM1 Lift Lobby Top");
var com1LiftLobbyBottom = new Place("COM1 Lift Lobby Bottom");
var com1Ladies = new Place("COM1 Ladies");
var com1Gents = new Place("COM1 Gents");
var secretPortal = new Place("Secret Portal");
var gmOffice = new Place("Grandmaster's Office");
var technicalServices = new Place("Technical Services");
var com1ResearchLabs = new Place("COM1 Research Labs");
var com1StaircaseTop = new Place("COM1 Staircase Top");
var com1StudentArea = new Place("COM1 Student Area");
var enchantedGarden = new Place("Enchanted Garden");
var dataCommLab2 = new Place("Data Comm Lab2");
var com1StaircaseBottom = new Place("COM1 Staircase Bottom");


// One-way paths connect individual places in the world
//-------------------------------------------------------------------------


function canGo(from, direction, to){
    from.addNeighbour(direction, to);
}



function canGoBothWays(from, direction, reverseDirection, to){
    canGo(from, direction, to);
    canGo(to, reverseDirection, from);
}



var NORTH = "north";
var SOUTH = "south";
var EAST = "east";
var WEST = "west";
var UP = "up";
var DOWN = "down";
var directions = list(NORTH, SOUTH, EAST, WEST, UP, DOWN);



canGoBothWays(forum, UP, DOWN, centralLibrary);
canGoBothWays(bingOffice, NORTH, SOUTH, centralLibrary);
canGoBothWays(lt15, NORTH, SOUTH, forum);
canGoBothWays(artsCanteen, EAST, WEST, lt15);
canGoBothWays(lt15, UP, DOWN, bingOffice);
canGoBothWays(com1OpenArea, NORTH, SOUTH, lt15);
canGoBothWays(com1OpenArea, EAST, WEST, sr1);
canGoBothWays(com1Classrooms, NORTH, SOUTH, com1OpenArea);
canGoBothWays(bengOffice, NORTH, SOUTH, com1Classrooms);
canGoBothWays(com1LiftLobbyTop, EAST, WEST, com1OpenArea);
canGoBothWays(com1LiftLobbyBottom, UP, DOWN, com1LiftLobbyTop);
canGoBothWays(com1Ladies, NORTH, SOUTH, com1LiftLobbyBottom);
canGoBothWays(com1Gents, NORTH, SOUTH, com1Ladies);
canGoBothWays(secretPortal, UP, DOWN, com1Gents);
canGoBothWays(gmOffice, EAST, WEST, secretPortal);
canGoBothWays(com1LiftLobbyBottom, EAST, WEST, technicalServices);
canGoBothWays(com1ResearchLabs, NORTH, SOUTH, technicalServices);
canGoBothWays(com1StaircaseTop, NORTH, SOUTH, com1ResearchLabs);
canGoBothWays(com1StudentArea, UP, DOWN, technicalServices);
canGoBothWays(com1StudentArea, EAST, WEST, enchantedGarden);
canGoBothWays(dataCommLab2, NORTH, SOUTH, com1StudentArea);
canGoBothWays(com1StaircaseBottom, NORTH, SOUTH, dataCommLab2);
canGoBothWays(com1StaircaseBottom, UP, DOWN, com1StaircaseTop);


// Important critters in our world
initialiseClockList();
var you = MakeAndInstallPerson("you", enchantedGarden, 999999); // Your avatar
var beng = MakeAndInstallPerson("beng", bengOffice, 3);
var bing = MakeAndInstallPerson("bing", bingOffice, 2);
var proffy = MakeAndInstallTroll("Proffy", lt15, 4);


var bingCard = MakeAndInstallSDCard("Bing Card", bingOffice, "888-12-3456");
var bengCard = MakeAndInstallSDCard("Beng Card", bengOffice, "888-98-7654");
var gmCard = MakeAndInstallSDCard("Grandmaster Card", gmOffice, "888-00-0001");

// Interactive Game

function tokenize(s){
    return s.split(" ");
}


function makeMove(command){
    if(command === "quit"){
        display("\n\nThanks for Playing!\n\n");
    } else if(command === "wait"){
        clock();
        displayGameState();
    } else {
        var tokens = command.split(" ");
        
        if (tokens[0] === 'help') {
            display("Try these commands:");
            display("makeMove('listPossessions');");
            display("makeMove('say <something>');");
            display("makeMove('haveFit');");
            display("makeMove('lookAround');");
            display("makeMove('take <something>');");
            display("makeMove('drop <something>');");
            display("makeMove('go <direction>');");
        } else {
            var method = you[tokens[0]];
            if (!is_function(method)){
                display("**Cannot understand the command '" + tokens[0] + "'**");
            } else {
                var result = undefined;
                if (tokens.length !== 1) {
                    result = method.call(you, tokens.slice(1).join(' '));
                } else {
                    result = method.call(you);
                }
                clock();
                displayGameState();
                return result;
            }
        }
    }
}

function displayGameState(){
    display("");
    display("You are at: " + you.getPlace().getName());
    display("You see " + you.surroundings() + " around you");

    display("Exits: " + listing(you.getPlace().getExits(), "none"));
    display("");
    display("Type makeMove() to perform an action, or makeMove(\"help\") for help");
}

function type(object) {
    return object.__type;
}

displayGameState();