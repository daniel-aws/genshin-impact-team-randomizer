import json

jsonFile = open("./src/data/characterData.json")
data = json.load(jsonFile)

print("Starting Main List, please wait until complete")

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

print("Starting 3.2 First Half List, please wait until complete")

with open("genshinTeamsNamed33FirstHalf.csv",'r') as f:
    with open("./src/data/teampresets33FirstHalf.ts",'w') as f1:
        f.readline() # skip header line
        f1.write("export const teamPresets33FirstHalf = [\n")
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

jsonFile.close()

print("Starting 3.2 Second Half List, please wait until complete")

with open("genshinTeamsNamed33SecondHalf.csv",'r') as f:
    with open("./src/data/teampresets33SecondHalf.ts",'w') as f1:
        f.readline() # skip header line
        f1.write("export const teamPresets33SecondHalf = [\n")
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

jsonFile.close()

print("Job Complete")

exit(0)
