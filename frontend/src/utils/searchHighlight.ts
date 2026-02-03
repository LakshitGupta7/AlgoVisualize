// Utility to get highlight line for Searching algorithms based on description
// Note: Returns 0-based line index to match CodeViewer's array indexing
export const getSearchHighlightLine = (algorithm: string, description: string): number | undefined => {
    const desc = description.toLowerCase();

    if (algorithm === 'linear') {
        // Linear search code lines (0-indexed):
        // 0: int linearSearch(int arr[], int n, int x) {
        // 1:     for (int i = 0; i < n; i++) {
        // 2:         // Check each element
        // 3:         if (arr[i] == x) {
        // 4:             // Found at index i
        // 5:             return i;
        // 6:         }
        // 7:     }
        // 8:     // Not found
        // 9:     return -1;
        // 10: }
        if (desc.includes('searching for')) return 1;  // for loop start
        if (desc.includes('checking index')) return 3; // if (arr[i] == x)
        if (desc.includes('found') && !desc.includes('not found')) return 5;  // return i
        if (desc.includes('not found')) return 9;      // return -1
    } else if (algorithm === 'binary') {
        // Binary search code lines (0-indexed):
        // 0: int binarySearch(int arr[], int l, int r, int x) {
        // 1:     while (l <= r) {
        // 2:         int m = l + (r - l) / 2;
        // 3:         // Check if x is at mid
        // 4:         if (arr[m] == x) {
        // 5:             return m;
        // 6:         }
        // 7:         // If x greater, ignore left half
        // 8:         if (arr[m] < x) {
        // 9:             l = m + 1;
        // 10:         }
        // 11:         // If x smaller, ignore right half
        // 12:         else {
        // 13:             r = m - 1;
        // 14:         }
        // 15:     }
        // 16:     return -1;
        // 17: }
        if (desc.includes('left=') && desc.includes('right=') && desc.includes('searching')) return 1;  // while loop
        if (desc.includes('checking middle')) return 2; // int m = ...
        if (desc.includes('found') && !desc.includes('not found')) return 5;  // return m
        if (desc.includes('searching right half')) return 9;  // l = m + 1
        if (desc.includes('searching left half')) return 13;  // r = m - 1
        if (desc.includes('not found')) return 16;     // return -1
    } else if (algorithm === 'jump') {
        // Jump search - highlight key operations
        if (desc.includes('jump search with step')) return 1;  // step = sqrt(n)
        if (desc.includes('jumping')) return 4;         // while loop for jumping
        if (desc.includes('linear search in block')) return 9; // linear search in block
        if (desc.includes('checking index')) return 10; // checking elements
        if (desc.includes('found') && !desc.includes('not found')) return 14; // return prev
        if (desc.includes('not found')) return 16;      // return -1
    } else if (algorithm === 'interpolation') {
        // Interpolation search - highlight key operations
        if (desc.includes('interpolation search')) return 1;   // while loop start
        if (desc.includes('interpolated position')) return 4;  // pos calculation
        if (desc.includes('found') && !desc.includes('not found')) return 5; // found
        if (desc.includes('not found')) return 9;       // return -1
    } else if (algorithm === 'exponential') {
        // Exponential search - highlight key operations
        if (desc.includes('finding range')) return 3;   // while i < n
        if (desc.includes('exponential jump')) return 4; // i = i * 2
        if (desc.includes('binary search in range')) return 7; // binarySearch call
        if (desc.includes('checking middle')) return 7; // same line
        if (desc.includes('found') && !desc.includes('not found')) return 7;
    }

    return undefined;
};
