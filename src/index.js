const operations = require("./__tests__/operations.json");
const shapes = require("./__tests__/shapes.json");

/**
 * @param {object[]} shapes - array of shapes to process
 * @param {object[]} operations - array of operations to apply
 * @returns {object[]} processed shapes
 */
function process(shapes, operations, deep = true) {
  // first run will change main shapes sizes and positions
  // to prevent this make a deep copy for multiple test request to be give correct result
  const newShapes = deep ? JSON.parse(JSON.stringify(shapes)): shapes;
  const newOperations = deep ? JSON.parse(JSON.stringify(operations)): operations;
  const result = newShapes.reduce(
    (previous, shape) => {
      const status = newOperations.every((operation) =>
        FilterFunction[operation.property || operation.action](shape, operation)
      );
      return status ? [...previous, shape] : previous;
    },
    []
  );
  return result;
}

/**
 * @param {string} property - name of the property that will be used for filter operation
 * @param {FilterFunction} fn - function that will execute filter agains passed shape and return true or false
 */
function addFilter(property, fn) {
  FilterFunction[property] = fn;
}

/**
 * @typedef {function} FilterFunction
 * @param {object} shape - object with shape data (the same format as in shapes.json file)
 * @param {object} operation - object with operation data (the same format as in operations.json file)
 * @return {boolean} - true when shape matches the filter configuration, false when it doesn't match
 *
 * example filter that accepts only shapes with width of 10:
 * function exampleFilter(shape, operation) {
 *   return shape.width === 10;
 * }
 */
const FilterFunction = {
  area: (shape, operation) => {
    const value = helper.area[shape.type](shape);
    return controls(operation, value);
  },
  circumference: (shape, operation) => {
    const value = helper.circumference[shape.type](shape);
    return controls(operation, value);
  },
  scale: (shape, operation) => {
    helper.scale[shape.type](shape, operation);
    return true;
  },
  move: (shape, operation) => {
    helper.move(shape, operation);
    return true;
  },
};

/**
 * common matchers for filtering and transformation operations
 * @param {object} operation - object with operation data (the same format as in operations.json file)
 * @param {number} value - shape value after transformed or before filtered
 * @returns {boolean} - true when shape matches the filter configuration, false when it doesn't match
 */
const controls = (operation, value) => {
  switch (operation.operator) {
    case "in":
      const [small, big] = operation.value;
      return small < value && big > value;
    case "gt":
      return operation.value < value;
    case "lt":
      return operation.value > value;
    case "eq":
      return operation.value === value;
    case "neq":
      return operation.value !== value;
    default:
      return false;
  }
};

/**
 * helper methods calculates circumference, area, scale and move of the shapes
 */
const helper = {
  circumference: {
    circle: ({ radius }) => {
      return Math.round(radius * 2 * Math.PI);
    },
    square: ({ width }) => {
      return Math.round(width * 4);
    },
    rectangle: ({ width, height }) => {
      return Math.round(width + height) * 2;
    },
  },
  area: {
    circle: ({ radius }) => {
      return Math.round(Math.pow(radius, 2) * Math.PI);
    },
    square: ({ width }) => {
      return Math.round(Math.pow(width, 2));
    },
    rectangle: ({ width, height }) => {
      return Math.round(width * height);
    },
  },
  scale: {
    circle: (shape, operation) => {
      shape.radius = Math.round(operation.factor * shape.radius);
    },
    square: (shape, operation) => {
      shape.width = Math.round(operation.factor * shape.width);
    },
    rectangle: (shape, operation) => {
      shape.width = Math.round(operation.factor * shape.width);
      shape.height = Math.round(operation.factor * shape.height);
    },
  },
  move: (shape, operation) => {
    shape.x = shape.x + operation.x;
    shape.y = shape.y + operation.y;
  },
};

// result must be same with output.json
// const result = process(shapes, operations);
// console.log(result);

module.exports = {
  process,
  addFilter,
  FilterFunction,
};
