class Display {
  constructor() {
    this.display_grazer
    this.display_food = new Food(createVector(0, 0))

    this.display_helper = new DisplayHelper()
  }

  draw_gui(shepard) {
    textAlign(LEFT)
    if (state_manager.paused == false){
      let tot_score = 0
      for (let grazer of shepard.grazer_list){
        tot_score += grazer.score + grazer.bonus
      }
      let avg_score = tot_score / shepard.grazer_list.length

      let text_size = 60
      textSize(text_size)

      noStroke()

      fill(80,160,80, 160)
      text("pop: " + str(shepard.grazer_list.length), 20, text_size)

      fill(80, 80,160, 160)
      text("score: " + avg_score.toFixed(2), 20, text_size*2)

      fill(160, 80,80, 160)
      text("time: " + round(generation_length - frame_count, 2), 20, text_size*3)

      fill(160, 160, 160, 160)
      text("gen: " + round(state_manager.generation_count), 20, text_size*4)
    }
    else {
      noStroke()
      // show header
      fill(80, 40, 40)
      textSize(50)
      text('PAUSED (space)', 10, 50)

      textSize(30)
      fill(100)
      text('Rank: '+(state_manager.display_index + 1), 30, 80)
      text('Score: '+shepard.score_to_i[state_manager.display_index][0].toFixed(2), 30, 110)
      // This actually shows the brain in score_to_i[index]
      // Get the score, index pair from the list (list should be sorted here)
      //current_pair = score_to_i[display_index]
      let grazer_to_show = shepard.grazer_list[shepard.score_to_i[state_manager.display_index][1]]
      let lef_x = 0
      let rig_x = width
      let top_y = height/2
      let bot_y = height

      this.draw_brain(grazer_to_show.brain,
        createVector(lef_x, top_y),
        createVector((lef_x+rig_x)/2, bot_y))

      this.draw_path(grazer_to_show,
        createVector((lef_x+rig_x)/2, top_y),
        createVector(rig_x, bot_y), -1, true)

      this.draw_simulator(createVector(width/2, 0),
        createVector(width, height/2))
    }
  }

  draw_simulator(top_lef, bot_rig) {
    fill(10, 0, 0)
    rect(top_lef.x, top_lef.y, bot_rig.x, bot_rig.y)

    let wid = bot_rig.x-top_lef.x
    let hei = bot_rig.y-top_lef.y
    let mid_x = (top_lef.x+bot_rig.x)/2
    let mid_y = (top_lef.y+bot_rig.y)/2

    let vel_vec = createVector(1, 0)
    let pos_vec = createVector((top_lef.x+bot_rig.x)/2,(top_lef.y+bot_rig.y)/2)
    let brain = shepard.grazer_list[shepard.score_to_i[state_manager.display_index][1]].brain
    this.display_grazer = new Grazer(pos_vec, vel_vec, brain)

    let pos = createVector(mid_x, mid_y)
    if (mouseX < bot_rig.x && mouseX > top_lef.x &&
    mouseY < bot_rig.y && mouseY > top_lef.y) {
      pos = createVector(mouseX, mouseY)
    }


    this.display_food = new Food(pos)

    let rays = this.display_grazer.look([this.display_food])
    let inputs = rays
    let out = brain.feed_forward(rays)

    this.display_food.show()
    this.display_grazer.show_rays(top_lef, bot_rig)
    this.display_grazer.background = false
    this.display_grazer.show_body()

    let turn_left = (out[0]) * this.display_grazer.turn_speed
    let turn_right = (out[1]) * this.display_grazer.turn_speed
    let move = (out[2]) * this.display_grazer.max_speed

    let vel = createVector(1,0)
    vel.setMag(move*2)
    vel.rotate(turn_left)
    vel.rotate(-turn_right)

    stroke(125, 0, 0)
    strokeWeight(3)
    line(pos_vec.x, pos_vec.y, pos_vec.x + vel.x, pos_vec.y +vel.y)
    strokeWeight(1)
  }

  draw_line_in_box(top_lef, bot_rig, c) {
    this.display_helper.draw_line_in_box(top_lef, bot_rig, c)
  }

  draw_path(grazer, top_lef, bot_rig, rank, draw_food=false) {

    let prev_wid = width
    let prev_hei = height

    let new_wid = bot_rig.x - top_lef.x
    let new_hei = bot_rig.y - top_lef.y

    let x_ratio = new_wid/prev_wid
    let y_ratio = new_hei/prev_hei

    if (draw_food) {

      // Draw a frame around the area for the path
      fill(0)
      rect(top_lef.x, top_lef.y, bot_rig.x, bot_rig.y)
      fill(80, 0, 80)
      for (let i = 0; i < grazer.score; i++) {
        let x = shepard.food_list[i].pos.x * x_ratio + top_lef.x
        let y = shepard.food_list[i].pos.y * y_ratio + top_lef.y
        ellipse(x, y, 10)
      }
    }

    stroke(140)

    let path = grazer.path
    // Draw each line segment connecting path coordinates
    for (let i = 0; i < grazer.path.length - 1; i++) {
      let x1 = path[i][0] * x_ratio + top_lef.x
      let y1 = path[i][1] * y_ratio + top_lef.y
      let x2 = path[i+1][0] * x_ratio + top_lef.x
      let y2 = path[i+1][1] * y_ratio + top_lef.y
      // If the line segment is within the screen
      if (!(x1 < top_lef.x || x1 > bot_rig.x ||
      x2 < top_lef.x || x2 > bot_rig.x ||
      y1 < top_lef.y || y1 > bot_rig.y ||
      y2 < top_lef.y || y2 > bot_rig.y)) {
        // Draw the line
        if (draw_food) {
          stroke(255)
        } else if (grazer.rank == 0) {
          stroke(255, 166, 0, 75)
        } else if (grazer.rank == 1) {
          stroke(128, 128, 128, 75)
        } else if (grazer.rank == 2) {
          stroke(122, 48, 1, 75)
        }
        line(x1, y1, x2, y2)
      }
    }
  }

  draw_brain(brain, top_lef, bot_rig) {
    let weights = brain.weights
    let bias = brain.bias

    // get lists of brian info for display
    let [neuron_info, weight_info] = this.display_helper.get_brain_display_info(brain, top_lef, bot_rig)

    // Draw each weight in the brain
    for (let weight of weight_info){
      let green = map(weight[0], -2, 2, 0, 255)
      let red = map(weight[0], -2, 2, 255, 0)
      stroke(red, green, 0)
      line(weight[1], weight[2], weight[3], weight[4])
    }
    // Draw each neuron in the brian
    noStroke()
    for (let neuron = 0; neuron < neuron_info.length; neuron++){
      let green = map(neuron_info[neuron][0], -2, 2, 0, 255)
      let red = map(neuron_info[neuron][0], -2, 2, 255, 0)
      fill(red, green, 0)
      ellipse(neuron_info[neuron][1], neuron_info[neuron][2], 8)
    }
  }
}
