/*
// TODO:

- program function
  - start a survival, reproduction mode with current population
  - create a brain and put it into the next generation
  - add poison food, display and input differently

- adjustments while program is running
  - food_count
  - brain_size?
  - brazer_count
  - speed, turn, etc..

- display
  - highlight 3 best grazers
  - rank brains in brain_display
  - labels on brain_display
    - input labels
    - output labels
*/

function setup() {
  ellipseMode(RADIUS)
  angleMode(DEGREES)
  createCanvas(windowWidth, windowHeight);

  // Create state manager to communicate the state of the program
  state_manager = new StateManager()

  // Create a shepard object for the sketch to manage grazers and food
  shepard = new Shepard(state_manager)

  // Create an input manager object for the sketch to send keypress / mouse info
  input_manager = new InputManager(state_manager)

  // Create a display object for the sketch request drawing
  display = new Display(state_manager)



  generation_length = 500
  frame_count = 0
  generation_count = 1



/*
  GOOD BRAINS:
  [5, 3, 3]
  [10, 10, 10, 3]
*/

  manage_food()

}

function draw() {
  background(0);
  run_simulation()
  display.draw_gui(shepard)
}

function manage_food(){


}

function run_simulation(){

  if (state_manager.paused == false){
    // Tell the shepard to draw all the grazers and food
    shepard.show()
    // updates the frame count
    frame_count += 1
  }

  // spawns new generation after alotted time
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

function sort_brains(){


}
