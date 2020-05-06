import os
import csv

file = "/Users/swang/Downloads/Python/budget_data.csv"

with open (file) as csvfile:
    csvreader = csv.reader(csvfile, delimiter=",")
    
    csv_header = next(csvreader)

# Defnite list container

    dates = []
    profit_or_losses = []
    net_profit_or_losses = []
    previous_change = 0
    
    
    for row in csvreader:
        
        dates.append(row[0])
        
        # Cal Totoal Months
        TotalMonth = len(dates)
        
        # Cal Net total amount of profit/losses
        
        profit_or_losses.append(int(row[1]))
        
        Net_Money = sum (profit_or_losses)
        
        # Cal The average of the changes in "Profit/Losses" over the entire period
        
        Monthly_change = int(row[1]) - int(previous_change)
        
        previous_change = row[1]
        
        net_profit_or_losses.append(Monthly_change)
        
        Average_Change = sum(net_profit_or_losses)/len(net_profit_or_losses)
            
        # The greatest increase in profits (date and amount) over the entire period
        GreatestIncrease = max (net_profit_or_losses)
        Increase_Date = dates[net_profit_or_losses.index(GreatestIncrease)]
        
        # The greatest decrease in losses (date and amount) over the entire period
        GreatestDecrease = min (net_profit_or_losses)
        Decrease_Date = dates[net_profit_or_losses.index(GreatestDecrease)]
        
        
# output results
with open ('Pybank_output.txt', 'w') as text_file:
    print(f'Total Months: {TotalMonth}', file=text_file)
    print(f'Net total amount of Profit/Losses over the entire period: {Net_Money}', file=text_file)
    print(f'The average of the changes in "Profit/Losses" over the entire period: {Average_Change}', file=text_file)
    print(f'The greatest increase in profits (date and amount) over the entire period is {GreatestIncrease} on {Increase_Date}', file=text_file)
    print(f'The greatest decrease in losses (date and amount) over the entire period {GreatestDecrease} on {Decrease_Date}', file=text_file)
