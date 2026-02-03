from fastapi import APIRouter
from models.schemas import TreeRequest, TreeResponse, TreeStep

router = APIRouter()


def build_tree_dict(values: list[int]) -> dict:
    """Build a balanced BST from values"""
    if not values:
        return None
    
    def insert(root, val):
        if root is None:
            return {"value": val, "left": None, "right": None}
        if val < root["value"]:
            root["left"] = insert(root["left"], val)
        else:
            root["right"] = insert(root["right"], val)
        return root
    
    root = None
    for val in values:
        root = insert(root, val)
    return root


def inorder_steps(tree: dict) -> tuple[list[TreeStep], list[int]]:
    steps = []
    result = []
    
    def inorder(node, visited):
        if node is None:
            return
        steps.append(TreeStep(tree=tree, current=node["value"], visited=visited.copy(),
            description=f"Going left from {node['value']}"))
        inorder(node["left"], visited)
        visited.append(node["value"])
        result.append(node["value"])
        steps.append(TreeStep(tree=tree, current=node["value"], visited=visited.copy(),
            description=f"Visited {node['value']}"))
        inorder(node["right"], visited)
    
    steps.append(TreeStep(tree=tree, visited=[], description="Starting inorder traversal (Left-Root-Right)"))
    inorder(tree, [])
    steps.append(TreeStep(tree=tree, visited=result, description=f"Inorder: {result}"))
    return steps, result


def preorder_steps(tree: dict) -> tuple[list[TreeStep], list[int]]:
    steps = []
    result = []
    
    def preorder(node, visited):
        if node is None:
            return
        visited.append(node["value"])
        result.append(node["value"])
        steps.append(TreeStep(tree=tree, current=node["value"], visited=visited.copy(),
            description=f"Visited {node['value']}"))
        preorder(node["left"], visited)
        preorder(node["right"], visited)
    
    steps.append(TreeStep(tree=tree, visited=[], description="Starting preorder traversal (Root-Left-Right)"))
    preorder(tree, [])
    steps.append(TreeStep(tree=tree, visited=result, description=f"Preorder: {result}"))
    return steps, result


def postorder_steps(tree: dict) -> tuple[list[TreeStep], list[int]]:
    steps = []
    result = []
    
    def postorder(node, visited):
        if node is None:
            return
        postorder(node["left"], visited)
        postorder(node["right"], visited)
        visited.append(node["value"])
        result.append(node["value"])
        steps.append(TreeStep(tree=tree, current=node["value"], visited=visited.copy(),
            description=f"Visited {node['value']}"))
    
    steps.append(TreeStep(tree=tree, visited=[], description="Starting postorder traversal (Left-Right-Root)"))
    postorder(tree, [])
    steps.append(TreeStep(tree=tree, visited=result, description=f"Postorder: {result}"))
    return steps, result


def levelorder_steps(tree: dict) -> tuple[list[TreeStep], list[int]]:
    steps = []
    result = []
    
    if not tree:
        return [TreeStep(tree={}, visited=[], description="Empty tree")], []
    
    queue = [tree]
    steps.append(TreeStep(tree=tree, visited=[], description="Starting level-order traversal (BFS)"))
    
    while queue:
        node = queue.pop(0)
        result.append(node["value"])
        steps.append(TreeStep(tree=tree, current=node["value"], visited=result.copy(),
            description=f"Visited {node['value']}"))
        if node["left"]:
            queue.append(node["left"])
        if node["right"]:
            queue.append(node["right"])
    
    steps.append(TreeStep(tree=tree, visited=result, description=f"Level-order: {result}"))
    return steps, result


def bst_insert_steps(tree: dict, value: int) -> tuple[list[TreeStep], dict]:
    steps = []
    import copy
    new_tree = copy.deepcopy(tree) if tree else None
    
    steps.append(TreeStep(tree=new_tree or {}, visited=[], description=f"Inserting {value}"))
    
    def insert(node, val, path):
        if node is None:
            steps.append(TreeStep(tree=new_tree or {}, current=val, visited=path,
                description=f"Inserted {val} here"))
            return {"value": val, "left": None, "right": None}
        
        path.append(node["value"])
        if val < node["value"]:
            steps.append(TreeStep(tree=new_tree or {}, current=node["value"], comparing=val,
                visited=path.copy(), description=f"{val} < {node['value']}, go left"))
            node["left"] = insert(node["left"], val, path)
        else:
            steps.append(TreeStep(tree=new_tree or {}, current=node["value"], comparing=val,
                visited=path.copy(), description=f"{val} >= {node['value']}, go right"))
            node["right"] = insert(node["right"], val, path)
        return node
    
    new_tree = insert(new_tree, value, [])
    steps.append(TreeStep(tree=new_tree, visited=[], description=f"Inserted {value} successfully"))
    return steps, new_tree


def bst_search_steps(tree: dict, value: int) -> tuple[list[TreeStep], bool]:
    steps = []
    found = False
    path = []
    
    steps.append(TreeStep(tree=tree, visited=[], description=f"Searching for {value}"))
    
    node = tree
    while node:
        path.append(node["value"])
        if node["value"] == value:
            found = True
            steps.append(TreeStep(tree=tree, current=node["value"], visited=path.copy(),
                description=f"Found {value}!"))
            break
        elif value < node["value"]:
            steps.append(TreeStep(tree=tree, current=node["value"], comparing=value,
                visited=path.copy(), description=f"{value} < {node['value']}, go left"))
            node = node["left"]
        else:
            steps.append(TreeStep(tree=tree, current=node["value"], comparing=value,
                visited=path.copy(), description=f"{value} > {node['value']}, go right"))
            node = node["right"]
    
    if not found:
        steps.append(TreeStep(tree=tree, visited=path, description=f"{value} not found"))
    return steps, found


@router.post("/{algorithm}", response_model=TreeResponse)
async def execute_tree_algorithm(algorithm: str, request: TreeRequest):
    tree = request.tree or build_tree_dict(request.values or [])
    
    if algorithm == "inorder":
        steps, result = inorder_steps(tree)
    elif algorithm == "preorder":
        steps, result = preorder_steps(tree)
    elif algorithm == "postorder":
        steps, result = postorder_steps(tree)
    elif algorithm == "levelorder":
        steps, result = levelorder_steps(tree)
    elif algorithm == "insert":
        steps, tree = bst_insert_steps(tree, request.value)
        return TreeResponse(algorithm=algorithm, steps=steps, result=[request.value])
    elif algorithm == "search":
        steps, found = bst_search_steps(tree, request.value)
        return TreeResponse(algorithm=algorithm, steps=steps, result=[request.value] if found else [])
    else:
        return {"error": f"Unknown algorithm: {algorithm}"}
    
    return TreeResponse(algorithm=algorithm, steps=steps, result=result)


@router.get("/")
async def list_tree_algorithms():
    return {"algorithms": ["inorder", "preorder", "postorder", "levelorder", "insert", "search"]}
