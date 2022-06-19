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

  // Create a display object for the sketch request drawing
  display = new Display()

  // Create an input manager object for the sketch to send keypress / mouse info
  input_manager = new InputManager()

  // Create a shepard object for the sketch to manage grazers and food
  shepard = new Shepard()

  generation_length = 300
  food_count = 1000
  grazer_count = 300
  brain_size = [11, 20, 6, 3]

  grazer_fov = 180
  grazer_mutation_rate = 0.05
  grazer_mutation_strength = 0.15
  grazer_max_speed = 5
  grazer_turn_speed = 20


  frame_count = 0
  generation_count = 1
  score_to_i = []
  display_index = 0
  grazer_rays = brain_size[0]

  paused = false
  debug = false
  showing_brain = false

  // Initialize the lists for objects
  food_list = []
  grazer_list = []

/*
  GOOD BRAINS:
  [5, 3, 3]
  [10, 10, 10, 3]
*/
  for (let i = 0; i < grazer_count; i++){
    pos = createVector(width / 2, height / 2)
    vel = createVector(1, 1)
    grazer = new Grazer(pos, vel, 0)
    grazer_list.push(grazer)
  }

  manage_food()

}

function draw() {
  background(10);
  run_simulation()
  display.draw_gui()
}

function manage_food(){

  // Generates a random list of food, replaces food_list
  food_list = []

  // Create food and add to the list
  while (food_list.length < food_count) {
    pos = createVector(random(0, width), random(0, height))
    food = new Food(pos)
    food_list.push(food)
  }
}

function run_simulation(){

  if (paused == false){
    // Tell the shepard to draw all the grazers and food
    shepard.show()
    // updates the frame count
    frame_count += 1
  }

  // spawns new generation after alotted time
  if (frame_count >= generation_length && paused == false){
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

  let score_to_i = []           // [ (grazer_index, grazer_score) ]

  for (let i = 0; i < grazer_list.length; i++) {
    grazer_score = grazer_list[i].score + grazer_list[i].bonus;
    grazer_tuple = [grazer_score, i]
    score_to_i.push(grazer_tuple);
  }

  score_to_i.sort(function compareFn(a, b) { return b[0]-a[0] })


  return score_to_i
}
