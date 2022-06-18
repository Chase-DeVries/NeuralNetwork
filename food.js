class Food {

  constructor(pos_vector) {

    this.pos = pos_vector
    this.radius = 15
  }

  show(index) {
    noStroke()
    fill(80, 0, 80)
    ellipse(this.pos.x, this.pos.y, this.radius);
    fill(255)
    let text_size = 25
    textSize(text_size)
    textAlign(CENTER)
    text(index+1, this.pos.x, this.pos.y+text_size/3)
  }

  get_eaten(){

    this.pos = createVector(random(width), random(height))

  }

  //<script src="libraries/p5.dom.js"></script>
	//<script src="libraries/p5.sound.js"></script>

}
