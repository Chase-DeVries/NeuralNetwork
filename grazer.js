class Grazer {

  constructor(pos_vector, vel_vector, spec_brain = 0) {

    this.brain_size = [9,30, 3]
    this.fov = 200
    this.mutation_rate = 0.05
    this.mutation_strength = 0.25
    this.max_speed = 5
    this.turn_speed = 30

    this.score = 0
    this.bonus = 0
    this.pos = pos_vector
    this.vel = vel_vector
    this.ray_lengths = []
    this.ray_list = []
    this.initialize_rays()
    this.brain = new Brain(this.brain_size)
    this.path = [] // List of [x, y] location pairs
    this.showing_rays = false


    if (spec_brain) {
      let new_weight = []
      let new_bias = []

      // For each layer in the defined brain structure
      for (let l = 0; l < this.brain_size.length; l++) {
        new_bias.push([...spec_brain.bias[l]])

        new_weight.push([])

        // For every neuron on this layer of the brain
        for (let n1 = 0; n1 < this.brain_size[l]; n1++) {
          // If this neuron is not on the output layer
          if (l < this.brain_size.length - 1) {
            new_weight[l][n1] = [...spec_brain.weights[l][n1]]
          }
        }
        this.brain.weights = new_weight
        this.brain.bias = new_bias
      }
    }
  }

  highlight() {
    // draw a circle on the ground beneath the grazer_rays

    angleMode(DEGREES)
    push()
    translate(this.pos.x, this.pos.y);

    noStroke()

    if (this.rank == 0) {
      fill(255, 166, 0, 75)
    } else if (this.rank == 1) {
      fill(128, 128, 128, 75)
    } else if (this.rank == 2) {
      fill(122, 48, 1, 75)
    }

    ellipse(0, 0, 30)

    pop()
  }

  show_body() {

    // record the position of the grazer in path
    this.path.push([this.pos.x, this.pos.y])



    // draw the body of the grazer
    angleMode(DEGREES)
    push()
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());

    fill(40, 120, 0, 25);
    if (this.showing_rays) {
      fill(40, 120, 0)
    }
    noStroke()
    triangle(-10, 10, -10, -10, 15, 0);

    pop()
  }

  look(food_list){
    let inputs = []
    let base_angle = createVector(1,0)
    let delta = this.vel.angleBetween(base_angle)
    if(this.vel.y < 0){delta *= -1}

    for (let i = 0; i < this.ray_list.length; i++){
      inputs[i] = this.ray_tracer(this.pos, (delta + this.ray_list[i]), food_list[this.score])
    }
    return inputs
  }

  update(food_list){
    let rays = this.look(food_list)
    let inputs = []
    for (let i = 0; i < rays.length; i++){
      //print(inputs[i] + '')
      inputs[i] = rays[i]
    }
    let out = this.brain.feed_forward(inputs)

    let turn_left = this.brain.sigmoid(out[0]) * this.turn_speed
    let turn_right = this.brain.sigmoid(out[1]) * this.turn_speed
    let move = this.brain.sigmoid(out[2]) * this.max_speed


    this.vel.rotate(turn_left)
    this.vel.rotate(-turn_right)
    this.vel.setMag(move)
    this.pos.add(this.vel)

  }

  initialize_rays(){
    this.ray_list = []

    let delta_angle = (this.fov / (this.brain_size[0] - 1))
    let dir_list = []

    // creates a list of angles for rays
    for (let x = 0; x < this.brain_size[0]; x++) {
      let r = (this.fov / 2) - (delta_angle * (x));
      dir_list.push(r)
    }
    this.ray_list = dir_list
  }

  ray_tracer(starting_point, direction, food){
    let total_length = 0            // The current length of the ray
    let iter = 10                   // The maximum number of iterations for a ray

    let ray_end
    let ray_length

    let eaten = false

    // starting point of the ray
    let p_initial = starting_point

    // direction of the ray
    let dir = createVector(1,0)
    dir.rotate(direction)

    while(iter > 0) {

      // finds the nearest ball and:
        // draws a line that distance in specified direction,
        // and a circle that radius at start point
        // updates starting point

      // Look for the next food in the path of food
      let dis = dist(food.pos.x, food.pos.y, p_initial.x, p_initial.y) - food.radius

      // finds dist to nearest ball
      let min_dist = width * height

      // If the distance to this food is less than the min, it is the min
      if (dis < min_dist){
        min_dist = dis
      }

      let food_dist = dist(this.pos.x, this.pos.y, food.pos.x, food.pos.y)

      // If we are within the radius of the food, eat it
      if (food_dist <= 20 && !eaten){
        eaten = true
        this.score += 1
        food.get_eaten()
        this.bonus += 1/(food.times_eaten+1)
      }

      // creates step var, a vector in the direction of the ray
      let step = dir
      // sets step mag to the distance to nearest food
      step.setMag(min_dist)
      // adds the step length to the total length of the ray
      total_length += min_dist

      if (this.showing_rays == true){
        // draws a line from starting point that distance in direction dir
        if (this.rank == 0) {
          stroke(255, 166, 0, 75)
        } else if (this.rank == 1) {
          stroke(128, 128, 128, 75)
        } else if (this.rank == 2) {
          stroke(122, 48, 1, 75)
        }
        line(p_initial.x, p_initial.y, p_initial.x + step.x, p_initial.y + step.y)

        // draws a circle at starting point of radius dis
        //noFill()
        //stroke(0,255,0)
        //circle(p_initial.x, p_initial.y, min_dist)
      }

      // updates p_initial
      p_initial = createVector(p_initial.x + step.x, p_initial.y + step.y)
      // counts one iteration
      iter--
      if (min_dist <= 0.5){ray_end = 1}
      if (min_dist > 0.5){ray_end = 0}
    }

    ray_length = (1 - (total_length / (sqrt(width*width + height * height))))

    //print(ray_end)
    return ray_end

  }

  mutate(){

    let weights = this.brain.weights
    let bias = this.brain.bias
    let brain_list = this.brain_size

    // Mutate the grazer's brain's weights and bias'

    // For each layer in the brain
    for (let l  = 0; l < brain_list.length - 1; l++) {

      // For each neuron in this layer of the brain
      for (let n1 = 0; n1 < weights[l].length; n1++) {

        // Mutate the brain's bias for each neuron on this layer
        // if the random value is less than the mutation rate, mutate
        if (random(0, 1) <= this.mutation_rate) {
          // mutate the bias by a random percent (mutation strength)
          let new_bias_val = bias[l][n1] * random(-(1+this.mutation_strength), 1+this.mutation_strength)
          if (new_bias_val > 1) {new_bias_val = 1}
          if (new_bias_val < -1) {new_bias_val = -1}
          bias[l][n1] = new_bias_val
        }

        // If this is not the last layer, mutate the weights to the next layer
        if (l < brain_list.length - 1) {
          // for every neuron in the next layer
          for (let n2 = 0; n2 < (weights[l][n1]).length; n2++){
            // roll a random number and compare to mutation rate
            if (random(0, 1) <= this.mutation_rate){
              // mutate the weight by the mutation strength
              let new_weight_val = weights[l][n1][n2]*random(-(1+this.mutation_strength), 1+this.mutation_strength)
              if (new_weight_val > 1) {new_weight_val = 1}
              if (new_weight_val < -1) {new_weight_val = -1}
              weights[l][n1][n2] = new_weight_val
            }
          }
        }
      }
    }
    this.brain.weights = weights
    this.brain.bias = bias
  }

}
