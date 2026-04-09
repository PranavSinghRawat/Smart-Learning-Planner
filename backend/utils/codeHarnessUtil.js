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
      
      if (sig.parameters.some(p => p.type.toLowerCase().includes('tree')) || return_type.toLowerCase().includes('tree')) {
        pyHarness += `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef to_tree_node(arr):\n    if not arr: return None\n    from collections import deque\n    root = TreeNode(arr[0])\n    q = deque([root])\n    i = 1\n    while q and i < len(arr):\n        curr = q.popleft()\n        if i < len(arr) and arr[i] is not None:\n            curr.left = TreeNode(arr[i])\n            q.append(curr.left)\n        i += 1\n        if i < len(arr) and arr[i] is not None:\n            curr.right = TreeNode(arr[i])\n            q.append(curr.right)\n        i += 1\n    return root\n\ndef from_tree_node(root):\n    if not root: return []\n    from collections import deque\n    res = []\n    q = deque([root])\n    while q:\n        curr = q.popleft()\n        if curr:\n            res.append(curr.val)\n            q.append(curr.left)\n            q.append(curr.right)\n        else:\n            res.append(None)\n    while res and res[-1] is None: res.pop()\n    return res\n\n`;
      }
      
      pyHarness += `test_cases = ${JSON.stringify(allTests)}\n\n`;
      pyHarness += `for i, tc in enumerate(test_cases):\n    try:\n`;
      const pyArgs = parameters.map(p => {
        if (p.type.toLowerCase().includes('listnode')) return `to_list_node(tc['input']['${p.name}'])`;
        if (p.type.toLowerCase().includes('tree')) return `to_tree_node(tc['input']['${p.name}'])`;
        return `tc['input']['${p.name}']`;
      }).join(', ');
      pyHarness += `        res = ${name}(${pyArgs})\n`;
      if (return_type.toLowerCase().includes('listnode')) pyHarness += `        res = from_list_node(res)\n`;
      if (return_type.toLowerCase().includes('tree')) pyHarness += `        res = from_tree_node(res)\n`;
      pyHarness += `        print(json.dumps(res))\n`;
      pyHarness += `    except Exception as e:\n        print(str(e), file=sys.stderr)\n`;
      return pyHarness;

    case 'java':
      let javaHarness = `import java.util.*;\n\n`;
      if (sig.parameters.some(p => p.type === 'ListNode') || return_type === 'ListNode') {
        javaHarness += `class ListNode { int val; ListNode next; ListNode(int x) { val = x; } }\n\n`;
        javaHarness += `class LLUtil {\n    static ListNode fromArr(int[] arr) {\n        if (arr == null || arr.length == 0) return null;\n        ListNode head = new ListNode(arr[0]); ListNode curr = head;\n        for(int i=1; i<arr.length; i++) { curr.next = new ListNode(arr[i]); curr = curr.next; }\n        return head;\n    }\n    static List<Integer> toList(ListNode head) {\n        List<Integer> res = new ArrayList<>();\n        while(head != null) { res.add(head.val); head = head.next; }\n        return res;\n    }\n}\n\n`;
      }
      
      if (sig.parameters.some(p => mapToJavaType(p.type) === 'TreeNode') || mapToJavaType(return_type) === 'TreeNode') {
        javaHarness += `class TreeNode { int val; TreeNode left; TreeNode right; TreeNode() {} TreeNode(int val) { this.val = val; } TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; } }\n\n`;
        javaHarness += `class TreeUtil {\n    static TreeNode fromArr(Integer[] arr) {\n        if (arr == null || arr.length == 0) return null;\n        TreeNode root = new TreeNode(arr[0]);\n        Queue<TreeNode> q = new LinkedList<>();\n        q.add(root);\n        int i = 1;\n        while (!q.isEmpty() && i < arr.length) {\n            TreeNode curr = q.poll();\n            if (arr[i] != null) {\n                curr.left = new TreeNode(arr[i]);\n                q.add(curr.left);\n            }\n            i++;\n            if (i < arr.length && arr[i] != null) {\n                curr.right = new TreeNode(arr[i]);\n                q.add(curr.right);\n            }\n            i++;\n        }\n        return root;\n    }\n    static List<Integer> toList(TreeNode root) {\n        List<Integer> res = new ArrayList<>();\n        if (root == null) return res;\n        Queue<TreeNode> q = new LinkedList<>();\n        q.add(root);\n        while (!q.isEmpty()) {\n            TreeNode curr = q.poll();\n            if (curr != null) {\n                res.add(curr.val);\n                q.add(curr.left);\n                q.add(curr.right);\n            } else {\n                res.add(null);\n            }\n        }\n        while (res.size() > 0 && res.get(res.size() - 1) == null) res.remove(res.size() - 1);\n        return res;\n    }\n}\n\n`;
      }
      
      javaHarness += `public class Runner {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n`;
      
      allTests.forEach((tc, i) => {
        javaHarness += `        try {\n`;
        // Setup inputs
        parameters.forEach(p => {
          let val = tc.input[p.name];
          const mappedType = mapToJavaType(p.type);

          if (mappedType === 'int[]') {
            const cleanContent = String(val).replace(/[\[\]\s]/g, '');
            javaHarness += `            int[] arg_${p.name} = new int[]{ ${cleanContent} };\n`;
          } else if (mappedType === 'int[][]') {
            const cleanContent = JSON.stringify(val).replace(/\[/g, '{').replace(/\]/g, '}');
            javaHarness += `            int[][] arg_${p.name} = new int[][]{ ${cleanContent.substring(1, cleanContent.length - 1)} };\n`;
          } else if (mappedType === 'String[]') {
            const cleanContent = Array.isArray(val) ? val.map(v => '"' + v + '"').join(',') : '';
            javaHarness += `            String[] arg_${p.name} = new String[]{ ${cleanContent} };\n`;
          } else if (mappedType === 'ListNode') {
            const cleanContent = String(val).replace(/[\[\]\s]/g, '');
            javaHarness += `            ListNode arg_${p.name} = LLUtil.fromArr(new int[]{ ${cleanContent} });\n`;
          } else if (mappedType === 'TreeNode') {
            const cleanContent = Array.isArray(val) ? val.map(v => v === null ? 'null' : v).join(',') : String(val).replace(/[\[\]\s]/g, '');
            javaHarness += `            TreeNode arg_${p.name} = TreeUtil.fromArr(new Integer[]{ ${cleanContent} });\n`;
          } else if (mappedType === 'String') {
             javaHarness += `            String arg_${p.name} = "${val}";\n`;
          } else {
            javaHarness += `            ${mappedType} arg_${p.name} = ${val};\n`;
          }
        });
        
        // Call and print
        const javaArgs = parameters.map(p => `arg_${p.name}`).join(', ');
        javaHarness += `            var res_${i} = sol.${name}(${javaArgs});\n`;
        const mappedReturn = mapToJavaType(return_type);
        if (mappedReturn === 'ListNode') {
          javaHarness += `            System.out.println(LLUtil.toList(res_${i}));\n`;
        } else if (mappedReturn === 'TreeNode') {
          javaHarness += `            System.out.println(TreeUtil.toList(res_${i}));\n`;
        } else if (mappedReturn.includes('[][]')) {
          javaHarness += `            System.out.println(Arrays.deepToString(res_${i}));\n`;
        } else if (mappedReturn.includes('[]')) {
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
  if (t.includes('string[]') || t.includes('array of string')) return 'String[]';
  if (t.includes('int[][]') || t.includes('matrix') || t.includes('2d array') || t.includes('grid')) return 'int[][]';
  if (t.includes('tree') || t.includes('treenode')) return 'TreeNode';
  if (t.includes('listnode') || t.includes('linked')) return 'ListNode';
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
