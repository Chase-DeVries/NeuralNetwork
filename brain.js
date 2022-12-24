class Brain{


  // list of integers
  // list[0] = 6 -> 6 input nodes
  // list.length -> layers

  constructor(brain_list, brain=0){
    this.brain = brain_list

    // weights: weights[layer_num][start_neuron][end_neuron]
    this.weights = []
    // values: values[layer_num][neuron_num]
    this.values = []
    // bias: bias[layer_num][neuron_num]
    this.bias = []

    if (brain == 0) {
      this.randomize_brain()
    } else {
      this.copy_brain(brain)
    }

  }

  // input values for first layer
  // calculate values for next layer until last layer
  feed_forward(input_list){
    for (let i = 0; i < input_list.length; i++){
      this.values[0][i] = this.sigmoid(input_list[i])
      //this.values[0][i] = input_list[i]
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

    return this.sigmoid(weightedSum);
  }

  mutate(mutation_rate, mutation_strength) {
    // For each layer in the brain
    for (let l  = 0; l < this.brain.length - 1; l++) {

      // For each neuron in this layer of the brain
      for (let n1 = 0; n1 < this.weights[l].length; n1++) {

        // Mutate the brain's bias for each neuron on this layer
        // if the random value is less than the mutation rate, mutate
        if (random(0, 1) <= mutation_rate) {
          // mutate the bias by a random percent (mutation strength)
          //let new_bias_val = bias[l][n1] * random(-(1+this.mutation_strength), 1+this.mutation_strength)
          let new_bias_val = this.bias[l][n1] + random(-mutation_strength, mutation_strength)
          //if (new_bias_val > 1) {new_bias_val = 1}
          //if (new_bias_val < -1) {new_bias_val = -1}
          this.bias[l][n1] = new_bias_val
        }

        // If this is not the last layer, mutate the weights to the next layer
        if (l < this.brain.length - 1) {
          // for every neuron in the next layer
          for (let n2 = 0; n2 < (this.weights[l][n1]).length; n2++){
            // roll a random number and compare to mutation rate
            if (random(0, 1) <= mutation_rate){
              // mutate the weight by the mutation strength
              let new_weight_val = this.weights[l][n1][n2] + random(-mutation_strength, mutation_strength)
              //if (new_weight_val > 1) {new_weight_val = 1}
              //if (new_weight_val < -1) {new_weight_val = -1}
              this.weights[l][n1][n2] = new_weight_val
            }
          }
        }
      }
    }
  }

  randomize_brain() {
    // initializes all the variables for a brain
    let bias = []
    let weights = []
    let values = []

    // for each layer in brain_list
    for (let layer = 0; layer < this.brain.length; layer++){
      // for each neuron in this layer
      bias[layer]=[]
      values[layer]=[]
      if (layer < this.brain.length - 1){
        weights[layer]=[]
      }
      for (let neuron = 0; neuron < this.brain[layer]; neuron++){
        bias[layer][neuron] = random(-1,1)
        values[layer][neuron] = 0
        if (layer < this.brain.length - 1){
          weights[layer][neuron]=[]
        }

        // if this isnt the last layer: make weights
        if (layer < this.brain.length - 1){
          for (let next_neuron = 0; next_neuron < this.brain[layer + 1]; next_neuron++){
            weights[layer][neuron][next_neuron] = random(-1,1)
          }
        }
      }
    }

    this.weights = weights
    this.values = values
    this.bias = bias
  }

  copy_brain(brain) {
    if (brain) {
      let new_bias = []
      let new_weight = []
      let new_values = []

      // For each layer in the defined brain structure
      for (let l = 0; l < this.brain.length; l++) {
        new_bias[l] = [...brain.bias[l]]
        new_weight[l] = []
        new_values[l] = []
        // For every neuron on this layer of the brain
        for (let n1 = 0; n1 < this.brain[l]; n1++) {
          // If this neuron is not on the output layer
          new_values[l][n1] = 0
          if (l < this.brain.length - 1) {
            new_weight[l][n1] = [...brain.weights[l][n1]]
          }
        }

        this.bias = new_bias
        this.weights = new_weight
        this.values = new_values
      }
    }
  }

}
