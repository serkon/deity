const operations = require("./__tests__/operations.json");
const shapes = require("./__tests__/shapes.json");

/**
 * @param {object[]} shapes - array of shapes to process
 * @param {object[]} operations - array of operations to apply
 * @returns {object[]} processed shapes
 */
function process(shapes, operations) {
  const result = shapes.reduce((previous, shape) => {
    const t = operations.every((operation) => {
      return FilterFunction[operation.property || operation.action](
        shape,
        operation
      );
    });
    return t ? [...previous, shape] : previous;
  }, []);

  console.log(result);
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
    const value = util.area[shape.type](shape);
    return controls(operation, value);
  },
  circumference: (shape, operation) => {
    const value = util.circumference[shape.type](shape);
    return controls(operation, value);
  },
  scale: (shape, operation) => {
    util.scale[shape.type](shape, operation);
    return true;
  },
  move: (shape, operation) => {
    util.move(shape, operation);
    return true;
  },
};

const controls = (operation, value) => {
  let result = false;
  if (operation.operator === "in") {
    const [small, big] = operation.value;
    result = small < value && big > value;
  } else if (operation.operator === "gt") {
    result = operation.value < value;
  } else if (operation.operator === "lt") {
    result = operation.value > value;
  } else if (operation.operator === "eq") {
    result = operation.value === value;
  } else if (operation.operator === "neq") {
    result = operation.value !== value;
  }
  return result;
};

const util = {
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

/**
 * Add new filter
 */
addFilter("color", (shape, operation) => {
  switch (operation.operator) {
    case "neq":
      return shape.color !== operation.value;
    case "eq":
      return shape.color === operation.value;
    default:
      return true;
  }
});

/**
 * Sample: new filter added to operations
 */
const newOperations = [
  ...operations,
  {
    type: "filter",
    property: "color",
    value: "red",
    operator: "neq",
  },
];

process(shapes, newOperations);

module.exports = {
  process,
  addFilter,
};
