from fastapi import APIRouter
from models.schemas import DPRequest, DPResponse, DPStep

router = APIRouter()


def fibonacci_steps(n: int) -> tuple[list[DPStep], int]:
    steps = []
    if n <= 0:
        return [DPStep(table=[[0]], current_cell=(0, 0), description="n <= 0, result is 0")], 0
    
    dp = [0] * (n + 1)
    dp[0], dp[1] = 0, 1
    
    steps.append(DPStep(table=[dp.copy()], current_cell=(0, 0), description="Initialize: F(0)=0, F(1)=1"))
    
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
        steps.append(DPStep(table=[dp.copy()], current_cell=(0, i),
            description=f"F({i}) = F({i-1}) + F({i-2}) = {dp[i-1]} + {dp[i-2]} = {dp[i]}"))
    
    steps.append(DPStep(table=[dp.copy()], current_cell=(0, n),
        description=f"Fibonacci({n}) = {dp[n]}"))
    return steps, dp[n]


def knapsack_steps(weights: list[int], values: list[int], capacity: int) -> tuple[list[DPStep], int]:
    steps = []
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    steps.append(DPStep(table=[row.copy() for row in dp], current_cell=(0, 0),
        description=f"0/1 Knapsack: {n} items, capacity {capacity}"))
    
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w-weights[i-1]])
                if dp[i][w] > dp[i-1][w]:
                    steps.append(DPStep(table=[row.copy() for row in dp], current_cell=(i, w),
                        description=f"Take item {i}: value={values[i-1]}, dp[{i}][{w}]={dp[i][w]}"))
            else:
                dp[i][w] = dp[i-1][w]
    
    steps.append(DPStep(table=[row.copy() for row in dp], current_cell=(n, capacity),
        description=f"Max value: {dp[n][capacity]}"))
    return steps, dp[n][capacity]


def lcs_steps(s1: str, s2: str) -> tuple[list[DPStep], int]:
    steps = []
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    steps.append(DPStep(table=[row.copy() for row in dp], current_cell=(0, 0),
        description=f"LCS of '{s1}' and '{s2}'"))
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
                steps.append(DPStep(table=[row.copy() for row in dp], current_cell=(i, j),
                    description=f"Match: '{s1[i-1]}' = '{s2[j-1]}', LCS length = {dp[i][j]}"))
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    steps.append(DPStep(table=[row.copy() for row in dp], current_cell=(m, n),
        description=f"LCS length: {dp[m][n]}"))
    return steps, dp[m][n]


def lis_steps(arr: list[int]) -> tuple[list[DPStep], int]:
    steps = []
    n = len(arr)
    if n == 0:
        return [DPStep(table=[[0]], current_cell=(0, 0), description="Empty array")], 0
    
    dp = [1] * n
    steps.append(DPStep(table=[arr, dp.copy()], current_cell=(0, 0),
        description="Initialize all LIS lengths to 1"))
    
    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i]:
                dp[i] = max(dp[i], dp[j] + 1)
                steps.append(DPStep(table=[arr, dp.copy()], current_cell=(1, i),
                    description=f"arr[{j}]={arr[j]} < arr[{i}]={arr[i]}: dp[{i}]={dp[i]}"))
    
    result = max(dp)
    steps.append(DPStep(table=[arr, dp], current_cell=(1, dp.index(result)),
        description=f"LIS length: {result}"))
    return steps, result


@router.post("/{algorithm}", response_model=DPResponse)
async def execute_dp_algorithm(algorithm: str, request: DPRequest):
    if algorithm == "fibonacci":
        n = request.n or request.input_data
        steps, result = fibonacci_steps(n)
    elif algorithm == "knapsack":
        data = request.input_data
        steps, result = knapsack_steps(data["weights"], data["values"], request.capacity or data["capacity"])
    elif algorithm == "lcs":
        s1, s2 = request.input_data["s1"], request.input_data["s2"]
        steps, result = lcs_steps(s1, s2)
    elif algorithm == "lis":
        steps, result = lis_steps(request.input_data)
    else:
        return {"error": f"Unknown algorithm: {algorithm}"}
    
    return DPResponse(algorithm=algorithm, steps=steps, result=result)


@router.get("/")
async def list_dp_algorithms():
    return {"algorithms": ["fibonacci", "knapsack", "lcs", "lis"]}
