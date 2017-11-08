/*
 * M19 T2
 * Created global counter array_counter
 * Add counter by 1 every time apply is called
*/
var array_counter = 0;

function count_arrays_created(program) {
    array_counter = 0;
    parse_and_evaluate(program);
    return array_counter;
}

/*
Evaluator for a sub-language of Source Week 10
(including object-oriented programming)
*/

/*
CONSTANTS: NUMBERS, STRINGS, TRUE, FALSE
*/


// constants (numbers, strings, booleans)
// are considered "self_evaluating". This means, they
// represent themselves in the syntax tree
      
function is_self_evaluating(stmt) {
   return is_number(stmt) ||
          is_string(stmt) ||
          is_boolean(stmt);
}
   
// all other statements and expressions are
// tagged objects. Their tag tells us what
// kind of statement/expression they are

function is_tagged_object(stmt,the_tag) {
   return is_object(stmt) && stmt.tag === the_tag;
}

/*
THE EMPTY LIST EXPRESSION: []
*/

// the empty list expression is tagged
// with "empty_list"
function is_empty_list_expression(stmt) {
    return is_tagged_object(stmt, "empty_list");
}      

// make a fresh empty list value that is
// different from all other empty list values
function evaluate_empty_list_expression(stmt) {
    array_counter = array_counter + 1;
    return [];
}

/*
ENVIRONMENTS
*/

// Frames are objects. Each property
// represents a binding of a variable
// (represented by a string) to a value.
var an_empty_frame = {};
function make_frame(variables,values) {
   if (is_empty_list(variables) && is_empty_list(values)) {
      return {};
   } else {
      var frame = make_frame(tail(variables),tail(values));
      frame[head(variables)] = head(values); // object field
                                             // assignment
      return frame;
   }
}
function add_binding_to_frame(variable,value,frame) {
   frame[variable] = value; // object field assignment
   return undefined;
}
function has_binding_in_frame(variable,frame) {
    var val = frame . hasOwnProperty(variable);
   return val;
}
    
// Environments are lists of frames.

// The first frame in an environment is the
// "innermost" frame. The tail operation
// takes you to the "enclosing" environment
function first_frame(env) {
   return head(env);
}
function enclosing_environment(env) {
   return tail(env);
}
function enclose_by(frame,env) {
   return pair(frame,env);
}
var the_empty_environment = [];
function is_empty_environment(env) {
   return is_empty_list(env);
}

/* 
VARIABLES: my_var
*/
    
// variables are tagged with "variable"
// in this evaluator, typical variables 
// are 
// { "tag": "variable", "name": "+" }      
function is_variable(stmt) {
   return is_tagged_object(stmt,"variable");
}
function variable_name(stmt) {
   return stmt.name;
}

// variable lookup proceeds from the innermost
// frame and continues to look in enclosing
// environments until the variable is found
function lookup_variable_value(variable,env) {
   function env_loop(env) {
      if (is_empty_environment(env)) {
         error("Unbound variable: " + variable);
      } else if (has_binding_in_frame(variable,first_frame(env))) {
         return first_frame(env)[variable];
      } else {
          return env_loop(enclosing_environment(env));
      }
   }
   return env_loop(env);
}

/* 
VARIABLE ASSIGNMENT: my_var = <expression>;
*/

// assignments are statements tagged with "assignment"
// their variables and value expressions are accessible
// via "variable" and "value"
function is_assignment(stmt) {
   return is_tagged_object(stmt,"assignment");
}
function assignment_variable(stmt) {
   return stmt.variable;
}
function assignment_value(stmt) {
   return stmt.value;
}

// like variable lookup, assignment needs to find
// the right frame, which is the frame that has the
// variable already
function set_variable_value(variable,value,env) {
   function env_loop(env) {
      if (is_empty_environment(env)) {
         error("Unbound variable - - assignment: " + variable);
      } else if (has_binding_in_frame(variable,first_frame(env))) {
         add_binding_to_frame(variable,value,first_frame(env));
      } else {
          env_loop(enclosing_environment(env));
      }
   }
   env_loop(env);
   return undefined;
}

// assignment needs to evaluate the value expression
// and then assign the variable to that expression
function evaluate_assignment(stmt,env) {
   var value = evaluate(assignment_value(stmt),env);
   set_variable_value(variable_name(assignment_variable(stmt)),
                      value,
                      env);
   return value;
}    
  
/* 
VAR DEFINITIONS: var my_var = <expression>;
*/

// var definitions are tagged with "var_definition"
// and have "variable" and "value" properties
function is_var_definition(stmt) {
   return is_tagged_object(stmt,"var_definition");
}
function var_definition_variable(stmt) {
   return stmt.variable;
}
function var_definition_value(stmt) {
   return stmt.value;
}
      
// define_variable makes a binding to the first
// (innermost) frame of the given environment
function define_variable(variable,value,env) {
   var frame = first_frame(env);
   return add_binding_to_frame(variable,value,frame);
}

// evaluation of a variable definition evaluates
// the right-hand expression and binds the
// variable to the resulting value in the
// first (innermost) frame
function evaluate_var_definition(stmt,env) {
   define_variable(var_definition_variable(stmt),
                   evaluate(var_definition_value(stmt),env),
                   env);
   return undefined;
}
    
/* 
CONDITIONAL STATEMENTS: if ( <condition> ) { <statement> }
                        else { <statement> }
*/

// conditional statements are tagged with "if"
function is_if_statement(stmt) {
   return is_tagged_object(stmt,"if");
}
function if_predicate(stmt) {
   return stmt.predicate;
}
function if_consequent(stmt) {
   return stmt.consequent;
}
function if_alternative(stmt) {
   return stmt.alternative;
}
function is_true(x) {
   return x === true;
}
function is_false(x) {
   return ! is_true(x);
}
    
// the meta-circular evaluation of if statements
// evaluates the predicate and then the appropriate
// branch, depending on whether the predicate 
// evaluates to true or not
function evaluate_if_statement(stmt,env) {
   if (is_true(evaluate(if_predicate(stmt),env))) {
      return evaluate(if_consequent(stmt),env);
   } else {
       return evaluate(if_alternative(stmt),env);
   }
}

/* 
WHILE STATEMENTS: while ( <condition> ) { <statement> }

(challenge excercise: implement break and continue)
*/

// while statements are tagged with "while"
function is_while_statement(stmt) {
   return is_tagged_object(stmt,"while");
}
function while_predicate(stmt) {
   return stmt.predicate;
}
function while_statements(stmt) {
   return stmt.statements;
}
// is_true and is_false from section 
// CONDITIONAL STATEMENTS above
    
// evaluation of while statements
// evaluates the predicate. If the
// result is_true, we evaluate the body, followed
// by evaluating the whole while statement again.
function evaluate_while_statement(stmt,env) {
   if (is_true(evaluate(while_predicate(stmt),env))) {
       evaluate(while_statements(stmt),env);
       evaluate_while_statement(stmt, env);
   } else {
       return undefined;
   }
}

/* 
FOR STATEMENTS: for(<initializer>;<predicate>;<finalizer> ) { <body> }

(challenge excercise: implement break and continue)
*/

// for statements are tagged with "for"
function is_for_statement(stmt) {
   return is_tagged_object(stmt,"for");
}
function for_initialiser(stmt) {
   return stmt.initialiser;
}
function for_predicate(stmt) {
   return stmt.predicate;
}
function for_finaliser(stmt) {
   return stmt.finaliser;
}
function for_statements(stmt) {
   return stmt.statements;
}
// is_true and is_false from section 
// CONDITIONAL STATEMENTS above
    
// evaluation of for-statements evaluates the 
// initializer, and then enters a loop. The loop first 
// evaluates the predicate. If predicate result is_true, 
// we evaluate the body, followed by the finaliser, 
// followed by the loop.
function for_loop(predicate, body, finaliser, env) {
   if (is_true(evaluate(predicate,env))) {
       evaluate(body,env);
       evaluate(finaliser, env);
       for_loop(predicate, body, finaliser, env);
   } else {
       return undefined;
   }
}
function evaluate_for_statement(stmt,env) {
    evaluate(for_initialiser(stmt), env);
    for_loop(for_predicate(stmt), for_statements(stmt), 
             for_finaliser(stmt), env);
    return undefined;
}

/* 
ARRAY LITERALS: [ <expr_1>, ... , <expr_n> ]
*/

function elements(stmt) {
    return stmt.elements;
}
function is_array_literal(stmt) {
   return is_tagged_object(stmt,"arrayinit");
}
// array literals are represented by the
// parser as a list of expressions.
// We create an empty array, and
// then assign the results of evaluation
// of the expressions to successive integers
// starting with 0.
function evaluate_array_literal(stmt,env) {
    array_counter = array_counter + 1;
    var array = [];
    var elements = stmt.elements;
    var len = length(elements);
    for (var i = 0; i < len; i = i + 1) {
         array[i] = evaluate(head(elements), env);
         elements = tail(elements);
    }
    return array;
}

/* 
LAZY BOOLEAN OPERATOR APPLICATION: <expression> && <expression>
                                   <expression> || <expression>
*/

// thankfully our parser distinguishes the applications
// of lazy boolean operators using the special tag
// "boolean_op"
function is_boolean_op(stmt) {
    return is_tagged_object(stmt, "boolean_op");
}

// evaluation of laziness avoids evaluation of
// the right-hand side, if the evaluation of the
// left-hand side already determines the result
function evaluate_boolean_op(stmt, env) {
    if (operator(stmt) === "&&") {  
        if (is_true(evaluate(first_operand(
                                operands(stmt)),
                             env))) {
            return evaluate(
                      first_operand(
                          rest_operands(operands(stmt))),
                      env);
        } else {
            return false;
        } 
    } else {
        if (is_true(evaluate(first_operand(
                                operands(stmt)),
                             env))) {
            return true;
        } else {
            return evaluate(
                      first_operand(
                         rest_operands(operands(stmt))),
                      env);
        }        
    }
}

/* 
TERNARY OPERATOR: <expression> ? <expression> : <expression>                               <expression> || <expression>
*/

function is_ternary(stmt) {
    return is_tagged_object(stmt, "ternary");
}
function ternary_predicate(stmt) {
   return stmt.predicate;
}
function ternary_consequent(stmt) {
   return stmt.consequent;
}
function ternary_alternative(stmt) {
   return stmt.alternative;
}
// the meta-circular evaluation of if statements
// evaluates the predicate and then the appropriate
// branch, depending on whether the predicate 
// evaluates to true or not
function evaluate_ternary(stmt,env) {
   if (is_true(evaluate(ternary_predicate(stmt),env))) {
      return evaluate(ternary_consequent(stmt),env);
   } else {
       return evaluate(ternary_alternative(stmt),env);
   }
}

/* 
SEQUENCES: <statement> <statement> ... <statement>
*/

// sequences of statements are just represented
// by lists of statements by the parser. Thus
// there is no need for tagged objects here.
function is_sequence(stmt) {
   return is_list(stmt);
}
function is_empty_statement(stmts) {
   return is_empty_list(stmts);
}
function is_last_statement(stmts) {
   return is_empty_list(tail(stmts));
}
function first_statement(stmts) {
   return head(stmts);
}
function rest_statements(stmts) {
   return tail(stmts);
}

// to evaluate a sequence, we need to evaluate
// its statements one after the other, and return
// the value of the last statement. 
// An exception to this rule is when a return
// statement is encountered. In that case, the
// remaining statements are ignored and the 
// return value is the value of the sequence.
function evaluate_sequence(stmts,env) {
   if (is_empty_statement(stmts)) {
      return undefined;
   } else if (is_last_statement(stmts)) {
      return evaluate(first_statement(stmts),env);
   } else {
      var first_stmt_value = 
          evaluate(first_statement(stmts),env);
      if (is_return_value(first_stmt_value)) {
          return first_stmt_value;
      } else {
          return evaluate_sequence(
                     rest_statements(stmts),env);
      }
   }
}

/* 
FUNCTION DEFINITION EXPRESSIONS: function (x1,...,xn) { <body> }
*/

// function definitions are tagged with "function_definition"
// have a list of "parameters" and a "body" statement
function is_function_definition(stmt) {
   return is_tagged_object(stmt,"function_definition");
}
function function_definition_parameters(stmt) {
   return stmt.parameters;
}
function function_definition_body(stmt) {
   return stmt.body;
}

// the inherits_function_value is used for Inherits calls
// of the form: Child.Inherits(Parent)
// which conceptually stands for: (Child.Inherits)(Child, Parent),
// according to Object Method Application in Source.
// The function value below is equivalent to the following Source:
// function(Parent) {
//     this. __proto__ = Parent.prototype;
// }
// for every function Child in the given program.

var inherits_function_value = 
    { tag: "function_value",
      parameters: list("this", "Parent"),
      locals: [],
      body: parse("this.prototype.__proto__ = Parent.prototype;"),
      environment: []
    };

// function values keep track of parameters, body
// and environment, in an object tagged as "function_value"

// we also keep track of the local variables in the body
function make_function_value(parameters, locals, body, env) {
   return { tag: "function_value",
            parameters: parameters,
            locals: locals,
            body: body,
            environment: env,
            // we include a prototype property, initially
            // the empty object. This means, user programs
            // can do: my_function.prototype.m = ...
            prototype: {},
            // another way of calling a function is by
            // invoking it via  my_function.call(x,y,z)
            // This is actually an object method application,
            // and thus it becomes
            // (my_function["call"])(my_function,x,y,z)
            // Therefore, we add an argument (let's call it
            // __function__) in front of the parameter list.
            call: { tag: "function_value",
                    parameters: pair("__function__",
                                     parameters),
                    locals: locals,
                    body: body,
                    environment: env
                  },
            // the property Inherits is available for all functions f
            // in the given program. This means that we can call
            // f.Inherits(...), using object method application
            Inherits: inherits_function_value
          };
}
function is_compound_function_value(f) {
   return is_tagged_object(f,"function_value");
}
function function_value_parameters(value) {
   return value.parameters;
}
function function_value_locals(value) {
   return value.locals;
}
function function_value_body(value) {
   return value.body;
}
function function_value_environment(value) {
   return value.environment;
}

// the function locals finds all variable names
// that are declared using "var" in stmt. The
// function does not look inside function definitions,
// because the calls of the respective functions will
// take care of _their_ local variables.
function locals(stmt) {
   if (is_var_definition(stmt)) {
       return list(var_definition_variable(stmt));
   } else if (is_if_statement(stmt)) {
      return append(locals(if_consequent(stmt)), 
                    locals(if_alternative(stmt)));
   } else if (is_sequence(stmt)) {
       // couldn't resist the slight break of the
       // statement sequence abstraction, using
       // accumulate
      return accumulate(function (stmt1, acc) {
                            return append(locals(stmt1), acc);
                        }, [], stmt);
   } else {
      return [];
   }
}

// evluating a function definition expression
// results in a function value. Note that the
// current environment is stored as the function
// value's environment.
//
// also note that we compute all local variables
// (variables that are declared in the body, using
// "var") and store them in the function value.
//
// also note that the implicit first parameter "this"
// is explicitly inserted in front of the param list
function evaluate_function_definition(stmt,env) {
   return make_function_value(
             pair("this",
                  function_definition_parameters(stmt)),
             locals(function_value_body(stmt)),
             function_definition_body(stmt),
             env);
}

/* 
FUNCTION APPLICATION: <expression> ( <exp_1>, ..., <exp_n> )
*/

// The core of our evaluator is formed by the
// implementation of function applications.
// Applications are tagged with "application"
// and have "operator" and "operands"
function is_application(stmt) {
   return is_tagged_object(stmt,"application");
}
function operator(stmt) {
   return stmt.operator;
}
function operands(stmt) {
   return stmt.operands;
}
function no_operands(ops) {
   return is_empty_list(ops);
}
function first_operand(ops) {
   return head(ops);
}
function rest_operands(ops) {
   return tail(ops);
}
      
// primitive functions are tagges with "primitive"      
// and come with a Source function "implementation"
function is_primitive_function(fun) {
   return is_tagged_object(fun,"primitive");
}
function primitive_implementation(fun) {
   return fun.implementation;
}
    
// We follow the Scheme original here, and provide a 
// built-in function apply_in_underlying_javascript.
function apply_primitive_function(fun,args) {
    return apply_in_underlying_javascript(
                primitive_implementation(fun),
                args);     
}

// there are two ways to call compound functions:
// * using function application, see function apply below
// * using object method application, see function
//   evaluate_object_method_application in section
//   OBJECT METHOD APPLICATION
function apply_compound_function(fun, args) {
    // we extend the environment of the function
    // to be called by a binding or its paramters
    // to the actual arguments
    var new_env = extend_environment(
                        function_value_parameters(fun),
                        args,
                        function_value_environment(fun));
    // each local variable refers to the value undefined
    // before we start evaluating the function body
    for_each(function(local) {
                 define_variable(local, undefined, new_env);
             },
             function_value_locals(fun)
    );
    var result = evaluate(function_value_body(fun),
                          new_env);
    // we check if the result is a return value
    // if yes, we return the content of the return value
    // if no, we ignore the result and return undefined
    if (is_return_value(result)) {
        return return_value_content(result);
    } else {
        return undefined;
    }
}

// applying a compound function to parameters will
// lead to the creation of a new environment, with
// respect to which the body of the function needs
// to be evaluated.
function extend_environment(vars,vals,base_env) {
   if (length(vars) === length(vals)) {
      return enclose_by(make_frame(vars,vals),base_env);
   } else if (length(vars) < length(vals)) {
      error("Too many arguments supplied: " +
            "expected " + length(vars) +
            " argument(s), but got " + length(vals));
   } else {
      error("Too few arguments supplied: " + 
            "expected " + length(vars) +
            " argument(s), but got "+ length(vals));
   }
}
    
// function application needs to distinguish between
// primitive functions (which are evaluated using the
// underlying JavaScript), and compound functions.
// Applications of the latter needs to evaluate the
// body of the function value with respect to an 
// environment that results from extending the function
// value's environment by a binding of the function
// parameters to the arguments
function apply(fun,args) {
   if (is_primitive_function(fun)) {
      return apply_primitive_function(fun,args);
   } else if (is_compound_function_value(fun)) {
       // note that we pass the value undefined as the
       // implicit first argument "this"
       return apply_compound_function(fun,
                                      pair(undefined, args));
   } else {
       error("Unknown function type - - APPLY: " + fun.tag);
   }
}
    
// argument lists are evaluated from left to right    
function list_of_values(exps,env) {
   if (no_operands(exps)) {
       return [];
   } else {
       return pair(evaluate(first_operand(exps),env),
                   list_of_values(rest_operands(exps),env));
   }
}

/* 
RETURN STATEMENTS: return <expression> ;
*/

// Functions return the value that results from
// evaluating their expression
function is_return_statement(stmt) {
   return is_tagged_object(stmt,"return_statement");
}
function return_statement_expression(stmt) {
   return stmt.expression;
}
  
// since return statements can occur anywhere in the
// body, we need to identify them during the evaluation
// process
function make_return_value(content) {
   return { tag: "return_value", content: content };
}
function is_return_value(value) {
   return is_tagged_object(value,"return_value");
}
function return_value_content(value) {
   return value.content;
}

function evaluate_return_statement(stmt, env) {
    return make_return_value(
               evaluate(return_statement_expression(stmt),
                        env));
}

/* 
OBJECT LITERALS: { str_1 : <expr_1>, ... str_n : <expr_n> }
*/

function pairs(stmt) {
    return stmt.pairs;
}
function is_object_literal(stmt) {
   return is_tagged_object(stmt,"object");
}
// object literals are represented by the
// parser as a list of string/expression
// pairs. We create an empty object, and
// then assign the results of evaluation
// of the expressions to the respective string.
function evaluate_object_literal(stmt,env) {
    var obj = {};
    for_each(function(p) {
                 obj[head(p)] = evaluate(tail(p), env);
             },
             pairs(stmt)
            );
    return obj;
}

/* 
PROPERTY ACCESS: <exp_1> [ <exp_2> ]
*/

function object(stmt) {
    return stmt.object;
}
function property(stmt) {
    return stmt.property;
}
function is_property_access(stmt) {
   return is_tagged_object(stmt,"property_access");
}
// property access is directly mapped to
// property access in the underlying JavaScript
function evaluate_property_access(stmt,env) {
    var obj = evaluate(object(stmt), env);
    var prop = evaluate(property(stmt), env);
    return obj[prop];
}

/* 
PROPERTY ASSIGNMENT: <exp_1> [ <exp_2>] = <exp_3> ;
*/

// object as in PROPERTY ACCESS
// property as in PROPERTY ACCESS
function value(stmt) {
    return stmt.value;
}
function is_property_assignment(stmt) {
   return is_tagged_object(stmt,"property_assignment");
}
// property assignment is directly mapped to
// property assignment in the underlying JavaScript
function evaluate_property_assignment(stmt,env) {
    var obj = evaluate(object(stmt), env);
    var prop = evaluate(property(stmt), env);
    var val = evaluate(value(stmt), env);
    obj[prop] = val;
    return val;
}

/* 
OBJECT METHOD APPLICATION: <exp_1> . method_name ( ... )
*/

// property as in PROPERTY ACCESS
// operands as in FUNCTION APPLICATION

function is_object_method_application(stmt) {
   return is_tagged_object(stmt,"object_method_application");
}
// conceptually: obj.m(x) -> (obj["m"])(obj,x)
// we first evaluate the object expression, then
// access the resulting object using the method name.
// We call the resulting function using the object
// as first argument ("this"), followed by all the
// other (evaluated) arguments.
function evaluate_object_method_application(stmt,env) {
    var obj = evaluate(object(stmt), env);
    var method_name = property(stmt);
    var method = obj[method_name];
    var first_arg = obj;
    var other_args = list_of_values(operands(stmt), 
                                    env);
    return apply_compound_function(method,
                                   pair(obj, other_args)
                                  );
}

/* 
NEW CONSTRUCTION: new <type>(<operands>) 
*/

// operands as in APPLICATION
function type(stmt) {
    return stmt.type;
}
function is_new_construction(stmt) {
   return is_tagged_object(stmt,"construction");
}
// new constructs an empty object, first.
// Then we access the environment using type
// (which must be a variable in Source)
function evaluate_new_construction(stmt,env) {
    var obj = {};
    var constructor = lookup_variable_value(type(stmt),env);
    // set __proto__ to the prototype property
    // of the constructor
    obj.__proto__ = constructor.prototype;
    // apply constructor with obj as "this"
    apply_compound_function(
        constructor, 
        pair(obj, list_of_values(operands(stmt), env)));
    // ignore the result value, and return the object
    return obj;
}

/* EVALUATE */

// The workhorse of our evaluator is the evaluate function.
// It dispatches on the kind of statement at hand, and
// invokes the appropriate implementations of their
// evaluation process, as described above.
function evaluate(stmt, env) {
   if (is_self_evaluating(stmt)) {
      return stmt;
   } else if (is_empty_list_expression(stmt)) {
      return evaluate_empty_list_expression(stmt);
   } else if (is_variable(stmt)) {
      return lookup_variable_value(variable_name(stmt), 
                                   env);
   } else if (is_assignment(stmt)) {
      return evaluate_assignment(stmt,env);
   } else if (is_var_definition(stmt)) {
       return evaluate_var_definition(stmt, env);
   } else if (is_if_statement(stmt)) {
      return evaluate_if_statement(stmt, env);
   } else if (is_while_statement(stmt)) {
      return evaluate_while_statement(stmt, env);
   } else if (is_for_statement(stmt)) {
      return evaluate_for_statement(stmt, env);
   } else if (is_array_literal(stmt)) {
       return evaluate_array_literal(stmt, env);
   } else if (is_sequence(stmt)) {
      return evaluate_sequence(stmt, env);
   } else if (is_boolean_op(stmt)) {
       return evaluate_boolean_op(stmt, env);
   } else if (is_ternary(stmt)) {
       return evaluate_ternary(stmt, env);
   } else if (is_function_definition(stmt)) {
      return evaluate_function_definition(stmt, env);
   } else if (is_application(stmt)) {
      return apply(evaluate(operator(stmt), env),
                   list_of_values(operands(stmt), 
                                  env));
   } else if (is_return_statement(stmt)) {
      return evaluate_return_statement(stmt, env); 
   // object-oriented programming
   } else if (is_object_literal(stmt)) {
       return evaluate_object_literal(stmt, env);
   } else if (is_property_access(stmt)) {
       return evaluate_property_access(stmt, env);
   } else if (is_property_assignment(stmt)) {
       return evaluate_property_assignment(stmt, env);
   } else if (is_object_method_application(stmt)) {
      return evaluate_object_method_application(stmt, 
                                                env);
   } else if (is_new_construction(stmt)) {
       return evaluate_new_construction(stmt, env);
   } else {
       error("Unknown expression type - - evaluate: " + 
             stmt.tag);
   }
}

/* THE GLOBAL ENVIRONMENT */

// at the toplevel (outside of functions), return statements
// are not allowed. The function evaluate_toplevel detects
// return values and displays an error in when it encounters one.
function evaluate_toplevel(stmt,env) {
   var value = evaluate(stmt,env);
   if (is_return_value(value)) {
      error("return not allowed outside of function definitions");
   } else {
       return value;
   }
}

// the global environment has bindings for all
// builtin functions, including the operators
var primitive_functions = list(
       pair("pair",          pair),
       pair("head",          head),
       pair("tail",          tail),
       pair("list",          list),
       pair("is_empty_list", is_empty_list),
       pair("display",       display),
       pair("error",         error),
       pair("+",   function(x,y) { return x + y;   }),
       pair("-",   function(x,y) { return x - y;   }),
       pair("*",   function(x,y) { return x * y;   }),
       pair("/",   function(x,y) { return x / y;   }),
       pair("%",   function(x,y) { return x % y;   }),
       pair("===", function(x,y) { return x === y; }),
       pair("!==", function(x,y) { return x !== y; }),
       pair("<",   function(x,y) { return x < y;   }),
       pair("<=",  function(x,y) { return x <= y;  }),
       pair(">",   function(x,y) { return x > y;   }),
       pair(">=",  function(x,y) { return x >= y;  }),
       pair("!",   function(x)   { return ! x;     }),
       pair("&&",  function(x,y) { return x && y;  }),
       pair("||",  function(x,y) { return x || y;  })
       );

// the global environment also has bindings for all
// builtin non-function values, such as undefined and 
// math_PI
var primitive_values = list(
       pair("undefined", undefined),
       pair("math_PI"  , math_PI)
       );
       
// setup_environment makes an environment that has
// one single frame, and adds a binding of all variables
// listed as primitive_functions and primitive_values. 
// The values of primitive functions are "primitive" 
// objects, see line 295 how such functions are applied
function setup_environment() {
   var initial_env = enclose_by(an_empty_frame,
                                the_empty_environment);
   for_each(function(x) {
               define_variable(head(x),
                               { tag: "primitive",
                                 implementation: tail(x) },
                               initial_env);
            },
            primitive_functions);
   for_each(function(x) {
               define_variable(head(x),
                               tail(x),
                               initial_env);
            },
            primitive_values);
   return initial_env;
}

var the_global_environment = setup_environment();

/* 
TESTING with parse_end_evaluate
*/

// parse_and_evaluate
function parse_and_evaluate(str) {
    return evaluate_toplevel(parse(str), the_global_environment);
}

/*
examples:
display(parse_and_evaluate("1;"));
display(parse_and_evaluate("1 + 1;"));
display(parse_and_evaluate("1 + 3 * 4;"));
display(parse_and_evaluate("(1 + 3) * 4;"));
display(parse_and_evaluate("1.4 / 2.3 + 70.4 * 18.3;"));

display(parse_and_evaluate("true;"));
display(parse_and_evaluate("true && false;"));
display(parse_and_evaluate("1 === 1 && true;"));
display(parse_and_evaluate("! 1 === 1;"));
display(parse_and_evaluate("if (! 1 === 1) { 1; } else {2; }"));

display(parse_and_evaluate("list(1,2,3);"));
display(parse_and_evaluate("head(tail(list(1,2,3)));"));
display(parse_and_evaluate("'hello' + ' ' + 'world';"));

display(parse_and_evaluate("while (i < 20) { display(i); i = i + 1; }"));

display(parse_and_evaluate("for (var i = 0; i < 10; i = i + 1) { \
                        display(i); \
                    }"));

display(parse_and_evaluate("function length(xs) { \
                       if (is_empty_list(xs)) { \
                           return 0; \
                       } else { \
                           return 1 + length(tail(xs)); \
                       } \
                    } \
                    length(list(1,2,3,4,5));"));

display(parse_and_evaluate("function append(xs, ys) { \
                       if (is_empty_list(xs)) { \
                           return ys; \
                       } else { \
                           return pair(head(xs), \
                                       append(tail(xs), ys)); \
                       } \
                    } \
                    append(list(1,2,3,4,5),list(6,7,8,9,10));"));
                    
// this example demonstrates the way local variables work
display(parse_and_evaluate("(function (x) { \
                        display(y); \
                        var y = 1; \
                        display(y); \
                     })(1);"));

// objects
display(parse_and_evaluate("{a: 1, b: 2};"));
display(parse_and_evaluate("{a:1, b: 2}.a;"));
display(parse_and_evaluate("var f = {a:function() { return 1;}}; (f.a)();"));
display(parse_and_evaluate("var obj={a: function(x) { return x+1; }, \
                             b: 2}; \
                    (obj.a)(3);"));
display(parse_and_evaluate("var obj={a: function(x) { return this.b+x; }, \
                             b: 2}; \
                    obj.a(3);"));
display(parse_and_evaluate("function f() {} new f();"));
display(parse_and_evaluate("function f() {this.a = 1;} new f();"));
display(parse_and_evaluate("function f() {this.a = 1;} new f().a;"));

display(parse_and_evaluate("function F() { \
                        this.a = 1;} \
                    F.prototype.m = function(y) {this.b = y;}; \
                    var obj = new F(); \
                    obj.m(2); \
                    display(obj.a); \
                    display(obj.b); \
"));

display(parse_and_evaluate("function F() {this.a = 1;}\
                    F.prototype.m = function(y) {\
                                        display('a');\
                                        this.b = y;\
                                    };\
                    F.prototype.n = function(y) {\
                        display(y);\
                        F.prototype.m.call(this, y);\
                    };\
                    var obj = new F();\
                    obj.n(2); \
                    display(obj.a); \
                    display(obj.b);\
"));

display(parse_and_evaluate("function F() {this.a = 1;}\
                    F.prototype.m = function(y) {\
                                        display('a');\
                                        this.b = y;\
                                    };\
                    F.prototype.n = function(y) {\
                        display(y);\
                        F.prototype.m.call(this, y);\
                    };\
                    var obj = new F();\
                    obj.n(2); \
                    display(obj.a); \
                    display(obj.b);\
"));

display(parse_and_evaluate("function F(x) {\
                        this.a = x;\
                    }\
                    F.prototype.n = function(y) {\
                                        this.b = y;\
                                    };\
                    function G(z) {\
                        this.c = z;\
                        F.call(1);\
                    }\
                    G.Inherits(F);\
                    G.prototype.n = function(v) {\
                                       F.prototype.n.call(this, v+1);\
                                    };\
                    var g = new G(33);\
                    obj.n(2); \
                    display(obj.a); \
                    display(obj.b);\
"));

display(parse_and_evaluate("function F(x) {\
                        this.a = x;\
                    }\
                    F.prototype.n = function(y) {\
                                        this.b = y;\
                                    };\
                    function G(z) {\
                        this.c = z;\
                        F.call(this,1);\
                    }\
                    G.Inherits(F);\
                    G.prototype.n = function(v) {\
                                       F.prototype.n.call(this, v+1);\
                                    };\
                    var g = new G(33);\
                    g.n(2); \
                    display(g.a); \
                    display(g.b);\
                    display(g.c);\
"));

*/

/*
READ_EVAL_PRINT LOOP
*/

// for interactive interpretation
// (terminate session by pressing OK
//  with empty string)
function read_eval_print_loop(history) {
   var prog = prompt("History:" + history + 
                     "\n\n" + "Enter next: ");
   if (prog === "") {
       display("session has ended");
   } else {
       var res = parse_and_evaluate(prog);
       read_eval_print_loop(history + "\n" + 
                            prog + " ===> " + res);
   }
}

/*
read_eval_print_loop("");
*/



