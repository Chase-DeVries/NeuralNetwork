/*
// TODO:

- program function
  - start a survival, reproduction mode with current population
  - create a brain and put it into the next generation
  - add poison food, display and input differently

- adjustments while program is running
  -

- display
  -
*/

function setup() {
  ellipseMode(RADIUS)
  angleMode(DEGREES)
  createCanvas(windowWidth, windowHeight);

  generation_length = 750
  frame_count = 0
  generation_count = 1

  // Create state manager to communicate the state of the program
  state_manager = new StateManager()

  // Create a shepard object for the sketch to manage grazers and food
  shepard = new Shepard()

  // Create an input manager object for the sketch to send keypress / mouse info
  input_manager = new InputManager()

  // Create a display object for the sketch request drawing
  display = new Display()
/*
  GOOD BRAINS:
  [5, 3, 3]
  [10, 10, 10, 3]
*/

}

function draw() {
  background(0);
  run_simulation()
  display.draw_gui(shepard)
}

function run_simulation(){

  if (state_manager.paused == false){
    // Tell the shepard to draw all the grazers and food
    shepard.show()
    // updates the frame count
    frame_count += 1
  }
  // spawns new generation after allowed time
  if (frame_count >= generation_length && state_manager.paused == false){
    shepard.new_generation()
  }
}

function keyPressed(){
  input_manager.manage_keypress(keyCode)
}

function mousePressed(){
  input_manager.manage_mousepress(mouseX, mouseY)
}
