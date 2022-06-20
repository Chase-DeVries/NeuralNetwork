class InputManager {
  constructor() {}

  manage_keypress(keyCode) {
    if (keyCode == 32) {
      // spacebar: pause/unpause
      shepard.sort_brains()
      if (state_manager.paused == true){
        state_manager.paused = false
      } else {
        state_manager.paused = true
      }
    }

    // if down or left arrow during pause
    if (state_manager.paused == true && (keyCode == 37 || keyCode == 40)) {
      // spacebar: pause/unpause
      // moves to the next index of display_index for score_to_i
      state_manager.display_index -= 1
      if (state_manager.display_index < 0){
        state_manager.display_index = shepard.score_to_i.length - 1
      }
    }

    // if up or right arrow during pause
    if (state_manager.paused == true && (keyCode == 38 || keyCode == 39)) {
      // moves to the next index of display_index for score_to_i
      state_manager.display_index += 1
      if (state_manager.display_index >= shepard.score_to_i.length){
        state_manager.display_index = 0
      }
    }
  }

  manage_mousepress(x_pos, y_pos) {
    if (state_manager.paused == true){
      
    }
  }
}
