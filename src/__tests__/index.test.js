// implement the tests here using Jest

const { addFilter, FilterFunction, process } = require("..");

const mainOutput = require("./output.json");
const mainOperations = require("./operations.json");
const mainShapes = require("./shapes.json");

let output, operations, shapes;
beforeEach(() => {
  // Create DeepCopy of the variables before tests
  output = JSON.parse(JSON.stringify(mainOutput));
  operations = JSON.parse(JSON.stringify(mainOperations));
  shapes = JSON.parse(JSON.stringify(mainShapes));
});

it("should result must be same with output.json", async () => {
  const result = process(shapes, operations);
  expect(result).toEqual(output);
});

it("should equal with newOutput data when custom filter added", () => {
  // add new filter type
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
  // add new operations for filtering process
  const newOperations = [
    ...operations,
    {
      type: "filter",
      property: "color",
      value: "red",
      operator: "neq",
    },
  ];
  // remove first item of output.json
  // this data will be used for comparison.
  const newOutput = output.slice(1);
  try {
    const result = process(shapes, newOperations);
    expect(result).toEqual(newOutput);
  } finally {
    delete FilterFunction["color"];
  }
});
