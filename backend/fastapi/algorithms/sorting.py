from fastapi import APIRouter
from models.schemas import SortingRequest, SortingResponse, SortingStep

router = APIRouter()


def bubble_sort_steps(arr: list[int]) -> tuple[list[SortingStep], int, int]:
    """Bubble Sort with step-by-step visualization data"""
    steps = []
    comparisons = 0
    swaps = 0
    arr = arr.copy()
    n = len(arr)
    sorted_indices = []
    
    steps.append(SortingStep(
        array=arr.copy(),
        description="Initial array"
    ))
    
    for i in range(n):
        for j in range(0, n - i - 1):
            comparisons += 1
            steps.append(SortingStep(
                array=arr.copy(),
                comparing=[j, j + 1],
                sorted=sorted_indices.copy(),
                description=f"Comparing {arr[j]} and {arr[j + 1]}"
            ))
            
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swaps += 1
                steps.append(SortingStep(
                    array=arr.copy(),
                    swapping=[j, j + 1],
                    sorted=sorted_indices.copy(),
                    description=f"Swapping {arr[j + 1]} and {arr[j]}"
                ))
        
        sorted_indices.append(n - i - 1)
    
    steps.append(SortingStep(
        array=arr.copy(),
        sorted=list(range(n)),
        description="Array sorted!"
    ))
    
    return steps, comparisons, swaps


def selection_sort_steps(arr: list[int]) -> tuple[list[SortingStep], int, int]:
    """Selection Sort with step-by-step visualization data"""
    steps = []
    comparisons = 0
    swaps = 0
    arr = arr.copy()
    n = len(arr)
    sorted_indices = []
    
    steps.append(SortingStep(
        array=arr.copy(),
        description="Initial array"
    ))
    
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            comparisons += 1
            steps.append(SortingStep(
                array=arr.copy(),
                comparing=[min_idx, j],
                sorted=sorted_indices.copy(),
                description=f"Finding minimum: comparing {arr[min_idx]} with {arr[j]}"
            ))
            
            if arr[j] < arr[min_idx]:
                min_idx = j
        
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            swaps += 1
            steps.append(SortingStep(
                array=arr.copy(),
                swapping=[i, min_idx],
                sorted=sorted_indices.copy(),
                description=f"Swapping minimum {arr[min_idx]} to position {i}"
            ))
        
        sorted_indices.append(i)
    
    steps.append(SortingStep(
        array=arr.copy(),
        sorted=list(range(n)),
        description="Array sorted!"
    ))
    
    return steps, comparisons, swaps


def insertion_sort_steps(arr: list[int]) -> tuple[list[SortingStep], int, int]:
    """Insertion Sort with step-by-step visualization data"""
    steps = []
    comparisons = 0
    swaps = 0
    arr = arr.copy()
    n = len(arr)
    
    steps.append(SortingStep(
        array=arr.copy(),
        sorted=[0],
        description="Initial array - first element is trivially sorted"
    ))
    
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        
        steps.append(SortingStep(
            array=arr.copy(),
            comparing=[i],
            sorted=list(range(i)),
            description=f"Inserting {key} into sorted portion"
        ))
        
        while j >= 0:
            comparisons += 1
            steps.append(SortingStep(
                array=arr.copy(),
                comparing=[j, j + 1],
                sorted=list(range(i)),
                description=f"Comparing {arr[j]} with {key}"
            ))
            
            if arr[j] > key:
                arr[j + 1] = arr[j]
                swaps += 1
                steps.append(SortingStep(
                    array=arr.copy(),
                    swapping=[j, j + 1],
                    sorted=list(range(i)),
                    description=f"Shifting {arr[j + 1]} to the right"
                ))
                j -= 1
            else:
                break
        
        arr[j + 1] = key
    
    steps.append(SortingStep(
        array=arr.copy(),
        sorted=list(range(n)),
        description="Array sorted!"
    ))
    
    return steps, comparisons, swaps


def merge_sort_steps(arr: list[int]) -> tuple[list[SortingStep], int, int]:
    """Merge Sort with step-by-step visualization data"""
    steps = []
    comparisons = [0]
    swaps = [0]
    arr = arr.copy()
    
    steps.append(SortingStep(
        array=arr.copy(),
        description="Initial array"
    ))
    
    def merge_sort_recursive(arr, left, right, steps, comparisons, swaps):
        if left < right:
            mid = (left + right) // 2
            
            steps.append(SortingStep(
                array=arr.copy(),
                comparing=list(range(left, mid + 1)),
                description=f"Dividing: left half [{left}:{mid + 1}]"
            ))
            
            merge_sort_recursive(arr, left, mid, steps, comparisons, swaps)
            
            steps.append(SortingStep(
                array=arr.copy(),
                comparing=list(range(mid + 1, right + 1)),
                description=f"Dividing: right half [{mid + 1}:{right + 1}]"
            ))
            
            merge_sort_recursive(arr, mid + 1, right, steps, comparisons, swaps)
            
            # Merge
            merge(arr, left, mid, right, steps, comparisons, swaps)
    
    def merge(arr, left, mid, right, steps, comparisons, swaps):
        left_arr = arr[left:mid + 1]
        right_arr = arr[mid + 1:right + 1]
        
        i = j = 0
        k = left
        
        while i < len(left_arr) and j < len(right_arr):
            comparisons[0] += 1
            steps.append(SortingStep(
                array=arr.copy(),
                comparing=[left + i, mid + 1 + j],
                description=f"Merging: comparing {left_arr[i]} with {right_arr[j]}"
            ))
            
            if left_arr[i] <= right_arr[j]:
                arr[k] = left_arr[i]
                i += 1
            else:
                arr[k] = right_arr[j]
                j += 1
                swaps[0] += 1
            k += 1
        
        while i < len(left_arr):
            arr[k] = left_arr[i]
            i += 1
            k += 1
        
        while j < len(right_arr):
            arr[k] = right_arr[j]
            j += 1
            k += 1
        
        steps.append(SortingStep(
            array=arr.copy(),
            sorted=list(range(left, right + 1)),
            description=f"Merged [{left}:{right + 1}]"
        ))
    
    merge_sort_recursive(arr, 0, len(arr) - 1, steps, comparisons, swaps)
    
    steps.append(SortingStep(
        array=arr.copy(),
        sorted=list(range(len(arr))),
        description="Array sorted!"
    ))
    
    return steps, comparisons[0], swaps[0]


def quick_sort_steps(arr: list[int]) -> tuple[list[SortingStep], int, int]:
    """Quick Sort with step-by-step visualization data"""
    steps = []
    comparisons = [0]
    swaps = [0]
    arr = arr.copy()
    n = len(arr)
    
    steps.append(SortingStep(
        array=arr.copy(),
        description="Initial array"
    ))
    
    def partition(arr, low, high, steps, comparisons, swaps):
        pivot = arr[high]
        steps.append(SortingStep(
            array=arr.copy(),
            pivot=high,
            description=f"Pivot selected: {pivot}"
        ))
        
        i = low - 1
        
        for j in range(low, high):
            comparisons[0] += 1
            steps.append(SortingStep(
                array=arr.copy(),
                comparing=[j, high],
                pivot=high,
                description=f"Comparing {arr[j]} with pivot {pivot}"
            ))
            
            if arr[j] <= pivot:
                i += 1
                if i != j:
                    arr[i], arr[j] = arr[j], arr[i]
                    swaps[0] += 1
                    steps.append(SortingStep(
                        array=arr.copy(),
                        swapping=[i, j],
                        pivot=high,
                        description=f"Swapping {arr[j]} and {arr[i]}"
                    ))
        
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        swaps[0] += 1
        steps.append(SortingStep(
            array=arr.copy(),
            swapping=[i + 1, high],
            description=f"Placing pivot at position {i + 1}"
        ))
        
        return i + 1
    
    def quick_sort_recursive(arr, low, high, steps, comparisons, swaps):
        if low < high:
            pi = partition(arr, low, high, steps, comparisons, swaps)
            steps.append(SortingStep(
                array=arr.copy(),
                sorted=[pi],
                description=f"Pivot {arr[pi]} is in final position"
            ))
            quick_sort_recursive(arr, low, pi - 1, steps, comparisons, swaps)
            quick_sort_recursive(arr, pi + 1, high, steps, comparisons, swaps)
    
    quick_sort_recursive(arr, 0, n - 1, steps, comparisons, swaps)
    
    steps.append(SortingStep(
        array=arr.copy(),
        sorted=list(range(n)),
        description="Array sorted!"
    ))
    
    return steps, comparisons[0], swaps[0]


def heap_sort_steps(arr: list[int]) -> tuple[list[SortingStep], int, int]:
    """Heap Sort with step-by-step visualization data"""
    steps = []
    comparisons = [0]
    swaps = [0]
    arr = arr.copy()
    n = len(arr)
    sorted_indices = []
    
    steps.append(SortingStep(
        array=arr.copy(),
        description="Initial array"
    ))
    
    def heapify(arr, n, i, steps, comparisons, swaps, sorted_indices):
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        
        if left < n:
            comparisons[0] += 1
            steps.append(SortingStep(
                array=arr.copy(),
                comparing=[largest, left],
                sorted=sorted_indices.copy(),
                description=f"Comparing {arr[largest]} with left child {arr[left]}"
            ))
            if arr[left] > arr[largest]:
                largest = left
        
        if right < n:
            comparisons[0] += 1
            steps.append(SortingStep(
                array=arr.copy(),
                comparing=[largest, right],
                sorted=sorted_indices.copy(),
                description=f"Comparing {arr[largest]} with right child {arr[right]}"
            ))
            if arr[right] > arr[largest]:
                largest = right
        
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            swaps[0] += 1
            steps.append(SortingStep(
                array=arr.copy(),
                swapping=[i, largest],
                sorted=sorted_indices.copy(),
                description=f"Swapping {arr[largest]} and {arr[i]}"
            ))
            heapify(arr, n, largest, steps, comparisons, swaps, sorted_indices)
    
    # Build max heap
    steps.append(SortingStep(
        array=arr.copy(),
        description="Building max heap..."
    ))
    
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i, steps, comparisons, swaps, sorted_indices)
    
    steps.append(SortingStep(
        array=arr.copy(),
        description="Max heap built"
    ))
    
    # Extract elements
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        swaps[0] += 1
        sorted_indices.append(i)
        steps.append(SortingStep(
            array=arr.copy(),
            swapping=[0, i],
            sorted=sorted_indices.copy(),
            description=f"Moving max element {arr[i]} to end"
        ))
        heapify(arr, i, 0, steps, comparisons, swaps, sorted_indices)
    
    sorted_indices.append(0)
    steps.append(SortingStep(
        array=arr.copy(),
        sorted=list(range(n)),
        description="Array sorted!"
    ))
    
    return steps, comparisons[0], swaps[0]


def counting_sort_steps(arr: list[int]) -> tuple[list[SortingStep], int, int]:
    """Counting Sort with step-by-step visualization data"""
    steps = []
    arr = arr.copy()
    
    if not arr:
        return [SortingStep(array=[], description="Empty array")], 0, 0
    
    steps.append(SortingStep(
        array=arr.copy(),
        description="Initial array"
    ))
    
    max_val = max(arr)
    min_val = min(arr)
    range_val = max_val - min_val + 1
    
    steps.append(SortingStep(
        array=arr.copy(),
        description=f"Range: {min_val} to {max_val}"
    ))
    
    count = [0] * range_val
    output = [0] * len(arr)
    
    # Count occurrences
    for num in arr:
        count[num - min_val] += 1
    
    steps.append(SortingStep(
        array=arr.copy(),
        description=f"Counted occurrences"
    ))
    
    # Cumulative count
    for i in range(1, len(count)):
        count[i] += count[i - 1]
    
    # Build output
    for i in range(len(arr) - 1, -1, -1):
        output[count[arr[i] - min_val] - 1] = arr[i]
        count[arr[i] - min_val] -= 1
        steps.append(SortingStep(
            array=output.copy(),
            comparing=[count[arr[i] - min_val]],
            description=f"Placing {arr[i]} at position {count[arr[i] - min_val]}"
        ))
    
    steps.append(SortingStep(
        array=output.copy(),
        sorted=list(range(len(output))),
        description="Array sorted!"
    ))
    
    return steps, len(arr), 0


def radix_sort_steps(arr: list[int]) -> tuple[list[SortingStep], int, int]:
    """Radix Sort with step-by-step visualization data"""
    steps = []
    arr = arr.copy()
    
    if not arr:
        return [SortingStep(array=[], description="Empty array")], 0, 0
    
    steps.append(SortingStep(
        array=arr.copy(),
        description="Initial array"
    ))
    
    max_val = max(arr)
    exp = 1
    
    while max_val // exp > 0:
        steps.append(SortingStep(
            array=arr.copy(),
            description=f"Sorting by digit at position {exp}"
        ))
        
        # Counting sort for this digit
        count = [0] * 10
        output = [0] * len(arr)
        
        for num in arr:
            index = (num // exp) % 10
            count[index] += 1
        
        for i in range(1, 10):
            count[i] += count[i - 1]
        
        for i in range(len(arr) - 1, -1, -1):
            index = (arr[i] // exp) % 10
            output[count[index] - 1] = arr[i]
            count[index] -= 1
        
        arr = output.copy()
        steps.append(SortingStep(
            array=arr.copy(),
            description=f"After sorting by digit at position {exp}"
        ))
        
        exp *= 10
    
    steps.append(SortingStep(
        array=arr.copy(),
        sorted=list(range(len(arr))),
        description="Array sorted!"
    ))
    
    return steps, 0, 0


def bucket_sort_steps(arr: list[int]) -> tuple[list[SortingStep], int, int]:
    """Bucket Sort with step-by-step visualization data"""
    steps = []
    arr = arr.copy()
    n = len(arr)
    
    if not arr:
        return [SortingStep(array=[], description="Empty array")], 0, 0
    
    steps.append(SortingStep(
        array=arr.copy(),
        description="Initial array"
    ))
    
    # Find range
    min_val = min(arr)
    max_val = max(arr)
    range_val = max_val - min_val + 1
    
    # Create buckets (use 5 or 10 buckets depending on range)
    num_buckets = min(10, max(5, n // 2))
    bucket_size = range_val / num_buckets
    
    steps.append(SortingStep(
        array=arr.copy(),
        description=f"Creating {num_buckets} buckets for range {min_val}-{max_val}"
    ))
    
    # Initialize empty buckets
    buckets = [[] for _ in range(num_buckets)]
    
    # Distribute elements into buckets
    for i, num in enumerate(arr):
        bucket_index = min(int((num - min_val) / bucket_size), num_buckets - 1)
        buckets[bucket_index].append(num)
        
        steps.append(SortingStep(
            array=arr.copy(),
            comparing=[i],
            buckets=[b.copy() for b in buckets],
            description=f"Placing {num} into bucket {bucket_index + 1}"
        ))
    
    steps.append(SortingStep(
        array=arr.copy(),
        buckets=[b.copy() for b in buckets],
        description="All elements distributed into buckets"
    ))
    
    # Sort each bucket using insertion sort
    comparisons = 0
    swaps = 0
    
    for i, bucket in enumerate(buckets):
        if len(bucket) > 1:
            # Insertion sort for this bucket
            for j in range(1, len(bucket)):
                key = bucket[j]
                k = j - 1
                while k >= 0 and bucket[k] > key:
                    comparisons += 1
                    bucket[k + 1] = bucket[k]
                    swaps += 1
                    k -= 1
                bucket[k + 1] = key
                if k >= 0:
                    comparisons += 1
            
            steps.append(SortingStep(
                array=arr.copy(),
                buckets=[b.copy() for b in buckets],
                description=f"Bucket {i + 1} sorted: {bucket}"
            ))
    
    # Concatenate buckets
    result = []
    for i, bucket in enumerate(buckets):
        for num in bucket:
            result.append(num)
            steps.append(SortingStep(
                array=result.copy() + [0] * (n - len(result)),
                sorted=list(range(len(result) - 1)),
                comparing=[len(result) - 1],
                buckets=[b.copy() for b in buckets],
                description=f"Adding {num} from bucket {i + 1} to result"
            ))
    
    steps.append(SortingStep(
        array=result.copy(),
        sorted=list(range(len(result))),
        description="Array sorted!"
    ))
    
    return steps, comparisons, swaps


SORTING_ALGORITHMS = {
    "bubble": bubble_sort_steps,
    "selection": selection_sort_steps,
    "insertion": insertion_sort_steps,
    "merge": merge_sort_steps,
    "quick": quick_sort_steps,
    "heap": heap_sort_steps,
    "counting": counting_sort_steps,
    "radix": radix_sort_steps,
}


@router.post("/{algorithm}", response_model=SortingResponse)
async def execute_sorting(algorithm: str, request: SortingRequest):
    """Execute a sorting algorithm and return visualization steps"""
    if algorithm not in SORTING_ALGORITHMS:
        available = ", ".join(SORTING_ALGORITHMS.keys())
        return {"error": f"Algorithm not found. Available: {available}"}
    
    sort_func = SORTING_ALGORITHMS[algorithm]
    steps, comparisons, swaps = sort_func(request.array)
    
    return SortingResponse(
        algorithm=algorithm,
        steps=steps,
        total_comparisons=comparisons,
        total_swaps=swaps
    )


@router.get("/")
async def list_sorting_algorithms():
    """List available sorting algorithms"""
    return {
        "algorithms": list(SORTING_ALGORITHMS.keys()),
        "descriptions": {
            "bubble": "Simple comparison-based algorithm, O(n²)",
            "selection": "Selects minimum element each pass, O(n²)",
            "insertion": "Builds sorted array one element at a time, O(n²)",
            "merge": "Divide and conquer, O(n log n)",
            "quick": "Divide and conquer with pivot, O(n log n) average",
            "heap": "Uses heap data structure, O(n log n)",
            "counting": "Non-comparison based, O(n+k)",
            "radix": "Sorts by digits, O(nk)",
        }
    }
