const { generateDriverCode } = require('./backend/utils/codeHarnessUtil');

const sig = {
  name: "findMaxElement",
  parameters: [{ name: "arr", type: "int[]" }],
  return_type: "int"
};

const testCases = {
  public: [
    { input: { arr: [1, 2, 3, 4, 5] }, output: 5 }
  ],
  hidden: [
    { input: { arr: [-1, -2, -3, -4, -5] }, output: -1 }
  ]
};

try {
  console.log("=== JAVA DRIVER ===");
  console.log(generateDriverCode(sig, testCases, 'java'));
} catch(e) {
  console.error(e);
}
