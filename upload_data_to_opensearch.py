import json
import csv
import sys
import os
import boto3
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

response = client.delete_by_query(
    index = "genshin-3-3-firsthalf",
    body = {
        "query": {
            "match_all": {}
        }
    }
)

response = client.delete_by_query(
    index = "genshin-3-3-secondhalf",
    body = {
        "query": {
            "match_all": {}
        }
    }
)

jsonData = ""

with open("genshinTeamsNamed.csv",'r') as f3:
    csvReader = csv.DictReader(f3)
    alphabeticalRow = [None, None, None, None]

    for rows in csvReader:

        alphabeticalRow[0] = rows['Character 1']
        alphabeticalRow[1] = rows['Character 2']
        alphabeticalRow[2] = rows['Character 3']
        alphabeticalRow[3] = rows['Character 4']
        alphabeticalRow.sort()
        arrayToString = alphabeticalRow[0] + alphabeticalRow[1] + alphabeticalRow[2] + alphabeticalRow[3]
        hashValue = hash(arrayToString) + sys.maxsize + 1

        jsonEntryHeader = {"index": {"_index": "genshin", "_id": hashValue}}
        jsonEntryBody = {}

        jsonEntryBody['1'] = alphabeticalRow[0]
        jsonEntryBody['2'] = alphabeticalRow[1]
        jsonEntryBody['3'] = alphabeticalRow[2]
        jsonEntryBody['4'] = alphabeticalRow[3]

        jsonData += (json.dumps(jsonEntryHeader) + "\n" + json.dumps(jsonEntryBody) + "\n")
        
f3.close()

response = client.bulk(jsonData)

print('\nAdding bulk documents to Opensearch')
print(response)

jsonData = ""

with open("genshinTeamsNamed33FirstHalf.csv",'r') as f3:
    csvReader = csv.DictReader(f3)
    alphabeticalRow = [None, None, None, None]

    for rows in csvReader:

        alphabeticalRow[0] = rows['Character 1']
        alphabeticalRow[1] = rows['Character 2']
        alphabeticalRow[2] = rows['Character 3']
        alphabeticalRow[3] = rows['Character 4']
        alphabeticalRow.sort()
        arrayToString = alphabeticalRow[0] + alphabeticalRow[1] + alphabeticalRow[2] + alphabeticalRow[3]
        hashValue = hash(arrayToString) + sys.maxsize + 1

        jsonEntryHeader = {"index": {"_index": "genshin-3-3-firsthalf", "_id": hashValue}}
        jsonEntryBody = {}

        jsonEntryBody['1'] = alphabeticalRow[0]
        jsonEntryBody['2'] = alphabeticalRow[1]
        jsonEntryBody['3'] = alphabeticalRow[2]
        jsonEntryBody['4'] = alphabeticalRow[3]

        jsonData += (json.dumps(jsonEntryHeader) + "\n" + json.dumps(jsonEntryBody) + "\n")
        
f3.close()

response = client.bulk(jsonData)

print('\nAdding bulk documents to Opensearch')
print(response)

jsonData = ""

with open("genshinTeamsNamed33SecondHalf.csv",'r') as f3:
    csvReader = csv.DictReader(f3)
    alphabeticalRow = [None, None, None, None]

    for rows in csvReader:

        alphabeticalRow[0] = rows['Character 1']
        alphabeticalRow[1] = rows['Character 2']
        alphabeticalRow[2] = rows['Character 3']
        alphabeticalRow[3] = rows['Character 4']
        alphabeticalRow.sort()
        arrayToString = alphabeticalRow[0] + alphabeticalRow[1] + alphabeticalRow[2] + alphabeticalRow[3]
        hashValue = hash(arrayToString) + sys.maxsize + 1

        jsonEntryHeader = {"index": {"_index": "genshin-3-3-secondhalf", "_id": hashValue}}
        jsonEntryBody = {}

        jsonEntryBody['1'] = alphabeticalRow[0]
        jsonEntryBody['2'] = alphabeticalRow[1]
        jsonEntryBody['3'] = alphabeticalRow[2]
        jsonEntryBody['4'] = alphabeticalRow[3]

        jsonData += (json.dumps(jsonEntryHeader) + "\n" + json.dumps(jsonEntryBody) + "\n")
        
f3.close()

response = client.bulk(jsonData)

print('\nAdding bulk documents to Opensearch')
print(response)

jsonFile.close()

print("Complete")

exit(0)
