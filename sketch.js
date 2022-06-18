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

  generation_length = 3000
  food_count = 10
  grazer_count = 75
  brain_size = [11, 20, 20, 5, 3]

  grazer_fov = 180
  grazer_mutation_rate = 0.10
  grazer_mutation_strength = 0.05
  grazer_max_speed = 3
  grazer_turn_speed = 10


  frame_count = 0
  generation_count = 1
  score_to_i = []
  display_index = 0
  grazer_rays = brain_size[0]

  paused = false
  debug = false
  showing_brain = false
  state = 'welcome'

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
    //vel = p5.Vector.random2D()
    vel = createVector(random(-2, 2), random(-2, 2))
    grazer = new Grazer(pos, vel, 0)
    grazer_list.push(grazer)
  }

}

function draw() {
  background(10);

  handler()
}

function handler(){
  // calls main functions at the appropriate time
  run_simulation()
  draw_gui()
}

function new_gen(){
  let grazer_lottery = []
  let next_gen = []


  // adds
  for (let grazer of grazer_list){
    for (let i = 0; i < grazer.score; i++){
      grazer_lottery.push(grazer.brain)
    }
  }

  for (let j = 0; j < grazer_count; j++){
    rand = int(random(0, grazer_lottery.length - 1))
    let winner_brain = grazer_lottery[rand]
    let winner_grazer = new Grazer(createVector(width / 2, height / 2), createVector(random(-1, 1), random(-1, 1)), winner_brain)
    winner_grazer.mutate()
    next_gen.push(winner_grazer)

  }

  grazer_list = next_gen
  frame_count = 0
  generation_count += 1

}

function new_generation_old(){
  let best_grazer
  let next_gen = []


  // adds
  let max_score = 0
  for (let g = 0; g < grazer_list.length; g++){
    if (grazer_list[g].score > max_score){
      max_score = grazer_list[g].score
      best_grazer = grazer_list[g]
    }
  }

  for (let j = 0; j < grazer_count; j++){
    let winner_grazer = new Grazer(createVector(width / 2, height / 2), createVector(random(-1, 1), random(-1, 1)), best_grazer.brain )
    winner_grazer.mutate()
    next_gen.push(winner_grazer)

  }

  grazer_list = next_gen
  frame_count = 0
  generation_count += 1
}

function new_generation(){

  let next_gen = []
  let i = 0
  let brain
  let vel
  let pos
  score_to_i = sort_brains()

  let curr_index = 0    // highest ranked grazer
  for (i = 0; i < floor(grazer_count / 2); i++) {
    let pos = createVector(width / 2, height / 2)
    let vel = createVector(random(-1, 1), random(-1, 1))
    brain = grazer_list[score_to_i[curr_index][1]].brain
    new_g = new Grazer(pos, vel, brain)
    new_g.mutate()
    next_gen.push(new_g)
  }

  curr_index = 1    // 2nd highest ranked grazer
  for (i = 0; i < floor(grazer_count / 4); i++) {
    let pos = createVector(width / 2, height / 2)
    let vel = createVector(random(-1, 1), random(-1, 1))
    brain = grazer_list[score_to_i[curr_index][1]].brain
    new_g = new Grazer(pos, vel, brain)
    new_g.mutate()
    next_gen.push(new_g)
  }

  curr_index = 2    // 3rd highest ranked grazer
  for (i = 0; i < floor(grazer_count / 5); i++) {
    let pos = createVector(width / 2, height / 2)
    let vel = createVector(random(-1, 1), random(-1, 1))
    brain = grazer_list[score_to_i[curr_index][1]].brain
    new_g = new Grazer(pos, vel, brain)
    new_g.mutate()
    next_gen.push(new_g)
  }

  curr_index = 3    // 4th highest ranked grazer
  while (next_gen.length < grazer_count) {
    console.log(next_gen.length, grazer_count)
    let pos = createVector(width / 2, height / 2)
    let vel = createVector(random(-1, 1), random(-1, 1))
    brain = grazer_list[score_to_i[curr_index][1]].brain
    new_g = new Grazer(pos, vel, brain)
    new_g.mutate()
    next_gen.push(new_g)
  }

  grazer_list = next_gen
  frame_count = 0
  generation_count += 1
  score_to_i = sort_brains()

}

function manage_food(){
  // Initialize the foods spread randomly on the canvas
  if (food_list.length < food_count){
    for (let i = food_list.length; i < food_count; i++){
      pos = createVector(random(0, width), random(0, height))
      food = new Food(pos)
      food_list.push(food)
    }
  }
}

function run_simulation(){

  if (paused == false){

    // Call grazer functions for every grazer
    for (var g = 0; g < grazer_list.length; g++){
      grazer_list[g].update(food_list)
      grazer_list[g].show_score()
    }

    // controls the food population
    manage_food()
    // Call food functions for every food
    for (var food of food_list){
      food.show()
    }

    for (var g = 0; g < grazer_list.length; g++){
      grazer_list[g].show_body()
    }
    // updates the frame count
    frame_count += 1
  }

  // spawns new generation after alotted time
  if (frame_count >= generation_length && paused == false){
    new_generation()
  }


}

function draw_gui(){

  if (paused == false){
    let tot_score = 0
    for (let grazer of grazer_list){
      tot_score += grazer.score
    }
    let avg_score = tot_score / grazer_list.length

    textSize(100)
    noStroke()

    fill(80,160,80, 160)
    text("pop: " + str(grazer_list.length), 20, 90)

    fill(160,80,160, 160)
    text("food: " + food_list.length, 20, 190)

    fill(80, 80,160, 160)
    text("score: " + avg_score.toFixed(2), 20, 290)

    fill(160, 80,80, 160)
    text("time: " + round(generation_length - frame_count, 2), 20, 390)

    fill(160, 160, 160, 160)
    text("gen: " + round(generation_count), 20, 490)
  }
  if (paused == true){
    noStroke()
    // show header
    fill(80, 40, 40)
    textSize(100)
    text('PAUSED (space)', 10, 100)

    // show menu box
    rectMode(CORNERS)
    fill(60)
    rect(20, 130, width - 20, height - 20)

    // show visualize brain button
    fill(20)
    rect(30, 140, 330, 220)
    textSize(50)
    fill(80, 40, 40)
    text('Show Brain', 40, 200)

    // show the debug button (shows ray tracing)
    fill(20)
    rect(30, 230, 330, 310)
    textSize(50)
    fill(80, 40, 40)
    debugString = "(Off)"
    if (debug) {debugString = "(On)"}
    text('Debug ' + debugString, 40, 290)

    // add another food
    fill(20)
    rect(350, 140, 650, 220)
    fill(80, 160, 80)
    text('More Food', 360, 200)

    // remove a food
    fill(20)
    rect(350, 230, 650, 310)
    fill(80, 160, 80)
    text('Less Food', 360, 290)


    if (showing_brain == true){
      fill(0)
      text('Rank: '+(display_index + 1)+'       Score: '+score_to_i[display_index][0], 30, 350)
      // This actually shows the brain in score_to_i[index]
      // Get the score, index pair from the list (list should be sorted here)
      //current_pair = score_to_i[display_index]
      brain_to_show = grazer_list[score_to_i[display_index][1]].brain
      show_brain(brain_to_show)
    }
  }
}

function keyPressed(){
  if (keyCode == 32) {
    // spacebar: pause/unpause
    if (paused == true){
      paused = false
    } else {
      paused = true
    }
  }

  // if down or left arrow during pause
  if (paused == true && (keyCode == 37 || keyCode == 40)) {
    // spacebar: pause/unpause
    // moves to the next index of display_index for score_to_i
    display_index -= 1
    if (display_index < 0){
      display_index = score_to_i.length - 1
    }
  }

  // if up or right arrow during pause
  if (paused == true && (keyCode == 38 || keyCode == 39)) {
    // moves to the next index of display_index for score_to_i
    display_index += 1
    if (display_index >= score_to_i.length){
      display_index = 0
    }
  }
}

function mousePressed(){
  if (paused == true){
    if (mouseX > 30 && mouseX < 330 && mouseY > 140 && mouseY < 220){
      let brain  = grazer_list[0].brain

      if(showing_brain == true){
        showing_brain = false
      } else {
        score_to_i = sort_brains()
        showing_brain = true
      }

    }
    if (mouseX > 30 && mouseX < 330 && mouseY > 230 && mouseY < 310){
      if(debug == true){
        debug = false
      } else {
        debug = true
      }
    }
    //350, 140, 650, 220
    if ( mouseX > 350 && mouseX < 650 && mouseY > 140 && mouseY < 220){
      let poss= createVector(random(width), random(height))
      food_list.push(new Food(poss))
      food_count += 1
    }
    if ( mouseX > 350 && mouseX < 650 && mouseY > 230 && mouseY < 310){
      food_list.splice(0,1)
      food_count -= 1
    }
  }
}

function sort_brains_old(){
  //print('sorting...')
  let best_grazers = []
  let best_scores = [0, 0, 0]
  for (let grazer of grazer_list){
    if (grazer.score > best_scores[0]){
      best_scores[0] = grazer.score
      best_grazers[0] = grazer
    } else if (grazer.score > best_scores[1]) {
      best_scores[1] = grazer.score
      best_grazers[1] = grazer
    } else if (grazer.score > best_scores[2]){
      best_scores[2] = grazer.score
      best_grazers[2] = grazer
    }
  }
  //print('list:')
  //print(best_grazers)
  return best_grazers
}

/*
  Returns a new list of the grazers in the simulation sorted by their score
*/
function sort_brains(){

  let score_to_i = []           // [ (grazer_index, grazer_score) ]

  for (let i = 0; i < grazer_list.length; i++) {
    grazer_score = grazer_list[i].score;
    grazer_tuple = [grazer_list[i].score, i]
    score_to_i.push(grazer_tuple);
  }

  score_to_i.sort(function compareFn(a, b) { return b[0]-a[0] })


  return score_to_i
}

function get_score_brain_index_tuple() {

}

function show_brain(brain){
  // initialize variables
  let top_left = createVector(20, 350)
  let bot_right = createVector(width - 20, height - 20)
  let brain_list = brain_size
  let weights = brain.weights
  let bias = brain.bias

  let display_info = get_display_info(brain, top_left, bot_right)

  let neuron_info = display_info[0]
  let weight_info = display_info[1]


  for (let weight of weight_info){
    if (weight[0] > 0.2 || weight[0] < -0.2){
      let green = map(weight[0], -2, 2, 0, 255)
      let red = map(weight[0], -2, 2, 255, 0)
      stroke(red, green, 0)
      line(weight[1], weight[2], weight[3], weight[4])
    }
  }

  noStroke()
  for (let neuron = 0; neuron < neuron_info.length; neuron++){
    let green = map(neuron_info[neuron][0], -2, 2, 0, 255)
    let red = map(neuron_info[neuron][0], -2, 2, 255, 0)
    fill(red, green, 0)
    ellipse(neuron_info[neuron][1], neuron_info[neuron][2], 20)


    if (neuron >= neuron_info.length - 3){
      fill(35)
      textAlign(LEFT)
      textSize(20)
      if (neuron == neuron_info.length - 3){
        text('Left', neuron_info[neuron][1]+20, neuron_info[neuron][2]+10)
      }
      if (neuron == neuron_info.length - 2){
        text('Right', neuron_info[neuron][1]+20, neuron_info[neuron][2]+10)
      }
      if (neuron == neuron_info.length - 1){
        text('Straight', neuron_info[neuron][1]+20, neuron_info[neuron][2]+10)
      }
    }


  }
}

function get_display_info(brain, top_left_vec, bot_right_vec){

  // gets brain elements
  let brain_skele = brain_size
  let brain_weights = brain.weights
  let brain_bias = brain.bias

  // initializes output lists
  let neuron_disp = []
  let weight_disp = []

  // stores the coordinates for each corner
  let x_min = top_left_vec.x
  let x_max = bot_right_vec.x
  let y_min = top_left_vec.y
  let y_max = bot_right_vec.y

  // iterates thru every combination of layer, neuron1, neuron2
  for (layer = 0; layer < brain_skele.length; layer++){
    for (neuron1 = 0; neuron1 < brain_skele[layer]; neuron1++){

      // create a list: [bias, x_coor, y_coor] for each neuron
      let bias = brain_bias[layer][neuron1]
      let coor_vec = get_neuron_coor(brain_skele, layer, neuron1, x_min, x_max, y_min, y_max)
      let this_neuron = [bias, coor_vec.x, coor_vec.y]
      neuron_disp.push(this_neuron)

      // if this layer is not the last layer
      if (layer < brain_skele.length - 1){
        // for each neuron in the next layer
        for (neuron2 = 0; neuron2 < brain_skele[layer + 1]; neuron2++){
          // create a list: [weight, x_coor_1, y_coor_1, x_coor_2, y_coor_2] for each weight
          let weight = brain_weights[layer][neuron1][neuron2]
          let vec1 = get_neuron_coor(brain_skele, layer, neuron1, x_min, x_max, y_min, y_max)
          let vec2 = get_neuron_coor(brain_skele, layer+1, neuron2, x_min, x_max, y_min, y_max)
          let this_weight = [weight, vec1.x, vec1.y, vec2.x, vec2.y]
          weight_disp.push(this_weight)
        }
      }
    }
  }

  let out = [neuron_disp, weight_disp]
  return out

}

function get_neuron_coor(brain_skele, layer, neuron, x_min, x_max, y_min, y_max){
  // calculates a neuron's position within specified space and returns as a vector

  // calculates x spacing between layers and returns neuron's x coor
  let x_spacing = (x_max - x_min) / (brain_skele.length)
  let x_coor = (x_spacing / 2) + (x_spacing * layer)

  // calculates y spacing for a single layer and returns neuron's y coor
  let y_spacing = (y_max - y_min) / (brain_skele[layer])
  let y_coor = (y_spacing / 2) + (y_spacing * neuron)

  // return a vector of the neuron's coordinates
  let out = createVector(x_coor + x_min, y_coor + y_min)
  return out
}
