## The Cybernetic Enhancement

After the massive carnage of the Reading Assessment II and the defeat of even the most accomplished Cadets, the Grandmaster is worried that the environment model is really too difficult for Cadets to analyse quickly. After pacing back and forth in his office, he soon stumbles upon an elegant solution: a cybernetic enhancement fitted to each Cadet&#39;s brain to enable them instantly look at a program and comprehend its full environment.

Unfortunately, Cadets&#39; brains vary wildly, so each cybernetic enhancement has to be custom-made. The Grandmaster decides to let the Cadets build their own cybernetic enhancements, as he believes that they have all the necessary skills to do so at this point. He asks Instructor Turtis and Instructor Ognale to prepare some cybernetics kits so that the Cadets have an easier time. After creating the kits and nearly deleting the Academy&#39;s database in the process, Turtis and Ognale set up a collection point in the Great Hall.

## The REAL Essence of Pixel

After collecting your cybernetics kit, you proceed back to your room. You arrive just in time to see a strange man slip into your room. You&#39;ve been seeing this man all over the Academy for some time now, and you wonder just who in space he is. You enter the room to confront him and... you see Pixel sitting on your bed. There is no sign of the man.

You stand there for a moment, stunned. You reach for the bottle of Henz&#39;s Essence of Recursion on your table, to help you regain your senses. You take a gulp of the salty liquid and look at your bed again. Pixel is still there.

Pixel notices your confusion and explains herself: &quot;You&#39;re the first fellow Cadet I&#39;m revealing my secret to. I&#39;m not actually human. I belong to a race of beings called the Mandelbrots, and I can switch between various forms. I didn&#39;t reveal myself because I was afraid of being ostracised by the other Cadets for being an alien.&quot;

You are intrigued. &quot;So, do you have a true form?&quot; you ask. Pixel replies: &quot;I do, but I cannot show you. You see, my true form is actually a fractal, and I cannot switch to it as it takes infinitely long to switch. Perhaps, once we finish building our cybernetic enhancements, I can show you an approximation. But let this be a secret between us. I don&#39;t want anyone else to know.&quot;

You think back to the days when you and Pixel were struggling together with the dragon curve. Why was Pixel, a fractal being, even struggling with fractal curves? You take another swig of the Essence of Recursion to drown all these fractal thoughts, and get back to the task at hand.

## The Essence of the Source

Slowly and surely, your cybernetic enhancement begins to take form. But as you soon discover, the Grandmaster has given you a truly challenging task. In order to activate your cybernetic enhancement, you need to seek out and manipulate the very Essence of the Source.... 

### Task 1

Your task is to augment the Source to keep track of the number of frames created during the execution of a program. You should have a function called `count_frames_created` that takes in a Source program string and returns the total number of frames (excluding the global environment frame, of course).

Feel free to declare global variables in the interpreter program and generally do whatever you like, but please **document your changes**.

### Task 2

Your task is to augment the Source to keep track of the number of function calls made during the execution of a program. You should have a function called `count_calls_made` that takes in a Source program string and returns the total number of function calls made.

Feel free to declare global variables in the interpreter program and generally do whatever you like, but please **document your changes**.

### Task 3

Your task is to augment the Source to keep track of the number of arrays created during the execution of a program. You should have a function called `count_arrays_created` that takes in a Source program string and returns the total number of arrays created.

Note that array creation looks either like this: `[]` or like this: `[1,2,3]`. We **ignore** calls to `pair` and `list`, as they are special forms in this particular implementation of the Source (this is different from how we normally draw and analyse environment diagrams). The empty list literal `[]`  is unfortunately indistinguishable from an empty array and hence we have no choice but to count it as an array creation: This is a drawback of using `[]` as an empty list and a good reason to switch to something else in the future, such as `null`.

Feel free to declare global variables in the interpreter program and generally do whatever you like, but please **document your changes**.