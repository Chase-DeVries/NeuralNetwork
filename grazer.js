class Grazer {

  constructor(pos_vector, vel_vector, spec_brain = 0) {

    this.brain_size = [5,10,3]
    this.fov = 200
    this.mutation_rate = 0.1
    this.mutation_strength = 0.5
    this.max_speed = 3
    this.turn_speed = 30

    this.score = 0
    this.bonus = 0
    this.pos = pos_vector
    this.vel = vel_vector
    this.ray_lengths = []
    this.ray_list = []

    this.ray_coords = []

    this.initialize_rays()
    this.brain = new Brain(this.brain_size)
    this.path = [] // List of [x, y] location pairs
    this.background = true


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
    if (!this.background) {
      fill(40, 120, 0)
    }
    noStroke()
    triangle(-10, 10, -10, -10, 15, 0);

    pop()
  }

  show_rays(top_lef, bot_rig) {
    if (this.rank == 0) {
      stroke(255, 166, 0, 75)
    } else if (this.rank == 1) {
      stroke(128, 128, 128, 75)
    } else if (this.rank == 2) {
      stroke(122, 48, 1, 75)
    } else {
      stroke(255)
    }
    for (let c of this.ray_coords) {
      this.draw_line_in_box(top_lef, bot_rig, c)
    }
  }

  look(food_list){
    let inputs = []
    let base_angle = createVector(1,0)
    let delta = this.vel.angleBetween(base_angle)
    if(this.vel.y < 0){delta *= -1}
    this.ray_coords = []
    let prev_score = this.score

    // For each ray, look for food
    for (let i = 0; i < this.ray_list.length; i++){
      let scoring = (this.score == prev_score)
      inputs[i] = this.ray_tracer(this.pos, (delta + this.ray_list[i]), food_list[prev_score], scoring)
    }
    return inputs
  }

  update(food_list){
    /*
      this should be happening inside of the brain, not here
    */
    let rays = this.look(food_list)
    let inputs = []
    for (let i = 0; i < rays.length; i++){
      inputs[i] = rays[i]
    }
    let out = this.brain.feed_forward(inputs)

    let turn_left = this.brain.sigmoid(out[0]) * this.turn_speed
    let turn_right = this.brain.sigmoid(out[1]) * this.turn_speed
    let move = this.brain.sigmoid(out[2]) * this.max_speed

    this.vel.setMag(move)
    this.pos.add(this.vel)
    this.vel.rotate(turn_left)
    this.vel.rotate(-turn_right)
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

  ray_tracer(starting_point, direction, food, scoring) {
    /*
      this function does way too much. should not also eat the food
    */
    let total_length = 0            // The current length of the ray
    let iter = 8                   // The maximum number of iterations for a ray

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
      if (food_dist <= 20 && !eaten && scoring){
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

      if (/*this.showing_rays == true*/false){
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
      this.ray_coords.push([p_initial.x, p_initial.y, p_initial.x + step.x, p_initial.y + step.y])
      // updates p_initial
      p_initial = createVector(p_initial.x + step.x, p_initial.y + step.y)
      // counts one iteration
      iter--
      if (min_dist <= 1.5){ray_end = 1}
      if (min_dist > 1.5){ray_end = 0}
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
          //let new_bias_val = bias[l][n1] * random(-(1+this.mutation_strength), 1+this.mutation_strength)
          let new_bias_val = bias[l][n1] + random(-this.mutation_strength, this.mutation_strength)
          //if (new_bias_val > 1) {new_bias_val = 1}
          //if (new_bias_val < -1) {new_bias_val = -1}
          bias[l][n1] = new_bias_val
        }

        // If this is not the last layer, mutate the weights to the next layer
        if (l < brain_list.length - 1) {
          // for every neuron in the next layer
          for (let n2 = 0; n2 < (weights[l][n1]).length; n2++){
            // roll a random number and compare to mutation rate
            if (random(0, 1) <= this.mutation_rate){
              // mutate the weight by the mutation strength
              //let new_weight_val = weights[l][n1][n2]*random(-(1+this.mutation_strength), 1+this.mutation_strength)
              let new_weight_val = weights[l][n1][n2] + random(-this.mutation_strength, this.mutation_strength)
              //if (new_weight_val > 1) {new_weight_val = 1}
              //if (new_weight_val < -1) {new_weight_val = -1}
              weights[l][n1][n2] = new_weight_val
            }
          }
        }
      }
    }
    this.brain.weights = weights
    this.brain.bias = bias
  }

  draw_line_in_box(top_lef, bot_rig, c) {
    // If the starting point is inside the box
    if (!(c[0] < top_lef.x || c[0] > bot_rig.x ||
    c[1] < top_lef.y || c[1] > bot_rig.y))
    {
      // If the ending point is inside the box
      if (!(c[2] < top_lef.x || c[2] > bot_rig.x ||
      c[3] < top_lef.y || c[3] > bot_rig.y))
      {
        line(c[0],c[1],c[2],c[3])
      } else {
        // If the first point is inside the box but the second is not
        let [a1, b1, c1] = this.get_abc(c[0],c[1],c[2],c[3])
        let slope = -a1/b1

        // Starting and end point of the line to draw
        let l1 = createVector(c[0],c[1])
        let l2 = createVector(c[2],c[3])

        let bot_lef = createVector(top_lef.x, bot_rig.y)
        let top_rig = createVector(bot_rig.x, top_lef.y)

        let p1, p2

        if (slope >= 0 && b1 >= 0) {
          // Intersection with right and bottom
          p1 = this.get_intersection(l1, l2, top_rig, bot_rig)
          p2 = this.get_intersection(l1, l2, bot_lef, bot_rig)
        } else if (slope >= 0 && b1 < 0) {
          // Intersection with left and top
          p1 = this.get_intersection(l1, l2, bot_lef, top_lef)
          p2 = this.get_intersection(l1, l2, top_rig, top_lef)
        } else if (slope < 0 && b1 >= 0) {
          // Intersection with right and top
          p1 = this.get_intersection(l1, l2, bot_rig, top_rig)
          p2 = this.get_intersection(l1, l2, top_rig, top_lef)
        } else if (slope < 0 && b1 < 0) {
          // Intersection with left and bottom
          p1 = this.get_intersection(l1, l2, bot_lef, top_lef)
          p2 = this.get_intersection(l1, l2, bot_lef, bot_rig)
        }

        let dist_p1 = createVector(p1.x - l1.x, p1.y - l1.y).mag()
        let dist_p2 = createVector(p2.x - l1.x, p2.y - l1.y).mag()

        if (dist_p1 < dist_p2) {
          line(l1.x, l1.y, p1.x, p1.y)
        } else {
          line(l1.x, l1.y, p2.x, p2.y)
        }
      }
    }
  }

  get_intersection(p1, p2, p3, p4) {
    let [a1, b1, c1] = this.get_abc(p1.x, p1.y, p2.x, p2.y)
    let [a2, b2, c2] = this.get_abc(p4.x, p4.y, p3.x, p3.y)

    let x = ((b1*c2 - b2*c1)/(a1*b2 - a2*b1))
    let y = ((c1*a2 - c2*a1)/(a1*b2 - a2*b1))

    return createVector(x, y)
  }

  get_abc(x1, y1, x2, y2) {
    let a = -(y2 - y1)
    let b = (x2 - x1)
    let c = -(a * x2 + b * y2)
    return [a, b, c]
  }
}
