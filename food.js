class Food {

  constructor(pos_vector) {

    this.pos = pos_vector
    this.radius = 15
  }

  show() {
    noStroke()
    fill(80, 0, 80)
    ellipse(this.pos.x, this.pos.y, this.radius);
  }

  get_eaten(){

    this.pos = createVector(random(width), random(height))

  }

  //<script src="libraries/p5.dom.js"></script>
	//<script src="libraries/p5.sound.js"></script>

}
