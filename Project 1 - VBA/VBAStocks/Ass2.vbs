Sub Ticker_Cal()

Dim ws As Worksheet

For Each ws In Worksheets

' write the header
ws.Range("K1").Value = "Ticker"
ws.Range("L1").Value = "Yearly Change"
ws.Range("M1").Value = "Percent Change"
ws.Range("N1").Value = "Total Stock Volume"


' set up variables for Q1: symbol

Dim i As Long
Dim ticker As String
Dim ticker_count As Long
Dim lastrow As Long

' set up variables for Q2: Yearly Change
Dim yearly_open As Double
Dim yearly_close As Double
Dim yearly_change As Double
Dim open_price As Long

' set up variables for Q3: Percent Change
Dim percent_change As Double

' set up variables for Q4: Total Volume
Dim Total_Volume As Long

' write the header and variables for challenge
ws.Range("Q1").Value = "Ticker"
ws.Range("R1").Value = "Value"
ws.Range("P2").Value = "Greatest % Increase"
ws.Range("P3").Value = "Greatest % Decrease"
ws.Range("P4").Value = "Greatest Total Volume"
Dim j As Long
Dim var1, var2, var3 As Variant

' Setting up initial status

ticker_count = 2
openprice = 2
lastrow = Cells(Rows.Count, 1).End(xlUp).Row
Total_Volume = 0

For i = 2 To lastrow
    
    'Q1: Write the ticker symbol
    
        If ws.Cells(i + 1, 1).Value <> ws.Cells(i, 1).Value Then
        ticker = ws.Cells(i, 1).Value
      
        ws.Range("K" & ticker_count).Value = ticker
    
    
    'Q2: Yearly change from opening price at the beginning of a given year to the closing price at the end of that year.
    
    yearly_open = ws.Range("C" & openprice)
    yearly_close = ws.Range("F" & i)
    yearly_change = yearly_close - yearly_open
    ws.Range("L" & ticker_count).Value = yearly_change
    
    
    'Q3: The percent change from opening price at the beginning of a given year to the closing price at the end of that year.
    
    percent_change = yearly_change / yearly_open
    ws.Range("M" & ticker_count).Value = percent_change
    ws.Range("M" & ticker_count).NumberFormat = "0.00%"
    
    'Q4: The total stock volume of the stock.
    Total_Volume = Total_Volume + ws.Cells(i, 7).Value
    ws.Range("N" & ticker_count).Value = Total_Volume
    Total_Volume = 0
    
    
    'Conditional formatting that will highlight positive change in green and negative change in red
    
    If ws.Range("L" & ticker_count).Value >= 0 Then
       ws.Range("L" & ticker_count).Interior.ColorIndex = 4
    Else
        ws.Range("L" & ticker_count).Interior.ColorIndex = 3
    End If
    
    
    ticker_count = ticker_count + 1
    openprice = openprice + 1
    
    
    End If
    
    Next i
    
    'Challenge Questions: "Greatest % increase", "Greatest % Decrease" and "Greatest total volume".
    
    lastrow_2 = ws.Cells(Rows.Count, 13).End(xlUp).Row
    var1 = 0
    var2 = 0
    var3 = 0
    ws.Range("R2").NumberFormat = "0.00%"
    ws.Range("R3").NumberFormat = "0.00%"
    
    For j = 2 To lastrow_2
    
    If ws.Range("M" & j) > var1 Then
    var1 = ws.Range("M" & j).Value
    ws.Range("R2").Value = var1
    ws.Range("Q2").Value = ws.Range("K" & j).Value
    
    End If
    
    If ws.Range("M" & j) < var2 Then
    var2 = ws.Range("M" & j).Value
    ws.Range("R3").Value = var2
    ws.Range("Q3").Value = ws.Range("K" & j).Value
    
    End If
    
    If ws.Range("N" & j) > var3 Then
    var3 = ws.Range("N" & j).Value
    ws.Range("R4").Value = var3
    ws.Range("Q4").Value = ws.Range("K" & j).Value
    
    End If
    
Next j


Next ws

End Sub





