import requests
import json
import random
from timeit import default_timer

start = default_timer()
orderRes = requests.get("http://localhost:3000/api/admin/order")
print(orderRes.status_code)
print("time to get 50k orders: " + str(default_timer() - start))

orderList = orderRes.json()
print(orderList)
i = 0
updated = 0
start = default_timer()
for order in orderList:
    i += 1
    if i % 2 == 0:
        continue
    if requests.post("http://localhost:3000/api/admin/order", data=json.dumps({"id": order["_id"], "status": 1})).status_code == 200:
        updated += 1
    else:
        raise ValueError("Id may not be correct")
print(f"updated {updated} out of {i}")
print("time to update 25k order: " + str(default_timer() - start))

start = default_timer()
orderRes = requests.get("http://localhost:3000/api/admin/order")
print(orderRes.status_code)
print("time to get incomplete orders (50k -25k): " + str(default_timer() - start))
