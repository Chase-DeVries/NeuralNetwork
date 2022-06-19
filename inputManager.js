class InputManager {
  constructor() {}

  manage_keypress(keyCode) {
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

  manage_mousepress(x_pos, y_pos) {
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
}
