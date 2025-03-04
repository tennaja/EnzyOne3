import numpy as np
import pickle
import sys
import json

args = sys.argv[1:]
data = args[0]

array = pickle.loads(bytes.fromhex(data))

# Convert numpy array to list
list_array = array.tolist()

# Serialize to JSON
json_array = json.dumps(list_array)

print(json_array)