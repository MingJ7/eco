import requests
import json 
from timeit import default_timer

mainList = [
    {"mainName": "Rice", "cost": 1},
    # {"mainName": "Porridge", "cost": 1},
    # {"mainName": "Bun", "cost": 1},
    # {"mainName": "Dish only", "cost": 1}
]

sideList = [
    {"sideName": "Spinach with mince pork", "description": "hello", "cost": 0.5},
    # {"sideName": "Steamed eggs with minced pork", "description": "hello", "cost": 0.5},
    # {"sideName": "Steamed eggs", "description": "hello", "cost": 0.5},
    # {"sideName": "Curry chicken", "description": "hello", "cost": 0.5},
    # {"sideName": "Braised pork", "description": "hello", "cost": 0.5},
    # {"sideName": "Long beans with minced pork", "description": "hello", "cost": 0.5},
    # {"sideName": "Fried chicken drumsticks", "description": "hello", "cost": 0.5},
    # {"sideName": "Bittergourd", "description": "hello", "cost": 0.5},
    # {"sideName": "Braised chicken", "description": "hello", "cost": 0.5},
    # {"sideName": "Spinach", "description": "hello", "cost": 0.5},
    # {"sideName": "Long beans with carrots", "description": "hello", "cost": 0.5},
    # {"sideName": "Minced pork with salted egg", "description": "hello", "cost": 0.5},
    # {"sideName": "Salted egg", "description": "hello", "cost": 0.5},
    # {"sideName": "Fried tofu", "description": "hello", "cost": 0.5},
    # {"sideName": "Steamed tofu", "description": "hello", "cost": 0.5},
    # {"sideName": "Tau Pok", "description": "hello", "cost": 0.5},
    # {"sideName": "Sweet and sour pork", "description": "hello", "cost": 0.5},
    # {"sideName": "Steamed chicken drumsticks", "description": "hello", "cost": 0.5},
    # {"sideName": "Breaded and fried chicken slices", "description": "hello", "cost": 0.5},
    # {"sideName": "Sour briased pork", "description": "hello", "cost": 0.5},
    # {"sideName": "Fish fillets", "description": "hello", "cost": 0.5},
]

if __name__ == "__main__":
    start = default_timer()
    for main in mainList:
        res = requests.put('http://localhost:3000/api/admin/main', data=json.dumps(main))
        if (res.status_code != 200): print(f"An error has occured adding {main}")
        # print(res.status_code)
    for side in sideList:
        res = requests.put('http://localhost:3000/api/admin/side', data=json.dumps(side))
        if (res.status_code != 200): print(f"An error has occured adding {side}")
    # response = json.loads(res.text)
    print("the time taken is")
    print(default_timer() - start)