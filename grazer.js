class Grazer {

  constructor(pos_vector, vel_vector, spec_brain = 0) {

    /*
      This is way too much stuff, clean it up
    */

    this.brain_size = [5, 15, 3]
    this.fov = 200
    this.mutation_rate = 0.1
    this.mutation_strength = 0.5
    this.max_speed = 5
    this.turn_speed = 30

    this.score = 0
    this.bonus = 0
    this.pos = pos_vector
    this.vel = vel_vector
    this.ray_list = []

    this.ray_coords = []
    this.initialize_rays()

    this.brain = new Brain(this.brain_size, spec_brain)
    this.path = [] // List of [x, y] location pairs
    this.background = true



  }

  highlight() {
    // draw a circle on the ground beneath the grazer_rays
    angleMode(DEGREES)
    noStroke()
    if (this.rank == 0) {
      fill(255, 166, 0, 75)
    } else if (this.rank == 1) {
      fill(128, 128, 128, 75)
    } else if (this.rank == 2) {
      fill(122, 48, 1, 75)
    }

    push()
    translate(this.pos.x, this.pos.y);
    ellipse(0, 0, 30)
    pop()
  }

  show_body() {
    // Set the stroke and fill for the grazer
    angleMode(DEGREES)
    fill(40, 120, 0, 25);
    noStroke()
    if (!this.background) {
      fill(40, 120, 0)
    }

    // Draw the body of the grazer
    push()
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-10, 10, -10, -10, 15, 0);
    pop()
  }

  show_rays(top_lef, bot_rig) {
    // Draw the rays in the correct color
    if (this.rank == 0) {
      stroke(255, 166, 0, 75)
    } else if (this.rank == 1) {
      stroke(128, 128, 128, 75)
    } else if (this.rank == 2) {
      stroke(122, 48, 1, 75)
    } else {
      stroke(255)
    }
    // draw all the lines only inside the area specified
    for (let c of this.ray_coords) {
      display.draw_line_in_box(top_lef, bot_rig, c)
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
    // record the position of the grazer its path
    this.path.push([this.pos.x, this.pos.y])

    // Get the outputs from the brain and use accordingly
    let [turn_left,turn_right,move] = this.use_brain(food_list)

    // set brain's output in the appropriate fields
    this.vel.setMag(move)
    this.pos.add(this.vel)
    this.vel.rotate(turn_left)
    this.vel.rotate(-turn_right)
  }

  use_brain(food_list) {
    let rays = this.look(food_list)
    let inputs = []
    for (let i = 0; i < rays.length; i++){
      inputs[i] = rays[i]
    }
    return this.brain.feed_forward(inputs)

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

  mutate() {
    this.brain.mutate(this.mutation_rate, this.mutation_strength)
  }
}
