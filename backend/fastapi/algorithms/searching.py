from fastapi import APIRouter
from models.schemas import SearchingRequest, SearchingResponse, SearchingStep

router = APIRouter()


def linear_search_steps(arr: list[int], target: int) -> tuple[list[SearchingStep], bool, int | None]:
    """Linear Search with step-by-step visualization data"""
    steps = []
    found = False
    found_at = None
    
    steps.append(SearchingStep(
        array=arr.copy(),
        description=f"Searching for {target} in array"
    ))
    
    for i, num in enumerate(arr):
        steps.append(SearchingStep(
            array=arr.copy(),
            current=i,
            description=f"Checking index {i}: {num}"
        ))
        
        if num == target:
            found = True
            found_at = i
            steps.append(SearchingStep(
                array=arr.copy(),
                current=i,
                found=True,
                description=f"Found {target} at index {i}!"
            ))
            break
    
    if not found:
        steps.append(SearchingStep(
            array=arr.copy(),
            found=False,
            description=f"{target} not found in array"
        ))
    
    return steps, found, found_at


def binary_search_steps(arr: list[int], target: int) -> tuple[list[SearchingStep], bool, int | None]:
    """Binary Search with step-by-step visualization data"""
    steps = []
    found = False
    found_at = None
    
    # Sort array first for binary search
    sorted_arr = sorted(arr)
    
    steps.append(SearchingStep(
        array=sorted_arr.copy(),
        description=f"Binary search requires sorted array. Searching for {target}"
    ))
    
    left, right = 0, len(sorted_arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        steps.append(SearchingStep(
            array=sorted_arr.copy(),
            left=left,
            right=right,
            mid=mid,
            description=f"Checking middle: index {mid} = {sorted_arr[mid]}"
        ))
        
        if sorted_arr[mid] == target:
            found = True
            found_at = mid
            steps.append(SearchingStep(
                array=sorted_arr.copy(),
                mid=mid,
                found=True,
                description=f"Found {target} at index {mid}!"
            ))
            break
        elif sorted_arr[mid] < target:
            steps.append(SearchingStep(
                array=sorted_arr.copy(),
                left=left,
                right=right,
                mid=mid,
                description=f"{sorted_arr[mid]} < {target}, searching right half"
            ))
            left = mid + 1
        else:
            steps.append(SearchingStep(
                array=sorted_arr.copy(),
                left=left,
                right=right,
                mid=mid,
                description=f"{sorted_arr[mid]} > {target}, searching left half"
            ))
            right = mid - 1
    
    if not found:
        steps.append(SearchingStep(
            array=sorted_arr.copy(),
            found=False,
            description=f"{target} not found in array"
        ))
    
    return steps, found, found_at


def jump_search_steps(arr: list[int], target: int) -> tuple[list[SearchingStep], bool, int | None]:
    """Jump Search with step-by-step visualization data"""
    steps = []
    found = False
    found_at = None
    
    sorted_arr = sorted(arr)
    n = len(sorted_arr)
    
    if n == 0:
        return [SearchingStep(array=[], description="Empty array")], False, None
    
    import math
    step = int(math.sqrt(n))
    
    steps.append(SearchingStep(
        array=sorted_arr.copy(),
        description=f"Jump search with step size {step}. Searching for {target}"
    ))
    
    prev = 0
    while sorted_arr[min(step, n) - 1] < target:
        steps.append(SearchingStep(
            array=sorted_arr.copy(),
            current=min(step, n) - 1,
            description=f"Jumping: {sorted_arr[min(step, n) - 1]} < {target}"
        ))
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            steps.append(SearchingStep(
                array=sorted_arr.copy(),
                found=False,
                description=f"{target} not found in array"
            ))
            return steps, False, None
    
    steps.append(SearchingStep(
        array=sorted_arr.copy(),
        left=prev,
        right=min(step, n) - 1,
        description=f"Linear search in block [{prev}:{min(step, n)}]"
    ))
    
    # Linear search in block
    while prev < min(step, n):
        steps.append(SearchingStep(
            array=sorted_arr.copy(),
            current=prev,
            description=f"Checking index {prev}: {sorted_arr[prev]}"
        ))
        
        if sorted_arr[prev] == target:
            found = True
            found_at = prev
            steps.append(SearchingStep(
                array=sorted_arr.copy(),
                current=prev,
                found=True,
                description=f"Found {target} at index {prev}!"
            ))
            break
        prev += 1
    
    if not found:
        steps.append(SearchingStep(
            array=sorted_arr.copy(),
            found=False,
            description=f"{target} not found in array"
        ))
    
    return steps, found, found_at


def interpolation_search_steps(arr: list[int], target: int) -> tuple[list[SearchingStep], bool, int | None]:
    """Interpolation Search with step-by-step visualization data"""
    steps = []
    found = False
    found_at = None
    
    sorted_arr = sorted(arr)
    n = len(sorted_arr)
    
    if n == 0:
        return [SearchingStep(array=[], description="Empty array")], False, None
    
    steps.append(SearchingStep(
        array=sorted_arr.copy(),
        description=f"Interpolation search. Searching for {target}"
    ))
    
    low, high = 0, n - 1
    
    while low <= high and target >= sorted_arr[low] and target <= sorted_arr[high]:
        if low == high:
            if sorted_arr[low] == target:
                found = True
                found_at = low
                steps.append(SearchingStep(
                    array=sorted_arr.copy(),
                    current=low,
                    found=True,
                    description=f"Found {target} at index {low}!"
                ))
            break
        
        # Interpolation formula
        pos = low + ((target - sorted_arr[low]) * (high - low) // 
                     (sorted_arr[high] - sorted_arr[low]))
        
        steps.append(SearchingStep(
            array=sorted_arr.copy(),
            left=low,
            right=high,
            current=pos,
            description=f"Interpolated position: {pos}, value: {sorted_arr[pos]}"
        ))
        
        if sorted_arr[pos] == target:
            found = True
            found_at = pos
            steps.append(SearchingStep(
                array=sorted_arr.copy(),
                current=pos,
                found=True,
                description=f"Found {target} at index {pos}!"
            ))
            break
        elif sorted_arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    
    if not found:
        steps.append(SearchingStep(
            array=sorted_arr.copy(),
            found=False,
            description=f"{target} not found in array"
        ))
    
    return steps, found, found_at


def exponential_search_steps(arr: list[int], target: int) -> tuple[list[SearchingStep], bool, int | None]:
    """Exponential Search with step-by-step visualization data"""
    steps = []
    found = False
    found_at = None
    
    sorted_arr = sorted(arr)
    n = len(sorted_arr)
    
    if n == 0:
        return [SearchingStep(array=[], description="Empty array")], False, None
    
    steps.append(SearchingStep(
        array=sorted_arr.copy(),
        description=f"Exponential search. Searching for {target}"
    ))
    
    if sorted_arr[0] == target:
        return [SearchingStep(
            array=sorted_arr.copy(),
            current=0,
            found=True,
            description=f"Found {target} at index 0!"
        )], True, 0
    
    # Find range for binary search
    i = 1
    while i < n and sorted_arr[i] <= target:
        steps.append(SearchingStep(
            array=sorted_arr.copy(),
            current=i,
            description=f"Exponential jump to index {i}: {sorted_arr[i]}"
        ))
        i *= 2
    
    # Binary search in range
    left = i // 2
    right = min(i, n - 1)
    
    steps.append(SearchingStep(
        array=sorted_arr.copy(),
        left=left,
        right=right,
        description=f"Binary search in range [{left}:{right}]"
    ))
    
    while left <= right:
        mid = (left + right) // 2
        
        steps.append(SearchingStep(
            array=sorted_arr.copy(),
            left=left,
            right=right,
            mid=mid,
            description=f"Checking middle: {sorted_arr[mid]}"
        ))
        
        if sorted_arr[mid] == target:
            found = True
            found_at = mid
            steps.append(SearchingStep(
                array=sorted_arr.copy(),
                mid=mid,
                found=True,
                description=f"Found {target} at index {mid}!"
            ))
            break
        elif sorted_arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    if not found:
        steps.append(SearchingStep(
            array=sorted_arr.copy(),
            found=False,
            description=f"{target} not found in array"
        ))
    
    return steps, found, found_at


SEARCHING_ALGORITHMS = {
    "linear": linear_search_steps,
    "binary": binary_search_steps,
    "jump": jump_search_steps,
    "interpolation": interpolation_search_steps,
    "exponential": exponential_search_steps,
}


@router.post("/{algorithm}", response_model=SearchingResponse)
async def execute_searching(algorithm: str, request: SearchingRequest):
    """Execute a searching algorithm and return visualization steps"""
    if algorithm not in SEARCHING_ALGORITHMS:
        available = ", ".join(SEARCHING_ALGORITHMS.keys())
        return {"error": f"Algorithm not found. Available: {available}"}
    
    search_func = SEARCHING_ALGORITHMS[algorithm]
    steps, found, found_at = search_func(request.array, request.target)
    
    return SearchingResponse(
        algorithm=algorithm,
        steps=steps,
        found=found,
        found_at=found_at
    )


@router.get("/")
async def list_searching_algorithms():
    """List available searching algorithms"""
    return {
        "algorithms": list(SEARCHING_ALGORITHMS.keys()),
        "descriptions": {
            "linear": "Sequential search, O(n)",
            "binary": "Divide and conquer on sorted array, O(log n)",
            "jump": "Block-based search, O(√n)",
            "interpolation": "Improved binary for uniform distribution, O(log log n)",
            "exponential": "Exponential range finding + binary search, O(log n)",
        }
    }
