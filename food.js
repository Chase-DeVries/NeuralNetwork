class Food {

  constructor(pos_vector) {

    this.pos = pos_vector
    this.radius = 15
    this.times_eaten = 0
  }

  show(index) {
    noStroke()
    fill(80, 0, 80)
    ellipse(this.pos.x, this.pos.y, this.radius);

    let text_size = 25
    fill(255)
    textSize(text_size)
    textAlign(CENTER)
    text(index+1, this.pos.x, this.pos.y+text_size/3)
  }

  get_eaten() {
    this.times_eaten += 1
  }
}
