import requests
import json
import random
import databaseInit
from timeit import default_timer

mainList = requests.get("http://localhost:3000/api/main").json()
sideList = requests.get("http://localhost:3000/api/side").json()

order = { "dishes": [] }
# for i in range(random.randrange(1, 10)):
for i in range(5):
    order["dishes"].append({
        "main_id": random.choice(mainList)["_id"],
        "side1_id": random.choice(sideList)["_id"],
        "side2_id": random.choice(sideList)["_id"],
        "side3_id": random.choice(sideList)["_id"],
        "side4_id": random.choice(sideList)["_id"],
        "side5_id": random.choice(sideList)["_id"]
    })

start = default_timer()
res = requests.post("http://localhost:3000/api/order", data=json.dumps(order))
print(res.status_code)
print("time taken: " + str(default_timer() - start))
