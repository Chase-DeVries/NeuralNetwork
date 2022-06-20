class Display {
  constructor() {}

  draw_gui(shepard) {
    if (state_manager.paused == false){
      let tot_score = 0
      for (let grazer of shepard.grazer_list){
        tot_score += grazer.score + grazer.bonus
      }
      let avg_score = tot_score / shepard.grazer_list.length

      textSize(100)
      textAlign(LEFT)
      noStroke()

      fill(80,160,80, 160)
      text("pop: " + str(shepard.grazer_list.length), 20, 90)

      fill(80, 80,160, 160)
      text("score: " + avg_score.toFixed(2), 20, 190)

      fill(160, 80,80, 160)
      text("time: " + round(generation_length - frame_count, 2), 20, 290)

      fill(160, 160, 160, 160)
      text("gen: " + round(state_manager.generation_count), 20, 390)
    }
    else {
      noStroke()
      // show header
      fill(80, 40, 40)
      textSize(100)
      text('PAUSED (space)', 10, 100)

      // show menu box
      rectMode(CORNERS)
      fill(60)
      rect(20, 130, width - 20, height - 20)


      fill(0)
      text('Rank: '+(state_manager.display_index + 1)+'       Score: '+shepard.score_to_i[state_manager.display_index][0].toFixed(2), 30, 350)
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
        createVector(rig_x, bot_y), true)
    }
  }

  draw_path(grazer, top_lef, bot_rig, draw_food=false) {

    let prev_wid = width
    let prev_hei = height

    let new_wid = bot_rig.x - top_lef.x
    let new_hei = bot_rig.y - top_lef.y

    let x_ratio = new_wid/prev_wid
    let y_ratio = new_hei/prev_hei

    // Draw a frame around the area for the path
    fill(0)
    rect(top_lef.x, top_lef.y, bot_rig.x, bot_rig.y)

    fill(80, 0, 80)
    let path = grazer.path
    if (draw_food) {
      for (let i = 0; i < grazer.score; i++) {
        let x = shepard.food_list[i].pos.x * x_ratio + top_lef.x
        let y = shepard.food_list[i].pos.y * y_ratio + top_lef.y
        ellipse(x, y, 10)
      }
    }

    stroke(140)
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
        line(x1, y1, x2, y2)
      }
    }
  }

  draw_brain(brain, top_lef, bot_rig) {
    //let brain_list = brain_size
    let weights = brain.weights
    let bias = brain.bias

    // get lists of brian info for display
    let brain_display_info = this.get_brain_display_info(brain, top_lef, bot_rig)
    let neuron_info = brain_display_info[0]
    let weight_info = brain_display_info[1]

    // Draw each weight in the brain
    for (let weight of weight_info){
      if (weight[0] > 0.2 || weight[0] < -0.2){
        let green = map(weight[0], -2, 2, 0, 255)
        let red = map(weight[0], -2, 2, 255, 0)
        stroke(red, green, 0)
        line(weight[1], weight[2], weight[3], weight[4])
      }
    }
    // Draw each neuron in the brian
    noStroke()
    for (let neuron = 0; neuron < neuron_info.length; neuron++){
      let green = map(neuron_info[neuron][0], -2, 2, 0, 255)
      let red = map(neuron_info[neuron][0], -2, 2, 255, 0)
      fill(red, green, 0)
      ellipse(neuron_info[neuron][1], neuron_info[neuron][2], 20)
      // Label the output neurons
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

  get_brain_display_info(brain, top_left_vec, bot_right_vec) {
    // gets brain elements
    let brain_skele = brain.brain
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
    for (let layer = 0; layer < brain_skele.length; layer++){
      for (let neuron1 = 0; neuron1 < brain_skele[layer]; neuron1++){

        // create a list: [bias, x_coor, y_coor] for each neuron
        let bias = brain_bias[layer][neuron1]
        let coor_vec = this.get_neuron_coor(brain_skele, layer, neuron1, x_min, x_max, y_min, y_max)
        let this_neuron = [bias, coor_vec.x, coor_vec.y]
        neuron_disp.push(this_neuron)

        // if this layer is not the last layer
        if (layer < brain_skele.length - 1){
          // for each neuron in the next layer
          for (let neuron2 = 0; neuron2 < brain_skele[layer + 1]; neuron2++){
            // create a list: [weight, x_coor_1, y_coor_1, x_coor_2, y_coor_2] for each weight
            let weight = brain_weights[layer][neuron1][neuron2]
            let vec1 = this.get_neuron_coor(brain_skele, layer, neuron1, x_min, x_max, y_min, y_max)
            let vec2 = this.get_neuron_coor(brain_skele, layer+1, neuron2, x_min, x_max, y_min, y_max)
            let this_weight = [weight, vec1.x, vec1.y, vec2.x, vec2.y]
            weight_disp.push(this_weight)
          }
        }
      }
    }

    let out = [neuron_disp, weight_disp]
    return out
  }

  get_neuron_coor(brain_skele, layer, neuron, x_min, x_max, y_min, y_max){
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
}
