import json
import csv
import sys
import os
import boto3
from opensearchpy import OpenSearch, RequestsHttpConnection

assert (sys.maxsize & (sys.maxsize+1)) == 0 # checks that maxsize+1 is a power of 2 
jsonFile = open("./src/data/characterData.json")
data = json.load(jsonFile)

hashseed = os.getenv('PYTHONHASHSEED')
if not hashseed:
    os.environ['PYTHONHASHSEED'] = '0'
    os.execv(sys.executable, ['python'] + sys.argv)

print("Starting, please wait until complete")

with open("genshinTeamsNamed.csv",'r') as f:
    with open("./src/data/teampresets.ts",'w') as f1:
        f.readline() # skip header line
        f1.write("export const teamPresets = [\n")
        for line in f:
            line = '\t[' + line

            for i in data:
                if i["id"] != 39:
                    line = line.replace(i["shortName"], str(i["id"]))

            # Get rid of the trailing newline (if any).
            line = line.rstrip('\n')
            line += '],\n'
            f1.write(line)
        f1.write("];")
    f1.close()
f.close()


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

jsonFile.close()

response = client.bulk(jsonData)

print('\nAdding bulk documents to Opensearch')
print(response)

print("Complete")

exit(0)
