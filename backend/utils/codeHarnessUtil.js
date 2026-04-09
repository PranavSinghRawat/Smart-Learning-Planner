function generateStarterCode(sig, lang) {
  const { name, parameters, return_type } = sig;
  const paramsStr = parameters.map(p => `${p.name}`).join(', ');

  switch (lang) {
    case 'javascript':
      return `/**\n * @param {${parameters.map(p => p.type).join(', ')}} ${parameters.map(p => p.name).join(', ')}\n * @return {${return_type}}\n */\nfunction ${name}(${paramsStr}) {\n  // Write your logic here\n}`;
    case 'python':
      return `def ${name}(${paramsStr}):\n    # Write your logic here\n    pass`;
    case 'java':
      const javaParams = parameters.map(p => `${mapToJavaType(p.type)} ${p.name}`).join(', ');
      return `public class Solution {\n    public ${mapToJavaType(return_type)} ${name}(${javaParams}) {\n        // Write your logic here\n        return ${getDefaultReturn(return_type)};\n    }\n}`;
    case 'cpp':
      const cppParams = parameters.map(p => `${mapToCppType(p.type)} ${p.name}`).join(', ');
      return `class Solution {\npublic:\n    ${cppParams.length > 0 ? `${mapToCppType(return_type)} ${name}(${cppParams})` : `${mapToCppType(return_type)} ${name}()`} {\n        // Write your logic here\n    }\n};`;
    default:
      return '';
  }
}

function generateDriverCode(sig, testCases, lang) {
  const { name, parameters, return_type } = sig;
  
  // Wash the test cases: The AI sometimes returns arrays as strings instead of real arrays.
  const washTests = (tests) => (tests || []).map(tc => {
    const washedInput = {};
    for (const [k, v] of Object.entries(tc.input)) {
       let val = v;
       if (typeof val === 'string') {
         val = val.trim();
         if (val.startsWith('[') && val.endsWith(']')) {
           try { val = JSON.parse(val); } catch(e) { }
         } else if (/^-?\d+(\s+-?\d+)+$/.test(val)) {
           // Handle space-separated numbers like "1 2 3 4" => [1, 2, 3, 4]
           val = val.split(/\s+/).map(Number);
         } else if (/^-?\d+(,-?\d+)+$/.test(val.replace(/\s/g, ''))) {
           // Handle comma separated like "1,2,3" or "1, 2, 3" => [1, 2, 3]
           val = val.replace(/\s/g, '').split(',').map(Number);
         }
       }
       washedInput[k] = val;
    }
    return { ...tc, input: washedInput };
  });

  const allTests = [...washTests(testCases.public), ...washTests(testCases.hidden)];
  
  switch (lang) {
    case 'javascript':
      let jsHarness = '';
      if (sig.parameters.some(p => p.type === 'ListNode') || return_type === 'ListNode') {
        jsHarness += `class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }\n`;
      }
      return jsHarness;

    case 'python':
      let pyHarness = `import json\nimport sys\n\n`;
      if (sig.parameters.some(p => p.type === 'ListNode') || return_type === 'ListNode') {
        pyHarness += `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\n`;
        pyHarness += `def to_list_node(arr):\n    if not arr: return None\n    head = ListNode(arr[0])\n    curr = head\n    for i in range(1, len(arr)):\n        curr.next = ListNode(arr[i]); curr = curr.next\n    return head\n\ndef from_list_node(head):\n    res = []\n    while head:\n        res.append(head.val); head = head.next\n    return res\n\n`;
      }
      
      pyHarness += `test_cases = ${JSON.stringify(allTests)}\n\n`;
      pyHarness += `for i, tc in enumerate(test_cases):\n    try:\n`;
      const pyArgs = parameters.map(p => {
        if (p.type === 'ListNode') return `to_list_node(tc['input']['${p.name}'])`;
        return `tc['input']['${p.name}']`;
      }).join(', ');
      pyHarness += `        res = ${name}(${pyArgs})\n`;
      if (return_type === 'ListNode') pyHarness += `        res = from_list_node(res)\n`;
      pyHarness += `        print(json.dumps(res))\n`;
      pyHarness += `    except Exception as e:\n        print(str(e), file=sys.stderr)\n`;
      return pyHarness;

    case 'java':
      let javaHarness = `import java.util.*;\n\n`;
      if (sig.parameters.some(p => p.type === 'ListNode') || return_type === 'ListNode') {
        javaHarness += `class ListNode { int val; ListNode next; ListNode(int x) { val = x; } }\n\n`;
        javaHarness += `class LLUtil {\n    static ListNode fromArr(int[] arr) {\n        if (arr == null || arr.length == 0) return null;\n        ListNode head = new ListNode(arr[0]); ListNode curr = head;\n        for(int i=1; i<arr.length; i++) { curr.next = new ListNode(arr[i]); curr = curr.next; }\n        return head;\n    }\n    static List<Integer> toList(ListNode head) {\n        List<Integer> res = new ArrayList<>();\n        while(head != null) { res.add(head.val); head = head.next; }\n        return res;\n    }\n}\n\n`;
      }
      
      javaHarness += `public class Runner {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n`;
      
      allTests.forEach((tc, i) => {
        javaHarness += `        try {\n`;
        // Setup inputs
        parameters.forEach(p => {
          let val = tc.input[p.name];
          const mappedType = mapToJavaType(p.type);

          if (mappedType === 'int[]') {
            // Clean content: remove brackets and spaces
            const cleanContent = String(val).replace(/[\[\]\s]/g, '');
            javaHarness += `            int[] arg_${p.name} = new int[]{ ${cleanContent} };\n`;
          } else if (mappedType === 'ListNode') {
            const cleanContent = String(val).replace(/[\[\]\s]/g, '');
            javaHarness += `            ListNode arg_${p.name} = LLUtil.fromArr(new int[]{ ${cleanContent} });\n`;
          } else if (mappedType === 'String') {
             javaHarness += `            String arg_${p.name} = "${val}";\n`;
          } else {
            javaHarness += `            ${mappedType} arg_${p.name} = ${val};\n`;
          }
        });
        
        // Call and print
        const javaArgs = parameters.map(p => `arg_${p.name}`).join(', ');
        javaHarness += `            var res_${i} = sol.${name}(${javaArgs});\n`;
        if (return_type === 'ListNode') {
          javaHarness += `            System.out.println(LLUtil.toList(res_${i}));\n`;
        } else if (return_type.includes('[]')) {
          javaHarness += `            System.out.println(Arrays.toString(res_${i}));\n`;
        } else {
          javaHarness += `            System.out.println(res_${i});\n`;
        }
        javaHarness += `        } catch (Exception e) {\n            System.err.println(e.getMessage());\n        }\n`;
      });
      
      javaHarness += `    }\n}\n`;
      return javaHarness;

    default:
      return '';
  }
}

function mapToJavaType(type) {
  const t = type.toLowerCase();
  if (t === 'int' || t === 'integer') return 'int';
  if (t === 'float' || t === 'double') return 'double';
  if (t === 'boolean' || t === 'bool') return 'boolean';
  if (t === 'string') return 'String';
  if (t.includes('array') || t.includes('[]')) return 'int[]'; // Default to int[] for arrays if ambiguous
  const map = { 'int': 'int', 'float': 'double', 'boolean': 'boolean', 'string': 'String', 'int[]': 'int[]', 'listnode': 'ListNode', 'treenode': 'TreeNode' };
  return map[t] || 'int'; // Default to int instead of Object to be safe
}

function mapToCppType(type) {
  const t = type.toLowerCase();
  if (t === 'int' || t === 'integer') return 'int';
  if (t === 'float' || t === 'double') return 'double';
  if (t === 'boolean' || t === 'bool') return 'bool';
  if (t === 'string') return 'string';
  if (t.includes('array') || t.includes('[]')) return 'vector<int>';
  const map = { 'int': 'int', 'float': 'double', 'boolean': 'bool', 'string': 'string', 'int[]': 'vector<int>', 'listnode': 'ListNode*', 'treenode': 'TreeNode*' };
  return map[t] || 'int';
}

function getDefaultReturn(type) {
  const t = type.toLowerCase();
  if (t === 'int' || t === 'integer') return '0';
  if (t === 'boolean' || t === 'bool') return 'false';
  if (t === 'string') return '""';
  if (t.includes('[]') || t.includes('array')) return 'new int[]{}';
  return 'null';
}

module.exports = { generateStarterCode, generateDriverCode };
