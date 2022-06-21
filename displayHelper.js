class DisplayHelper {
  constructor() {}

  draw_line_in_box(top_lef, bot_rig, c) {
    // top_lef : box corner coordinate
    // bot_rig : box corner coordinate
    // c : line start and end coordinates as [x1, y1, x2, y2]

    // If the starting point of the line is within the box
    if (!(c[0] < top_lef.x || c[0] > bot_rig.x ||
    c[1] < top_lef.y || c[1] > bot_rig.y))
    {
      // If the ending point is inside the box
      if (!(c[2] < top_lef.x || c[2] > bot_rig.x ||
      c[3] < top_lef.y || c[3] > bot_rig.y))
      {
        line(c[0],c[1],c[2],c[3])
      } else {
        // If the first point is inside the box but the second is not
        let [a1, b1, c1] = this.get_abc(c[0],c[1],c[2],c[3])
        let slope = -a1/b1

        // Starting and end point of the line to draw
        let l1 = createVector(c[0],c[1])
        let l2 = createVector(c[2],c[3])

        let bot_lef = createVector(top_lef.x, bot_rig.y)
        let top_rig = createVector(bot_rig.x, top_lef.y)

        let p1, p2

        if (slope >= 0 && b1 >= 0) {
          // Intersection with right and bottom
          p1 = this.get_intersection(l1, l2, top_rig, bot_rig)
          p2 = this.get_intersection(l1, l2, bot_lef, bot_rig)
        } else if (slope >= 0 && b1 < 0) {
          // Intersection with left and top
          p1 = this.get_intersection(l1, l2, bot_lef, top_lef)
          p2 = this.get_intersection(l1, l2, top_rig, top_lef)
        } else if (slope < 0 && b1 >= 0) {
          // Intersection with right and top
          p1 = this.get_intersection(l1, l2, bot_rig, top_rig)
          p2 = this.get_intersection(l1, l2, top_rig, top_lef)
        } else if (slope < 0 && b1 < 0) {
          // Intersection with left and bottom
          p1 = this.get_intersection(l1, l2, bot_lef, top_lef)
          p2 = this.get_intersection(l1, l2, bot_lef, bot_rig)
        }

        let dist_p1 = createVector(p1.x - l1.x, p1.y - l1.y).mag()
        let dist_p2 = createVector(p2.x - l1.x, p2.y - l1.y).mag()

        if (dist_p1 < dist_p2) {
          line(l1.x, l1.y, p1.x, p1.y)
        } else {
          line(l1.x, l1.y, p2.x, p2.y)
        }
      }
    }
  }

  get_intersection(p1, p2, p3, p4) {
    let [a1, b1, c1] = this.get_abc(p1.x, p1.y, p2.x, p2.y)
    let [a2, b2, c2] = this.get_abc(p4.x, p4.y, p3.x, p3.y)

    let x = ((b1*c2 - b2*c1)/(a1*b2 - a2*b1))
    let y = ((c1*a2 - c2*a1)/(a1*b2 - a2*b1))

    return createVector(x, y)
  }

  get_abc(x1, y1, x2, y2) {
    let a = -(y2 - y1)
    let b = (x2 - x1)
    let c = -(a * x2 + b * y2)
    return [a, b, c]
  }

  get_brain_display_info(brain, top_lef, bot_rig) {
    // gets brain elements
    let brain_skele = brain.brain
    let brain_weights = brain.weights
    let brain_bias = brain.bias

    // initializes output lists
    let neuron_disp = []
    let weight_disp = []

    // iterates thru every combination of layer, neuron1, neuron2
    for (let layer = 0; layer < brain_skele.length; layer++){
      for (let neuron1 = 0; neuron1 < brain_skele[layer]; neuron1++){

        // create a list: [bias, x_coor, y_coor] for each neuron
        let bias = brain_bias[layer][neuron1]
        let coor_vec = this.get_neuron_coor(top_lef, bot_rig, brain_skele, layer, neuron1)
        let this_neuron = [bias, coor_vec.x, coor_vec.y]
        neuron_disp.push(this_neuron)

        // if this layer is not the last layer
        if (layer < brain_skele.length - 1){
          // for each neuron in the next layer
          for (let neuron2 = 0; neuron2 < brain_skele[layer + 1]; neuron2++){
            // create a list: [weight, x_coor_1, y_coor_1, x_coor_2, y_coor_2] for each weight
            let weight = brain_weights[layer][neuron1][neuron2]
            let vec1 = this.get_neuron_coor(top_lef, bot_rig, brain_skele, layer, neuron1)
            let vec2 = this.get_neuron_coor(top_lef, bot_rig, brain_skele, layer+1, neuron2)
            let this_weight = [weight, vec1.x, vec1.y, vec2.x, vec2.y]
            weight_disp.push(this_weight)
          }
        }
      }
    }

    let out = [neuron_disp, weight_disp]
    return out
  }

  get_neuron_coor(top_lef, bot_rig, brain_size, layer, neuron) {
    // calculates a neuron's position within specified space and returns as a vector

    // calculates x spacing between layers and returns neuron's x coor
    let x_spacing = (bot_rig.x - top_lef.x) / (brain_size.length)
    let x_coor = (x_spacing / 2) + (x_spacing * layer)

    // calculates y spacing for a single layer and returns neuron's y coor
    let y_spacing = (bot_rig.y - top_lef.y) / (brain_size[layer])
    let y_coor = (y_spacing / 2) + (y_spacing * neuron)

    // return a vector of the neuron's coordinates
    let out = createVector(x_coor + top_lef.x, y_coor + top_lef.y)
    return out
  }
}
