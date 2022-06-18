class Brain{


  // list of integers
  // list[0] = 6 -> 6 input nodes
  // list.length -> layers

  constructor(brain_list){
    this.brain = brain_list
    // weights: weights[layer_num][start_neuron][end_neuron]
    let weights = []
    // values: values[layer_num][neuron_num]
    let values = []
    // bias: bias[layer_num][neuron_num]
    let bias = []


    // initializes all the variables for a brain
    // for each layer in brain_list
    for (let layer = 0; layer < brain_list.length; layer++){
      // for each neuron in this layer
      bias[layer]=[]
      values[layer]=[]
      if (layer < brain_list.length - 1){
        weights[layer]=[]
      }
      for (let neuron = 0; neuron < brain_list[layer]; neuron++){
        bias[layer][neuron] = random(-1,1)
        values[layer][neuron] = 0
        if (layer < brain_list.length - 1){
          weights[layer][neuron]=[]
        }

        // if this isnt the last layer: make weights
        if (layer < brain_list.length - 1){
          for (let next_neuron = 0; next_neuron < brain_list[layer + 1]; next_neuron++){
            weights[layer][neuron][next_neuron] = random(-1,1)
          }
        }
      }
    }


    this.weights = weights
    this.values = values
    this.bias = bias
  }

  // input values for first layer
  // calculate values for next layer until last layer
  feed_forward(input_list){
    for (let i = 0; i < input_list.length; i++){
      this.values[0][i] = this.sigmoid(input_list[i])
    }

    // calculates the values for each layer based on inputs
    for (let l = 1; l < this.brain.length; l++) {
      for (let n = 0; n <= this.brain[l] - 1; n++) {
        this.values[l][n] = this.calcValue(l, n);
      }
    }

    //print(this.values[this.brain.length - 1])
    return this.values[this.brain.length - 1]

  }

  sigmoid(value){
    return (2 / (1 + exp(-1 * value)))
  }

  calcValue(layer, neuron) {
    // assigns a value to values[layer][neuron]
    let weightedSum = 0;

    // layer cannot be 0, layer 0 is the input layer
    for (let i = 0; i < this.brain[layer - 1]; i++) {
      weightedSum += (this.values[layer - 1][i] * this.weights[layer - 1][i][neuron]);
    }
    weightedSum += this.bias[layer][neuron]

    return (this.sigmoid(weightedSum));
  }

}
