# JS Test

## Preparation

1. Run `npm install` in the root folder of the test

## The test

We provide a set of shapes (located in `src/__tests__/shapes.json`) and we want you to write a mechanism that makes it possible to apply a set of filters and transformations (listed in `src/__tests__/operations.json`) and then return the shapes after those operations (the result should match `src/__tests__/output.json`).

The fully finished solution consists of the following items:

1. Code cleaned up and sent as zip file (please do not include `node_modules`)
2. File `src/index.js` should expose an API for interacting with the solution - API is described in the section [API Specification](#api-specification)
3. There must be at least one test placed in `src/__tests__/index.test.js` that tests the implementation. Tests don't have to cover all the possible cases - it's up to you to decide what should be tested and how much time should be spent on that.
4. We should be able to unzip your package, then run `npm install` and `npm run test` and that should run the tests correctly

It's up to you how you organize the code, as well as what approach you'll take (object oriented, functional) - we have no preference here, just the mentioned api (2 exposed methods) must be preserved.

## API Specification

Created module should export 2 functions:
- `process(shapes, operations)` that performs passed operations on passed shapes
- `addFilter(property, filterFunc)` that adds a new filter. This function allows for adding a new filter definition, that will be used for filtering the shapes. 
For example:

```
addFilter('color', (shape, operation) => {  
  // simplified version as the operator can be different than !==
  return shape.color !== operation.value;
});

// then later in the code:
const newOperations = [
  ...operations, 
  {  
      "type": "filter",  
      "property": "color",  
      "value": "red",  
      "operator": "neq"
  }
];

// and now during processing red color should be correctly filtered out
const output = process(shapes, newOperations);
```


Input and output for these functions is docummented in [index.js](./src/index.js) file. These functions don't have to be implemented inside `src/index.js`, so if it's more convenient to move these somewhere else then it's fine. `src/index.js` however must re-export these so we're able to test the behavior.


Our test tool will:
- load the implemented module
- add new filter definition
- run processing of the shapes
- compare the output with expected values


## What we'll check:

1. Does the test work? (running `npm run test` passes the tests)
2. Does adding of a new filter works?
2. Quality of the code:
   - is the code clean?
   - how well is it structured?
   - is the code commented where it is required? There's no need to add comments to each and every function but if some places contain complex code then it's good to have that commented.
3. Architecture:
   - is it easy to find out how the solution is organized?
   - how hard it would be to add something new to the code (e.g. new transformation)

## Provided data

Current sample data contains the following types of shapes:

#### Rectangle

```
{
  "type": "rectangle",
  "width": 10, // width of the rectangle
  "height" 10, // height of the rectangle
  "x": 30, // x-coordinate of rectangle's center
  "y": 30, // y-coordinate of rectangle's center
  "color": "red" // web color name
}
```

#### Square

```
{
  "type": "square",
  "width": 10, // width of the square
  "x": 10, // x-coordinate of square's center
  "y": 10, // y-coordinate of the square's center
  "color": "red" // web color name
}
```

#### Circle

```
{
  "type": "circle",
  "radius": 10, // radius of the circle
  "x": 50, // x-coordinate of the circle's center
  "y": 50, // y-coordinate of the circle's center
  "color": "red" // web color name
}
```

### Filters and transforms that should be implemented

#### Filter types

1. `area` - area of the shape, sample input:

```
{
  "type": "filter",
  "property": "area",
  "operator": "lt",
  "value": 5
}
```

2. `circumference` - circumference of the shape, sample input:

```
{
  "type": "filter",
  "property": "circumference",
  "operator": "lt",
  "value": 20
}
```

#### Filters operators

1. If `operator` of the filter is `lt` (less than), then it should allow only items which value is less than the passed `value`

For example, if the filter config is the following:

```
{
  "type": "filter",
  "property": "area",
  "operator": "lt",
  "value": 10
}
```

then filter should allow only shapes with area less than 10 (so remove all the shapes with area equal to or greater than 10)

2. If `operator` is `gt` then it should work in the opposite way - allow only shapes with e.g. area greater than 10.

3. If `operator` is `in` then it should allow only for shapes that e.g. area is in range given range:

```
{
  "type": "filter",
  "property": "area",
  "operator": "in",
  "value": [10, 20] // greater than 10 and less than 20
}
```

5. If `operator` is `eq` then it should allow only for shapes where requested property equals passed value
```
{
  "type": "filter",
  "property": "area",
  "operator": "eq",
  "value": 30
}
```

6. If `operator` is `neq` then it should allow only for shapes where requested property is different from passed value
```
{
  "type": "filter",
  "property": "area",
  "operator": "neq",
  "value": 40
}
```

7. If the operator is different than those listed above then filter should return all the items (skip filtering).

> NOTE: All the operators should use strict comparison (`<`, `>`, not `>=`, `<=`)

#### Transforms

> NOTE: please use `Math.round()` on all the values computed during transformations (i.e. when computing new width during scaling: `width = Math.round(shape.width * transform.factor)`).

1. `scale` - scales the shape by the passed `factor`, sample input:

```
{
  "type": "transform",
  "action": "scale",
  "factor": 2
}
```

To keep things simple, `scale` transformation changes only edges and radius (x, y position is be ignored)

2. `move` - moves the shape by passed coordinate, sample input:

```
{
  "type": "transform",
  "action": "move",
  "x": 10,
  "y": -5
}
```

## Final notes
It's not required to explain the implementation but if you feel it's something that may help with understanding your choices or decisions then feel free to replace README.md with your own comments or explanations.
