const sussyheader = document.getElementById('sussyheader');
const inputBox = document.getElementById('input');
const outputBox = document.getElementById('output');

var count = 0;

function test() {
	let strArray = Array.from(inputBox.value);
	let outputStr = TableEncoder(strArray, 13, 13);
	outputBox.value = outputStr
}


function yourmother() {
	console.log("is fat")
}


const BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/!@#_~|&*-:=?";

function ToBase64(position)
{
	//if type(Number)~="number" then Number=1 end
	let letter = BASE64.substring(Math.max(0, position-1), Math.max(1, position));
  //if Letter==nil then Letter="A" end

	return(letter);
}



function TableEncoder(drawnAreaTable, width, height) {
	//Initialise Variables used
	table = drawnAreaTable;
	//--------------------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------- Split the table into sub tables containing width amount of colours
	//--------------------------------------------------------------------------------------------------------------------------------------------------------
	console.log("");
	console.log("------------[TABLE DIVISION]-------------");
	console.log("[console]: --- lenght:",drawnAreaTable.length-1," height: ",height)
	dividedTable = [[]];
  for (var y = 0; y < (drawnAreaTable.length-1)/height; y++)
  {
    var smallTable = {};

    for (var x = 0; x < width; x++)
    {
      smallTable[x] = table[x + (y*height)];
			console.log("[console]: x:",x,"y:",y,"current:",table[x + (y*height)])
    }

    dividedTable[y] = smallTable;
  }
	//--------------------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------ Find starting pixels and ending pixels and set Starting and Width as new values
	//-------------------------------------------------------------------------------------------------------------------------------------------------------
	console.log("");
	console.log("-------------[START AND END]-------------");

	lenght       = table.length / width;

	let letter   = 0;
	var count    = 0;
	var starting = -1;

	for (var x = 0; x < dividedTable.length && starting==-1; x++)
	{
		console.log("[console]: (start) Analyzed Row:",x);
		for (var y = 0; y < width; y++)
    {
      letter = dividedTable[y][x];

			//letter was not
			if(letter != '-')
			{
				console.log("[console]: start found",count,"letter:",letter);
				starting = count;
				break;
			}
    }
		//increase count
		count++;
	}
	//--------------------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------ Find the ending of the image, to reduce lenght variable.
	//-------------------------------------------------------------------------------------------------------------------------------------------------------
	var ending = -1;
			letter = 0;
	var countB = ((table.length-1) / width)-1;

	for (var x = (dividedTable.length)-1; x >= 0 && ending == -1; x--)
	{
		console.log("[console]: (end) Analyzed row:",x)
		for (var y = 0; y < width; y++)
    {
      letter = dividedTable[y][x];
			//letter was not
			if(letter != '-')
			{
				console.log("[console]: end found",countB,"letter:",letter)
				ending = countB;
				break;
			}
    }
			//increase count
		countB = countB - 1;
	}

	ending = Math.floor(ending);

/////////////////////////////////////////////////////////////////////////////////// CONSOL PRINTS
	console.log("[console]: image start point:",starting," end point: ",ending, "original row lenght:",width-1);
	console.log("");
	console.log("-------------------[?]-------------------");
	//--------------------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------ Replace isolated "-" with "?" [J - J] = [J ? J]
	//--------------------------------------------------------------------------------------------------------------------------------------

	for (var tableAddress = 0; tableAddress < dividedTable.length; tableAddress++) //Goes through arrays
	{
		//Gather currently analyzed table (row)
    var currentTable = {};
		currentTable = dividedTable[tableAddress];
		// Lenght of the table
    var tablelength = Object.keys(currentTable).length;

		//Go through the elemets of that row
		for (var x = starting; x < ending; x++)
    {

			//Gather previous, current and next values
			var previous = currentTable[x - 1];
			var current  = currentTable[x];
			var next     = currentTable[x + 1];

			//Check to avoid replacement on first chars of the first table, and on the last ones
			if ((tableAddress > 0) && (x < ending)) {

				//Only replace the first dash if the one in the previous row is not a dash
				if ((next != '-') && (current == '-') && (dividedTable[tableAddress - 1][width-1] != '-') && (dividedTable[tableAddress - 1][width-1] != '?') && (x == 0)) { //////////////////////////////
					console.log("[console]:COND1:Original: ",x,dividedTable[tableAddress]);
					dividedTable[tableAddress][x] = '?';
					console.log("[console]:COND1:New:      ",x,dividedTable[tableAddress]);
					console.log("");
				}

				//Only replace with a "?" if the next character and the previous ones are neither nulls nor dashes
				if ((current == '-') && ((previous != '-') && (previous != null)) && ((next != '-') && (next != null)) && (x > 0)) {

					console.log("[console]:COND2:Original: ",x,dividedTable[tableAddress]);
					dividedTable[tableAddress][x] = '?';
					console.log("[console]:COND2:New:      ",x,dividedTable[tableAddress]);
					console.log("");
				}
			} else {
				if ((x < tablelength-1) && (tableAddress == 0)) {

					//Check if the top left pixel is empty
					if ((next != '-') && (current == '-') && (x == 0)) {
						console.log("[console]:COND3:Original: ",x,dividedTable[tableAddress]);
						dividedTable[tableAddress][x] = '?';
						console.log("[console]:COND3:New:      ",x,dividedTable[tableAddress]);
						console.log("");
					}

					//Normal hole encoding for the first row
					if ((current == '-') && ((previous != '-') && (previous != null)) && ((next != '-') && (next != null)) && (x > 0)) {
						console.log("[console]:COND4:Original: ",x,dividedTable[tableAddress]);
						dividedTable[tableAddress][x] = '?';
						console.log("[console]:COND4:New:      ",x,dividedTable[tableAddress]);
						console.log("");
					}
				}
			}
		}
	}
	//--------------------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------ Find areas were line returns are needed
	//--------------------------------------------------------------------------------------------------------------------------------------------------------
	console.log("");
	console.log("-------------------[:]-------------------");

	for (var tableAddress = 1; tableAddress < dividedTable.length; tableAddress++) {
		//Gather the last char of the previous row, aswell as the first char of the current row
		var previousLineEnd = dividedTable[tableAddress - 1][ending];
		var currentLineStart = dividedTable[tableAddress][starting];
		console.log("[console]: Last line:",previousLineEnd," current line:",currentLineStart)
		//Check if the entire last row was filled with dashes
		var allDashes = 1;
		for (var i = starting; i <= ending && allDashes==1; i++) {

			//Previous line wasn't only dashes
			if (dividedTable[tableAddress - 1][i] != '-') {
				console.log("[console]: previous row was not all dashes");
				allDashes = 0;
			}
		}

		if( allDashes == 0)
		{
			console.log("[console]: Previous:",dividedTable[tableAddress - 1]);
			console.log("[console]: Current: ",tableAddress,dividedTable[tableAddress]);
			console.log("[console]: condition:",(currentLineStart != '-'),(previousLineEnd == '-'),(allDashes == 0))
		}

		//Check if the start of this row is now a dash and check if the end of the last row isnt a dash either.
		if ((currentLineStart != '-') && (previousLineEnd == '-') && (allDashes == 0)) {
			//Place a carriage return in that specific table spot
			console.log("[console]:COND1:Original:",dividedTable[tableAddress - 1]);
			dividedTable[tableAddress - 1][ending] = ':';
			console.log("[console]:COND1:New     :",dividedTable[tableAddress - 1]);
			console.log("");
		}
	}

	//--------------------------------------------------------------------------------------------------------------------------------------------------------
	//------------------------------------------------------------------------------ Convert into a string
	//--------------------------------------------------------------------------------------------------------------------------------------------------------

	console.log("");
	console.log("----------------[STRINGS]----------------");

	//Initialise variables for string convertion
	var text = "";
	var count = 0;
	var previous = dividedTable[0][starting];
	var current = dividedTable[0][starting];

	//Add Starting to the start of the string
	text = text + ToBase64(starting+1) + ToBase64(ending+1);

	//read the entire table, row by row, and count the amount of times we encounter the same characters back to back.
	for (var tableAddress = 0; tableAddress < dividedTable.length; tableAddress++) {
		//Go through the elemets of that row
		for (var i = starting; i <= ending; i++) {
			/////////////////////////////////////////////////////////////////////////// Increase the encounter
			count++;
			/////////////////////////////////////////////////////////////////////////// Read the current character
			current = dividedTable[tableAddress][i];
				console.log("[console]: current: ",current,i, "count:",count)
			/////////////////////////////////////////////////////////////////////////// Read the next character
			// If the next character is in the next table
			if ((i == ending ) && (tableAddress < dividedTable.length - 1)) {
				console.log("[console]: next:    ",next,starting, "count:",count)
				console.log("")
				next = dividedTable[tableAddress + 1][starting];
			}

			// If the next character is off the table (address would be outside of table maximum)
			if ((i == ending ) && (tableAddress == dividedTable.length - 1)) {
				console.log("[console]: null: ");
				next = null;
			}

			//Normal character conditions, the next character is not null
			if (i < ending ) {

				next = dividedTable[tableAddress][i + 1];
				console.log("[console]: next:    ",next,i+1, "count:",count)
				console.log("")
			}

        	/////////////////////////////////////////////////////////////////////////// Special character ":" / "?"
			if ((current == ':') || (current == '?')) {
				//Add current to Text
				text = text + current;
				console.log("[console]: (SPECIAL) ",current," added");
				//Reset counter
				count = 0;
			}
			/////////////////////////////////////////////////////////////////////////// Normal CHARACTERS
			else {
				//condition: current letter is different than the next one.
				//					 if current letter is equal to '-' and next one is null, then it won't execute
				//					 if current letter is equal to '-' and the next one is a ':' it won't execute neither
				//					 But, if the count is bigger than 72, it will enter this function no matter.
				if (((current != next) && !((current == '-') && (next == null)) && !(current == '-' && next == ':')) || (count>72)) {
					/////////////////////////////////////////////////////////////////////////// Next character is different, and isn't ? or :
					//Add colours then lenght in base64
					console.log("[console]: --- LETTER ADDED ---",current,ToBase64(count)," count was:",count);
					console.log("[console]: --- LETTER ADDED --- CONDS:",(current != next),!((current == '-') && (next == null)),!(current == '-' && next == ':'));
					text = text + current + ToBase64(count);
					//Reset the counter
					count = 0;
				}
			}
		}
	}

	return text;
}









/*
Width=0
Height=0
Table={}

--------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------ Split the table into sub tables containing width amount of colours
--------------------------------------------------------------------------------------------------------------------------------------------------------
--big for loop = Store small tables in larger table
DividedTable = {}
for Y=1,#Table/Height,1 do
	-- Intialise small table and reset it
	local SmallTable = {}

	for X=1,Width,1 do
		SmallTable[X] = Table[X + ((Y-1)*Height)]
	end

	--Put the small table in the larger one
	DividedTable[Y] = SmallTable
end

--------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------ Replace isolated "-" with "?" [J - J] = [J ? J]
--------------------------------------------------------------------------------------------------------------------------------------------------------
for TableAddress=1,#DividedTable,1 do

	--Gather currently analyzed table
	CurrentTable = DividedTable[TableAddress]

	--Here we start at 2, cuz there is no point checking the first variable
	-- as we need to compare the next and the previous one to this one
	for X=1,#CurrentTable,1 do

		--Gather previous, current and next values
		Previous = CurrentTable[X-1]
		Current  = CurrentTable[X]
		Next	 = CurrentTable[X+1]


		if TableAddress>1 and X<#CurrentTable then
			--Only replace the first dash if the one in the previous table is not a -
			if Next~='-' and Current=='-' and DividedTable[TableAddress-1][Width]~='-' and DividedTable[TableAddress-1][Width]~='?' and X==1 then
				DividedTable[TableAddress][X] = '?'
			end

			--Only replace with a "?" if Next and Previous are not nils and are not -
			if Current=='-' and (Previous~='-'and Previous~=nil) and (Next~='-'and Next~=nil) and X>1 then
				DividedTable[TableAddress][X] = '?'
			end

		elseif X<#CurrentTable and TableAddress==1 then
			--Check if the top left pixel if empty
			if Next~='-' and Current=='-' and X==1 then DividedTable[TableAddress][X] = '?' end

			print(X)

			if Current=='-' and (Previous~='-'and Previous~=nil) and (Next~='-'and Next~=nil) and X>1 then
				DividedTable[TableAddress][X] = '?'
				print("HERE",DividedTable)
			end


		end
	end

end
print(DividedTable)
--------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------ Find areas were line returns are needed
--------------------------------------------------------------------------------------------------------------------------------------------------------
for TableAddress=2,#DividedTable,1 do
	--Gather the previous line, and the first char of this line
	PreviousLineEnd = DividedTable[TableAddress-1][Width]
	CurrentLineStart= DividedTable[TableAddress][1]

	--Check if entire previous line is just "-"
	AllDashes = true
	for i=1,Width,1 do
		Checking = DividedTable[TableAddress-1][i]
		if Checking~='-' then AllDashes = false end
	end

	--Check if the start of this line is different from a "-" and the end of the last line was "-"
	if CurrentLineStart ~= "-" and PreviousLineEnd == "-" and AllDashes==false then
		DividedTable[TableAddress-1][Width] = ":"
		print(TableAddress-1,"[[[carriage return]]]]")
	end
end
print(DividedTable)
--------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------ Convert into a string
--------------------------------------------------------------------------------------------------------------------------------------------------------


-- ADD the width to the start of the string
Text    = ""
Text    = Text.. ToBase64(Width)


-- Initialisation of variables needed for next step
Count   = 0
Previous= DividedTable[1][1]
Current = DividedTable[1][1]

-- Read the entire table and count the amount of time we encounter stuff
for TableAddress=1,#DividedTable,1 do

	for i=1,Width,1 do
		------------------------------------------------------------------------------------------ INCREASE COUNT
		Count = Count + 1
		------------------------------------------------------------------------------------------ READ CURRENT CHARACTER
		Current = DividedTable[TableAddress][i]
		------------------------------------------------------------------------------------------ READ NEXT CHARACTER
		-- If the next character is in the other table
		if i==Width and TableAddress<#DividedTable then
			Next = DividedTable[TableAddress+1][1]
		end
		-- The next character is off bound
		if i==Width and TableAddress==#DividedTable then
			Next = nil
		end
		-- Normal next character conditions
		if i<Width then
			Next = DividedTable[TableAddress][i+1]
		end

		------------------------------------------------------------------------------------------ SPECIAL CHARACTER ":"
		if Current == ':' or Current == '?' then

			--Add to text
			Text = Text .. Current

			--Reset count
			Count = 0

		else
		------------------------------------------------------------------------------------------ NORMAL  CHARACTERS
			if Current ~= Next and not (Current=='-' and Next==nil) and not (Current=='-' and Next==':') then
				----------------------------------------------------------------------- Next character is different
				-- Add colour then count
				Text = Text .. Current .. ToBase64(Count)
				-- Reset Count
				Count = 0
			end
		end

	end
end
*/
