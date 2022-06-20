class Shepard {
  constructor() {
    this.score_to_i = []
    this.grazer_list = []
    this.food_list = []

    this.grazer_count = 300
    this.food_count = 100

    for (let i = 0; i < this.grazer_count; i++){
      let pos = createVector(width / 2, height / 2)
      let vel = createVector(1, 1)
      let grazer = new Grazer(pos, vel, 0)
      this.grazer_list.push(grazer)
    }

    this.manage_food()

  }

  show() {
    // Rank the grazers
    this.sort_brains()
    let best_grazer = this.grazer_list[this.score_to_i[0][1]]

    let top_lef = createVector(0, 0)
    let bot_rig = createVector(width, height)
    display.draw_path(best_grazer,top_lef, bot_rig)
    best_grazer.highlight()

    // set of the index of food currently being pursued
    let food_set = new Set()

    // Call grazer functions for every grazer
    for (var g = 0; g < this.grazer_list.length; g++){
      this.grazer_list[g].update(this.food_list)
      //this.grazer_list[g].show_score()
      food_set.add(this.grazer_list[g].score)
    }

    // Call food functions for every food
    for (var index of food_set){
      this.food_list[index].show(index)
    }

    for (var g = 0; g < this.grazer_list.length; g++){
      this.grazer_list[g].show_body()
    }
  }

  new_generation() {
    let next_gen = []
    let i = 0
    let brain
    let vel
    let pos
    this.sort_brains()

    let curr_index = 0    // highest ranked grazer
    for (i = 0; i < floor(this.grazer_count / 2); i++) {
      brain = this.grazer_list[this.score_to_i[curr_index][1]].brain
      next_gen.push(this.create_grazer(brain))
    }

    curr_index = 1    // 2nd highest ranked grazer
    for (i = 0; i < floor(this.grazer_count / 4); i++) {
      brain = this.grazer_list[this.score_to_i[curr_index][1]].brain
      next_gen.push(this.create_grazer(brain))
    }

    curr_index = 2    // 3rd highest ranked grazer
    for (i = 0; i < floor(this.grazer_count / 5); i++) {
      brain = this.grazer_list[this.score_to_i[curr_index][1]].brain
      next_gen.push(this.create_grazer(brain))
    }

    curr_index = 3    // 4th highest ranked grazer
    while (next_gen.length < this.grazer_count) {
      brain = this.grazer_list[this.score_to_i[curr_index][1]].brain
      next_gen.push(this.create_grazer(brain))
    }

    this.grazer_list = next_gen
    frame_count = 0
    state_manager.generation_count += 1
    this.sort_brains()

    // Reset the random path of food
    this.manage_food()
  }

  create_grazer(brain) {
    let pos = createVector(width / 2, height / 2)
    let vel = createVector(1, 1)
    let new_g = new Grazer(pos, vel, brain)
    new_g.mutate()
    return new_g
  }

  sort_brains() {
    this.score_to_i = []           // [ (grazer_index, grazer_score) ]

    for (let i = 0; i < this.grazer_list.length; i++) {
      this.grazer_list[i].showing_rays = false
      let grazer_score = this.grazer_list[i].score + this.grazer_list[i].bonus;
      let grazer_tuple = [grazer_score, i]
      this.score_to_i.push(grazer_tuple);
    }
    this.score_to_i.sort(function compareFn(a, b) { return b[0]-a[0] })
    this.grazer_list[this.score_to_i[0][1]].showing_rays = true
  }

  manage_food() {
    // Generates a random list of food, replaces food_list
    this.food_list = []

    // Create food and add to the list
    while (this.food_list.length < this.food_count) {
      let pos = createVector(random(0, width), random(0, height))
      let food = new Food(pos)
      this.food_list.push(food)
    }
  }
}
