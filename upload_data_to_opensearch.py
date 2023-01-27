import json
import csv
import sys
import os
import boto3
import numpy as np
from opensearchpy import OpenSearch, RequestsHttpConnection, AWSV4SignerAuth

assert (sys.maxsize & (sys.maxsize+1)) == 0 # checks that maxsize+1 is a power of 2 
jsonFile = open("./src/data/characterData.json")
data = json.load(jsonFile)

hashseed = os.getenv('PYTHONHASHSEED')
if not hashseed:
    os.environ['PYTHONHASHSEED'] = '0'
    os.execv(sys.executable, ['python'] + sys.argv)

print("Starting, please wait until complete")

host = os.getenv('OPENSEARCH_ENDPOINT')
port = 443
region = 'us-east-1'

credentials = boto3.Session().get_credentials()
auth = AWSV4SignerAuth(credentials, region)

client = OpenSearch(
    hosts = [{'host': host, 'port': port}],
    http_compress = True, # enables gzip compression for request bodies
    http_auth = auth,
    use_ssl = True,
    verify_certs = True,
    connection_class = RequestsHttpConnection
)

response = client.delete_by_query(
    index = "genshin",
    body = {
        "query": {
            "match_all": {}
        }
    }
)

jsonData = ""

with open("genshinTeamsNamed.csv",'r') as f3:
    mainFileArray = np.loadtxt(f3, delimiter=",", dtype=str)
    mainFileArray = np.sort(mainFileArray)

    for team in mainFileArray:
        arrayToString = ""
        jsonEntryBody = {}
        counter = 1
        for character in team:
          arrayToString += character
          jsonEntryBody[counter] = character
          counter += 1

        hashValue = hash(arrayToString) + sys.maxsize + 1

        jsonEntryHeader = {"index": {"_index": "genshin", "_id": hashValue}}

        jsonData += (json.dumps(jsonEntryHeader) + "\n" + json.dumps(jsonEntryBody) + "\n")
        
f3.close()

response = client.bulk(jsonData)

print('\nAdding bulk documents to Opensearch')
print(response)

jsonFile.close()

print("Complete")

exit(0)
