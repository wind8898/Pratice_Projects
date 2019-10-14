import os
import csv

file = '/users/swang/downloads/python/election_data.csv'

with open (file) as csvfile:
    csvreader = csv.reader(csvfile, delimiter=",")
    
    csv_header = next(csvreader)
    
    # define lists (Voter ID, County, Candidate)
    
    Total_Vote = 0
    Candidate = []
    Each_Candidate = []
    vote_count = []
    vote_percent = []
    
    for row in csvreader:
        
# The total number of votes cast
        Total_Vote = Total_Vote + 1
# A complete list of candidates who received votes
        Candidate.append(row[2])
        Candidate_List = set(Candidate)
        
# The total number of votes each candidate won & The percentage of votes each candidate won

    for x in Candidate_List:
        Each_Candidate.append(x)
        y = Candidate.count(x)
        vote_count.append(y)
        z = (y/Total_Vote)*100
        vote_percent.append(z)
        

# The winner of the election based on popular vote.
        winning_vote_count = max(vote_count)
        winner = Each_Candidate[vote_count.index(winning_vote_count)]
    
        print("-------------------------")
        print("Election Results")   
        print("-------------------------")
        print("Total Votes :" + str(Total_Vote))    
        print("-------------------------")
        for i in range(len(Each_Candidate)):
                    print(Each_Candidate[i] + ": " + str(vote_percent[i]) +"% (" + str(vote_count[i])+ ")")
        print("-------------------------")
        print("The winner is: " + winner)
        print("-------------------------")

with open('election_results.txt', 'w') as text:
    text.write("Election Results")
    text.write("---------------------------------------")
    text.write("Total Vote: " + str(Total_Vote))
    text.write("---------------------------------------")
    for i in range(len(set(Each_Candidate))):
        text.write(Each_Candidate[i] + ": " + str(vote_percent[i]) +"% (" + str(vote_count[i]) + ")")
    text.write("---------------------------------------")
    text.write("The winner is: " + winner)
    text.write("---------------------------------------")
    