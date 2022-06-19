class Shepard {
  constructor() {}

  show() {
    // Rank the grazers
    score_to_i = sort_brains()
    let best_grazer = grazer_list[score_to_i[0][1]]

    // set of the index of food currently being pursued
    let food_set = new Set()

    // Call grazer functions for every grazer
    for (var g = 0; g < grazer_list.length; g++){
      grazer_list[g].update(food_list)
      grazer_list[g].show_score()
      food_set.add(grazer_list[g].score)
    }

    // Call food functions for every food
    for (var index of food_set){
      food_list[index].show(index)
    }

    for (var g = 0; g < grazer_list.length; g++){
      grazer_list[g].show_body()
    }
  }

  new_generation() {
    let next_gen = []
    let i = 0
    let brain
    let vel
    let pos
    score_to_i = sort_brains()

    let curr_index = 0    // highest ranked grazer
    for (i = 0; i < floor(grazer_count / 2); i++) {
      brain = grazer_list[score_to_i[curr_index][1]].brain
      next_gen.push(this.create_grazer(brain))
    }

    curr_index = 1    // 2nd highest ranked grazer
    for (i = 0; i < floor(grazer_count / 4); i++) {
      brain = grazer_list[score_to_i[curr_index][1]].brain
      next_gen.push(this.create_grazer(brain))
    }

    curr_index = 2    // 3rd highest ranked grazer
    for (i = 0; i < floor(grazer_count / 5); i++) {
      brain = grazer_list[score_to_i[curr_index][1]].brain
      next_gen.push(this.create_grazer(brain))
    }

    curr_index = 3    // 4th highest ranked grazer
    while (next_gen.length < grazer_count) {
      brain = grazer_list[score_to_i[curr_index][1]].brain
      next_gen.push(this.create_grazer(brain))
    }

    grazer_list = next_gen
    frame_count = 0
    generation_count += 1
    score_to_i = sort_brains()

    // Reset the random path of food
    manage_food()
  }

  create_grazer(brain) {
    let pos = createVector(width / 2, height / 2)
    let vel = createVector(1, 1)
    let new_g = new Grazer(pos, vel, brain)
    new_g.mutate()
    return new_g
  }
}
