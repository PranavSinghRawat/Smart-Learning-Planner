// ─────────────────────────────────────────────────────────────────────────────
// RESOURCES DB — Striver-style: each topic has ordered STEPS
// Each step = { what, resource: {label, url, type}, problems: [{label, url, difficulty}] }
// type: "video" | "article" | "interactive" | "practice"
// difficulty: "Easy" | "Medium" | "Hard"
// ─────────────────────────────────────────────────────────────────────────────
export const RESOURCES = {

  // ══════════════════════════════════════════════════════════════
  // DSA
  // ══════════════════════════════════════════════════════════════
  "Arrays & Strings - Indexing, searching, sorting basics": {
    steps: [
      {
        what: "Understand what arrays are and how indexing works",
        resource: { label: "Striver – Arrays Introduction (Video)", url: "https://www.youtube.com/watch?v=37E9ckMDdTk", type: "video" },
        problems: [
          { label: "Largest Element in Array", url: "https://bit.ly/3Pld280", difficulty: "Easy" },
          { label: "Second Largest Element", url: "https://bit.ly/3pBsdnM", difficulty: "Easy" },
        ],
      },
      {
        what: "Learn linear search and binary search on arrays",
        resource: { label: "Striver – Binary Search Explained (Video)", url: "https://www.youtube.com/watch?v=MHf6awe89xw", type: "video" },
        problems: [
          { label: "Binary Search", url: "https://leetcode.com/problems/binary-search", difficulty: "Easy" },
          { label: "Search Insert Position", url: "https://leetcode.com/problems/search-insert-position", difficulty: "Easy" },
        ],
      },
      {
        what: "Master the sliding window technique for subarrays",
        resource: { label: "NeetCode – Sliding Window (Video)", url: "https://www.youtube.com/watch?v=GcW4mgmgSbw", type: "video" },
        problems: [
          { label: "Maximum Subarray (Kadane's)", url: "https://leetcode.com/problems/maximum-subarray", difficulty: "Medium" },
          { label: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock", difficulty: "Easy" },
        ],
      },
      {
        what: "Two pointer technique on arrays and strings",
        resource: { label: "NeetCode – Two Pointers (Video)", url: "https://www.youtube.com/watch?v=On03HWe2tZM", type: "video" },
        problems: [
          { label: "Two Sum", url: "https://leetcode.com/problems/two-sum", difficulty: "Easy" },
          { label: "Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate", difficulty: "Easy" },
          { label: "Rotate Array", url: "https://leetcode.com/problems/rotate-array", difficulty: "Medium" },
        ],
      },
    ],
  },

  "Linked Lists - Singly linked list, operations": {
    steps: [
      {
        what: "Understand linked list structure — nodes, pointers, traversal",
        resource: { label: "Striver – Linked List Introduction (Video)", url: "https://www.youtube.com/watch?v=Nq7ok-OyEpg", type: "video" },
        problems: [
          { label: "Linked List Cycle", url: "https://leetcode.com/problems/linked-list-cycle", difficulty: "Easy" },
          { label: "Middle of the Linked List", url: "https://leetcode.com/problems/middle-of-the-linked-list", difficulty: "Easy" },
        ],
      },
      {
        what: "Learn insertion, deletion, and reversal operations",
        resource: { label: "Striver – Reverse a Linked List (Video)", url: "https://www.youtube.com/watch?v=D2vI2DNJGd8", type: "video" },
        problems: [
          { label: "Reverse Linked List", url: "https://leetcode.com/problems/reverse-linked-list", difficulty: "Easy" },
          { label: "Remove Nth Node From End", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list", difficulty: "Medium" },
        ],
      },
      {
        what: "Merge and sort linked lists",
        resource: { label: "Striver – Merge Two Sorted Lists (Video)", url: "https://www.youtube.com/watch?v=jXu-H7XuClE", type: "video" },
        problems: [
          { label: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists", difficulty: "Easy" },
          { label: "Sort List", url: "https://leetcode.com/problems/sort-list", difficulty: "Medium" },
        ],
      },
    ],
  },

  "Stacks & Queues - LIFO/FIFO operations": {
    steps: [
      {
        what: "Understand stack — push, pop, peek, LIFO principle",
        resource: { label: "Striver – Stack Introduction (Video)", url: "https://www.youtube.com/watch?v=GYptUgnIM_I", type: "video" },
        problems: [
          { label: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses", difficulty: "Easy" },
          { label: "Min Stack", url: "https://leetcode.com/problems/min-stack", difficulty: "Medium" },
        ],
      },
      {
        what: "Understand queue — enqueue, dequeue, FIFO principle",
        resource: { label: "GFG – Queue Data Structure (Article)", url: "https://www.geeksforgeeks.org/queue-data-structure", type: "article" },
        problems: [
          { label: "Implement Queue using Stacks", url: "https://leetcode.com/problems/implement-queue-using-stacks", difficulty: "Easy" },
          { label: "Number of Recent Calls", url: "https://leetcode.com/problems/number-of-recent-calls", difficulty: "Easy" },
        ],
      },
      {
        what: "Monotonic stack — next greater element pattern",
        resource: { label: "NeetCode – Monotonic Stack (Video)", url: "https://www.youtube.com/watch?v=Dq_ObZwTY_Q", type: "video" },
        problems: [
          { label: "Daily Temperatures", url: "https://leetcode.com/problems/daily-temperatures", difficulty: "Medium" },
          { label: "Next Greater Element I", url: "https://leetcode.com/problems/next-greater-element-i", difficulty: "Easy" },
        ],
      },
    ],
  },

  "Hash Tables - Hashing, collision handling": {
    steps: [
      {
        what: "Understand hashing — hash functions, buckets, collisions",
        resource: { label: "Striver – Hashing Concepts (Video)", url: "https://www.youtube.com/watch?v=KEs5UyBJ39g", type: "video" },
        problems: [
          { label: "Two Sum", url: "https://leetcode.com/problems/two-sum", difficulty: "Easy" },
          { label: "Contains Duplicate", url: "https://leetcode.com/problems/contains-duplicate", difficulty: "Easy" },
        ],
      },
      {
        what: "Use hashmaps to solve frequency and grouping problems",
        resource: { label: "NeetCode – Arrays & Hashing (Video)", url: "https://www.youtube.com/watch?v=1XWmyfnEBlA", type: "video" },
        problems: [
          { label: "Group Anagrams", url: "https://leetcode.com/problems/group-anagrams", difficulty: "Medium" },
          { label: "Top K Frequent Elements", url: "https://leetcode.com/problems/top-k-frequent-elements", difficulty: "Medium" },
          { label: "Longest Consecutive Sequence", url: "https://leetcode.com/problems/longest-consecutive-sequence", difficulty: "Medium" },
        ],
      },
    ],
  },

  "Sorting Basics - Bubble, selection, insertion sort": {
    steps: [
      {
        what: "Understand bubble sort — compare adjacent, swap, O(n²)",
        resource: { label: "Striver – Bubble Sort (Video)", url: "https://www.youtube.com/watch?v=HGk_ypEuS24", type: "video" },
        problems: [
          { label: "Sort Colors (Dutch Flag)", url: "https://leetcode.com/problems/sort-colors", difficulty: "Medium" },
        ],
      },
      {
        what: "Learn selection sort and insertion sort with code",
        resource: { label: "Striver – Selection & Insertion Sort (Video)", url: "https://www.youtube.com/watch?v=bBQkErahU9c", type: "video" },
        problems: [
          { label: "Merge Sorted Array", url: "https://leetcode.com/problems/merge-sorted-array", difficulty: "Easy" },
        ],
      },
      {
        what: "Visualize all sorting algorithms side by side",
        resource: { label: "Visualgo – Sorting Visualizer (Interactive)", url: "https://visualgo.net/en/sorting", type: "interactive" },
        problems: [
          { label: "Insertion Sort List", url: "https://leetcode.com/problems/insertion-sort-list", difficulty: "Medium" },
        ],
      },
    ],
  },

  "Big O Notation - Time & space complexity analysis": {
    steps: [
      {
        what: "Learn what Big O is — O(1), O(n), O(n²), O(log n) with examples",
        resource: { label: "Striver – Time & Space Complexity (Video)", url: "https://www.youtube.com/watch?v=FPu9Uld7W-E", type: "video" },
        problems: [],
      },
      {
        what: "Practice identifying complexity of code snippets",
        resource: { label: "Big-O Cheat Sheet (Reference)", url: "https://www.bigocheatsheet.com", type: "article" },
        problems: [
          { label: "Analyze your Two Sum solution's complexity", url: "https://leetcode.com/problems/two-sum", difficulty: "Easy" },
        ],
      },
    ],
  },

  "Binary Search Trees - BST operations, traversals": {
    steps: [
      {
        what: "Understand BST property — left < root < right, insertion",
        resource: { label: "Striver – BST Introduction (Video)", url: "https://www.youtube.com/watch?v=p7-9UvDQZ3w", type: "video" },
        problems: [
          { label: "Search in a BST", url: "https://leetcode.com/problems/search-in-a-binary-search-tree", difficulty: "Easy" },
          { label: "Insert into a BST", url: "https://leetcode.com/problems/insert-into-a-binary-search-tree", difficulty: "Medium" },
        ],
      },
      {
        what: "Learn inorder, preorder, postorder traversals",
        resource: { label: "Striver – Tree Traversals (Video)", url: "https://www.youtube.com/watch?v=jmy0LaGET1I", type: "video" },
        problems: [
          { label: "Binary Tree Inorder Traversal", url: "https://leetcode.com/problems/binary-tree-inorder-traversal", difficulty: "Easy" },
          { label: "Validate Binary Search Tree", url: "https://leetcode.com/problems/validate-binary-search-tree", difficulty: "Medium" },
        ],
      },
      {
        what: "Solve BST-specific problems — LCA, kth smallest",
        resource: { label: "Striver – BST Problems (Video)", url: "https://www.youtube.com/watch?v=coue2td7gZI", type: "video" },
        problems: [
          { label: "Kth Smallest Element in BST", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst", difficulty: "Medium" },
          { label: "Lowest Common Ancestor of BST", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree", difficulty: "Medium" },
        ],
      },
    ],
  },

  "Graphs & BFS/DFS - Graph representations, traversals": {
    steps: [
      {
        what: "Understand graph representations — adjacency list vs matrix",
        resource: { label: "Striver – Graph Introduction (Video)", url: "https://www.youtube.com/watch?v=M3_pLsDdeuU", type: "video" },
        problems: [
          { label: "Find if Path Exists in Graph", url: "https://leetcode.com/problems/find-if-path-exists-in-graph", difficulty: "Easy" },
        ],
      },
      {
        what: "Learn BFS — level-order traversal, shortest path in unweighted graph",
        resource: { label: "Striver – BFS of Graph (Video)", url: "https://www.youtube.com/watch?v=-tgVpUgsQ5k", type: "video" },
        problems: [
          { label: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands", difficulty: "Medium" },
          { label: "Rotting Oranges", url: "https://leetcode.com/problems/rotting-oranges", difficulty: "Medium" },
        ],
      },
      {
        what: "Learn DFS — recursive traversal, cycle detection",
        resource: { label: "Striver – DFS of Graph (Video)", url: "https://www.youtube.com/watch?v=Qzf1a--rhp8", type: "video" },
        problems: [
          { label: "Clone Graph", url: "https://leetcode.com/problems/clone-graph", difficulty: "Medium" },
          { label: "Course Schedule", url: "https://leetcode.com/problems/course-schedule", difficulty: "Medium" },
        ],
      },
    ],
  },

  "Dynamic Programming Intro - Memoization basics": {
    steps: [
      {
        what: "Understand what DP is — overlapping subproblems, optimal substructure",
        resource: { label: "Striver – DP Introduction (Video)", url: "https://www.youtube.com/watch?v=tyB0ztf0DNY", type: "video" },
        problems: [
          { label: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs", difficulty: "Easy" },
          { label: "Fibonacci Number", url: "https://leetcode.com/problems/fibonacci-number", difficulty: "Easy" },
        ],
      },
      {
        what: "Top-down DP with memoization (recursion + cache)",
        resource: { label: "Striver – Memoization vs Tabulation (Video)", url: "https://www.youtube.com/watch?v=mmjDZGSr7EA", type: "video" },
        problems: [
          { label: "House Robber", url: "https://leetcode.com/problems/house-robber", difficulty: "Medium" },
          { label: "Min Cost Climbing Stairs", url: "https://leetcode.com/problems/min-cost-climbing-stairs", difficulty: "Easy" },
        ],
      },
      {
        what: "Bottom-up DP with tabulation",
        resource: { label: "NeetCode – 1D DP (Video)", url: "https://www.youtube.com/watch?v=73r3KWiEvyk", type: "video" },
        problems: [
          { label: "Coin Change", url: "https://leetcode.com/problems/coin-change", difficulty: "Medium" },
          { label: "Longest Increasing Subsequence", url: "https://leetcode.com/problems/longest-increasing-subsequence", difficulty: "Medium" },
        ],
      },
    ],
  },

  "Greedy Algorithms - Activity selection, fractional knapsack": {
    steps: [
      {
        what: "Understand greedy strategy — make locally optimal choice at each step",
        resource: { label: "Striver – Greedy Algorithms Intro (Video)", url: "https://www.youtube.com/watch?v=37E9ckMDdTk", type: "video" },
        problems: [
          { label: "Assign Cookies", url: "https://leetcode.com/problems/assign-cookies", difficulty: "Easy" },
          { label: "Jump Game", url: "https://leetcode.com/problems/jump-game", difficulty: "Medium" },
        ],
      },
      {
        what: "Activity selection and interval scheduling problems",
        resource: { label: "Striver – N Meetings in One Room (Video)", url: "https://www.youtube.com/watch?v=II6ziNnub1Q", type: "video" },
        problems: [
          { label: "Non-overlapping Intervals", url: "https://leetcode.com/problems/non-overlapping-intervals", difficulty: "Medium" },
          { label: "Partition Labels", url: "https://leetcode.com/problems/partition-labels", difficulty: "Medium" },
        ],
      },
    ],
  },

  "Backtracking - N-Queens, permutations, combinations": {
    steps: [
      {
        what: "Understand backtracking — explore, choose, unchoose pattern",
        resource: { label: "Striver – Recursion & Backtracking (Video)", url: "https://www.youtube.com/watch?v=yVdKa8dnKiE", type: "video" },
        problems: [
          { label: "Subsets", url: "https://leetcode.com/problems/subsets", difficulty: "Medium" },
          { label: "Permutations", url: "https://leetcode.com/problems/permutations", difficulty: "Medium" },
        ],
      },
      {
        what: "Combination sum and constraint-based backtracking",
        resource: { label: "Striver – Combination Sum (Video)", url: "https://www.youtube.com/watch?v=OyZFFqQtu98", type: "video" },
        problems: [
          { label: "Combination Sum", url: "https://leetcode.com/problems/combination-sum", difficulty: "Medium" },
          { label: "N-Queens", url: "https://leetcode.com/problems/n-queens", difficulty: "Hard" },
        ],
      },
    ],
  },

  "Heaps & Priority Queues - Min/Max heap implementation": {
    steps: [
      {
        what: "Understand heap structure — complete binary tree, heapify",
        resource: { label: "Striver – Heap Introduction (Video)", url: "https://www.youtube.com/watch?v=HqPJF2L5h9U", type: "video" },
        problems: [
          { label: "Kth Largest Element in Array", url: "https://leetcode.com/problems/kth-largest-element-in-an-array", difficulty: "Medium" },
          { label: "Last Stone Weight", url: "https://leetcode.com/problems/last-stone-weight", difficulty: "Easy" },
        ],
      },
      {
        what: "Use priority queues for top-K and scheduling problems",
        resource: { label: "NeetCode – Heap / Priority Queue (Video)", url: "https://www.youtube.com/watch?v=jfW4d2IEH8M", type: "video" },
        problems: [
          { label: "Top K Frequent Elements", url: "https://leetcode.com/problems/top-k-frequent-elements", difficulty: "Medium" },
          { label: "Find Median from Data Stream", url: "https://leetcode.com/problems/find-median-from-data-stream", difficulty: "Hard" },
          { label: "Task Scheduler", url: "https://leetcode.com/problems/task-scheduler", difficulty: "Medium" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // Python
  // ══════════════════════════════════════════════════════════════
  "Syntax & Variables - Data types, variable assignment": {
    steps: [
      {
        what: "Install Python, run your first script, understand print and variables",
        resource: { label: "freeCodeCamp – Python Full Course (Video)", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", type: "video" },
        problems: [
          { label: "Say Hello World – HackerRank", url: "https://www.hackerrank.com/challenges/py-hello-world", difficulty: "Easy" },
          { label: "Python Arithmetic Operators", url: "https://www.hackerrank.com/challenges/python-arithmetic-operators", difficulty: "Easy" },
        ],
      },
      {
        what: "Understand int, float, str, bool — type() and type casting",
        resource: { label: "Real Python – Python Data Types (Article)", url: "https://realpython.com/python-data-types", type: "article" },
        problems: [
          { label: "Python Division – HackerRank", url: "https://www.hackerrank.com/challenges/python-division", difficulty: "Easy" },
        ],
      },
    ],
  },

  "Control Flow - if/else statements, loops (for, while)": {
    steps: [
      {
        what: "Write if/elif/else conditions with comparison and logical operators",
        resource: { label: "Real Python – Conditional Statements (Article)", url: "https://realpython.com/python-conditional-statements", type: "article" },
        problems: [
          { label: "Conditional Statements – HackerRank", url: "https://www.hackerrank.com/challenges/py-if-else", difficulty: "Easy" },
        ],
      },
      {
        what: "Use for loops with range(), iterate over lists and strings",
        resource: { label: "Corey Schafer – Loops in Python (Video)", url: "https://www.youtube.com/watch?v=6iF8Xb7Z3wQ", type: "video" },
        problems: [
          { label: "Loops – HackerRank", url: "https://www.hackerrank.com/challenges/python-loops", difficulty: "Easy" },
          { label: "FizzBuzz – LeetCode", url: "https://leetcode.com/problems/fizz-buzz", difficulty: "Easy" },
        ],
      },
    ],
  },

  "OOP Basics - Classes, objects, inheritance, polymorphism": {
    steps: [
      {
        what: "Define a class, create objects, understand __init__ and self",
        resource: { label: "Corey Schafer – OOP Part 1 (Video)", url: "https://www.youtube.com/watch?v=ZDa-Z5JzLYM", type: "video" },
        problems: [
          { label: "Classes: Dealing with Complex Numbers – HackerRank", url: "https://www.hackerrank.com/challenges/class-1-dealing-with-complex-numbers", difficulty: "Easy" },
        ],
      },
      {
        what: "Implement inheritance — parent/child classes, method overriding",
        resource: { label: "Corey Schafer – OOP Inheritance (Video)", url: "https://www.youtube.com/watch?v=RSl87lqOXDE", type: "video" },
        problems: [
          { label: "Design Parking System – LeetCode", url: "https://leetcode.com/problems/design-parking-system", difficulty: "Easy" },
        ],
      },
    ],
  },

  "Decorators & Closures - Function decorators, nested functions": {
    steps: [
      {
        what: "Understand closures — functions that remember their enclosing scope",
        resource: { label: "Corey Schafer – Closures (Video)", url: "https://www.youtube.com/watch?v=swU3c34d2NQ", type: "video" },
        problems: [
          { label: "Closure exercises – HackerRank", url: "https://www.hackerrank.com/challenges/decorators-2-name-directory", difficulty: "Medium" },
        ],
      },
      {
        what: "Write and apply function decorators with @syntax",
        resource: { label: "Corey Schafer – Decorators (Video)", url: "https://www.youtube.com/watch?v=FsAPt_9Bf3U", type: "video" },
        problems: [
          { label: "Decorators – HackerRank", url: "https://www.hackerrank.com/challenges/decorators-2-name-directory", difficulty: "Medium" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // Web Dev
  // ══════════════════════════════════════════════════════════════
  "HTML Basics - Semantic HTML, forms, accessibility": {
    steps: [
      {
        what: "Learn HTML document structure — head, body, semantic tags (header, main, footer)",
        resource: { label: "MDN – HTML Basics (Article)", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started", type: "article" },
        problems: [
          { label: "Build a basic webpage with semantic tags", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design", difficulty: "Easy" },
        ],
      },
      {
        what: "Build forms — input types, labels, validation attributes",
        resource: { label: "web.dev – Learn Forms (Article)", url: "https://web.dev/learn/forms", type: "article" },
        problems: [
          { label: "Build a Survey Form – fCC", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/build-a-survey-form-project/build-a-survey-form", difficulty: "Easy" },
        ],
      },
    ],
  },

  "CSS Styling - Flexbox, Grid, responsive design": {
    steps: [
      {
        what: "Master Flexbox — flex-direction, justify-content, align-items",
        resource: { label: "Flexbox Froggy – Interactive Game", url: "https://flexboxfroggy.com", type: "interactive" },
        problems: [
          { label: "CSS Flexbox – fCC", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/#learn-css-flexbox-by-building-a-photo-gallery", difficulty: "Easy" },
        ],
      },
      {
        what: "Master CSS Grid — grid-template, areas, auto-fit",
        resource: { label: "Grid Garden – Interactive Game", url: "https://cssgridgarden.com", type: "interactive" },
        problems: [
          { label: "Build a Product Landing Page – fCC", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/build-a-product-landing-page-project/build-a-product-landing-page", difficulty: "Medium" },
        ],
      },
      {
        what: "Make layouts responsive with media queries",
        resource: { label: "Kevin Powell – Responsive CSS (Video)", url: "https://www.youtube.com/watch?v=bn-DQznEZm0", type: "video" },
        problems: [
          { label: "Build a Technical Documentation Page – fCC", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/build-a-technical-documentation-page-project/build-a-technical-documentation-page", difficulty: "Medium" },
        ],
      },
    ],
  },

  "React Hooks - useState, useEffect, custom hooks": {
    steps: [
      {
        what: "useState — declare state, update it, understand re-renders",
        resource: { label: "React Docs – useState (Article)", url: "https://react.dev/reference/react/useState", type: "article" },
        problems: [
          { label: "Build a counter with increment/decrement", url: "https://react.dev/learn/state-a-components-memory", difficulty: "Easy" },
        ],
      },
      {
        what: "useEffect — run side effects, fetch data, cleanup",
        resource: { label: "Corey Schafer – useEffect Explained (Video)", url: "https://www.youtube.com/watch?v=0ZJgIjIuY7U", type: "video" },
        problems: [
          { label: "Build a data-fetching component with loading state", url: "https://react.dev/reference/react/useEffect", difficulty: "Medium" },
        ],
      },
      {
        what: "Build a custom hook — extract reusable stateful logic",
        resource: { label: "React Docs – Custom Hooks (Article)", url: "https://react.dev/learn/reusing-logic-with-custom-hooks", type: "article" },
        problems: [
          { label: "Build a useFetch hook", url: "https://usehooks.com/useFetch", difficulty: "Medium" },
        ],
      },
    ],
  },

  "REST APIs - Fetch API, axios, error handling": {
    steps: [
      {
        what: "Use fetch() to GET data from a public API, handle the response",
        resource: { label: "Traversy Media – Fetch API Crash Course (Video)", url: "https://www.youtube.com/watch?v=Oive66jrwBs", type: "video" },
        problems: [
          { label: "Fetch data from JSONPlaceholder API", url: "https://jsonplaceholder.typicode.com", difficulty: "Easy" },
        ],
      },
      {
        what: "Use axios for cleaner requests — interceptors, base URL, error handling",
        resource: { label: "Axios Docs – Getting Started (Article)", url: "https://axios-http.com/docs/intro", type: "article" },
        problems: [
          { label: "Build a weather app using OpenWeather API", url: "https://openweathermap.org/api", difficulty: "Medium" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // Machine Learning
  // ══════════════════════════════════════════════════════════════
  "Python for ML - NumPy arrays, Pandas dataframes": {
    steps: [
      {
        what: "NumPy — create arrays, reshape, slice, vectorized operations",
        resource: { label: "NumPy Quickstart Tutorial (Article)", url: "https://numpy.org/doc/stable/user/quickstart.html", type: "article" },
        problems: [
          { label: "NumPy exercises on Kaggle", url: "https://www.kaggle.com/learn/pandas", difficulty: "Easy" },
        ],
      },
      {
        what: "Pandas — DataFrames, read CSV, filter, groupby, merge",
        resource: { label: "Kaggle – Pandas Course (Interactive)", url: "https://www.kaggle.com/learn/pandas", type: "interactive" },
        problems: [
          { label: "Titanic Dataset exploration", url: "https://www.kaggle.com/c/titanic", difficulty: "Easy" },
        ],
      },
    ],
  },

  "Linear Regression - Cost function, gradient descent": {
    steps: [
      {
        what: "Understand the linear regression model — hypothesis, parameters",
        resource: { label: "Andrew Ng – Linear Regression (Video)", url: "https://www.youtube.com/watch?v=4b4MUYve_U8", type: "video" },
        problems: [
          { label: "Boston Housing Price Prediction – Kaggle", url: "https://www.kaggle.com/c/boston-housing", difficulty: "Easy" },
        ],
      },
      {
        what: "Implement cost function (MSE) and gradient descent from scratch",
        resource: { label: "StatQuest – Gradient Descent (Video)", url: "https://www.youtube.com/watch?v=sDv4f4s2SB8", type: "video" },
        problems: [
          { label: "Implement linear regression with NumPy", url: "https://www.kaggle.com/learn/intro-to-machine-learning", difficulty: "Medium" },
        ],
      },
      {
        what: "Use scikit-learn LinearRegression — fit, predict, evaluate with R²",
        resource: { label: "Scikit-learn – Linear Regression (Article)", url: "https://scikit-learn.org/stable/modules/linear_model.html", type: "article" },
        problems: [
          { label: "House Prices – Advanced Regression – Kaggle", url: "https://www.kaggle.com/c/house-prices-advanced-regression-techniques", difficulty: "Medium" },
        ],
      },
    ],
  },

  "Neural Networks Basics - Perceptron, backpropagation": {
    steps: [
      {
        what: "Understand a neuron — weights, bias, activation function",
        resource: { label: "3Blue1Brown – But what is a Neural Network? (Video)", url: "https://www.youtube.com/watch?v=aircAruvnKk", type: "video" },
        problems: [],
      },
      {
        what: "Understand backpropagation — chain rule, gradient flow",
        resource: { label: "3Blue1Brown – Backpropagation (Video)", url: "https://www.youtube.com/watch?v=Ilg3gGewQ5U", type: "video" },
        problems: [],
      },
      {
        what: "Build a simple neural network with Keras on MNIST",
        resource: { label: "TensorFlow – Beginner Tutorial (Article)", url: "https://www.tensorflow.org/tutorials/quickstart/beginner", type: "article" },
        problems: [
          { label: "Digit Recognizer – Kaggle", url: "https://www.kaggle.com/c/digit-recognizer", difficulty: "Easy" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // JavaScript
  // ══════════════════════════════════════════════════════════════
  "Variables & Scope - var, let, const, block scope": {
    steps: [
      {
        what: "Understand var vs let vs const — hoisting, block scope, temporal dead zone",
        resource: { label: "javascript.info – Variables (Article)", url: "https://javascript.info/variables", type: "article" },
        problems: [
          { label: "JS Basics – freeCodeCamp", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/#basic-javascript", difficulty: "Easy" },
        ],
      },
      {
        what: "Understand scope chain — global, function, block scope",
        resource: { label: "Akshay Saini – Scope & Scope Chain (Video)", url: "https://www.youtube.com/watch?v=uH-tVP8MUs8", type: "video" },
        problems: [
          { label: "Scope quiz on jsisweird.com", url: "https://jsisweird.com", difficulty: "Easy" },
        ],
      },
    ],
  },

  "Async/Await - Async functions, error handling with try-catch": {
    steps: [
      {
        what: "Understand the Promise — resolve, reject, .then(), .catch()",
        resource: { label: "Akshay Saini – Promises (Video)", url: "https://www.youtube.com/watch?v=ap-6PPAuK1Y", type: "video" },
        problems: [
          { label: "Build a fetch-based app", url: "https://javascript.info/fetch", difficulty: "Easy" },
        ],
      },
      {
        what: "Use async/await — cleaner syntax, try/catch for errors",
        resource: { label: "javascript.info – Async/Await (Article)", url: "https://javascript.info/async-await", type: "article" },
        problems: [
          { label: "Async exercises – exercism.io", url: "https://exercism.org/tracks/javascript", difficulty: "Medium" },
        ],
      },
      {
        what: "Promise.all, Promise.race — parallel async operations",
        resource: { label: "javascript.info – Promise API (Article)", url: "https://javascript.info/promise-api", type: "article" },
        problems: [
          { label: "Build parallel fetch with Promise.all", url: "https://javascript.info/promise-api", difficulty: "Medium" },
        ],
      },
    ],
  },

  "Event Loop & Microtasks - Execution context, call stack": {
    steps: [
      {
        what: "Understand the call stack — how JS executes code synchronously",
        resource: { label: "Philip Roberts – What the heck is the event loop? (Video)", url: "https://www.youtube.com/watch?v=8aGhZQkoFbQ", type: "video" },
        problems: [
          { label: "Visualize call stack on jsv9000.app", url: "https://www.jsv9000.app", difficulty: "Easy" },
        ],
      },
      {
        what: "Understand microtasks vs macrotasks — setTimeout vs Promise order",
        resource: { label: "Jake Archibald – Tasks, microtasks, queues (Video)", url: "https://www.youtube.com/watch?v=cCOL7MC4Pl0", type: "video" },
        problems: [
          { label: "Event loop order quiz", url: "https://www.jsv9000.app", difficulty: "Medium" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // React
  // ══════════════════════════════════════════════════════════════
  "JSX & Components - Function components, JSX syntax": {
    steps: [
      {
        what: "Understand JSX — it compiles to React.createElement, rules (className, camelCase)",
        resource: { label: "React Docs – Writing Markup with JSX (Article)", url: "https://react.dev/learn/writing-markup-with-jsx", type: "article" },
        problems: [
          { label: "Build a profile card component", url: "https://react.dev/learn/your-first-component", difficulty: "Easy" },
        ],
      },
      {
        what: "Create function components — props, returning JSX, composing components",
        resource: { label: "Traversy Media – React Crash Course (Video)", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", type: "video" },
        problems: [
          { label: "Build a reusable Button component", url: "https://react.dev/learn/your-first-component", difficulty: "Easy" },
        ],
      },
    ],
  },

  "Context API - Creating context, useContext hook": {
    steps: [
      {
        what: "Understand prop drilling problem — why Context is needed",
        resource: { label: "React Docs – Passing Data Deeply (Article)", url: "https://react.dev/learn/passing-data-deeply-with-context", type: "article" },
        problems: [],
      },
      {
        what: "Create a Context, Provider, and consume with useContext",
        resource: { label: "Corey Schafer – Context API (Video)", url: "https://www.youtube.com/watch?v=5LrDIWkK_Bc", type: "video" },
        problems: [
          { label: "Build a theme switcher with Context", url: "https://react.dev/learn/passing-data-deeply-with-context", difficulty: "Medium" },
        ],
      },
    ],
  },

  "State Management - Redux, Zustand, Jotai integration": {
    steps: [
      {
        what: "Understand when you need global state — Redux core concepts (store, action, reducer)",
        resource: { label: "Redux Toolkit – Quick Start (Article)", url: "https://redux-toolkit.js.org/tutorials/quick-start", type: "article" },
        problems: [
          { label: "Build a counter with Redux Toolkit", url: "https://redux-toolkit.js.org/tutorials/quick-start", difficulty: "Medium" },
        ],
      },
      {
        what: "Use Zustand — simpler alternative, create store, subscribe",
        resource: { label: "Jack Herrington – Zustand (Video)", url: "https://www.youtube.com/watch?v=_ngCLZ5Iz-0", type: "video" },
        problems: [
          { label: "Build a cart with Zustand", url: "https://zustand-demo.pmnd.rs", difficulty: "Medium" },
        ],
      },
    ],
  },
};
