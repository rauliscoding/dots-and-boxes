//Declaração de variáveis --------------------------------------------------------------//

var       matrix = [], user_status = [], //tabuleiro de jogo; ["id" , "score" , "time"];
	high_B_score = [], high_I_score = [], high_A_score = [], high_E_score = [];

var table, score_table, score_u = 0, score_pc = 0, turn = 0, rows, cols, c = 0, t, timer_is_on = 0, isOver = 0, mode = "offline";

//--------------------------------------------------------------------------------------//

function set_arrays(array) {
	
	for(var a=0; a<6; a++) 
	{
    	array[a] = [];
   		for(var b=0; b<3; b++) 
		{
			array[a][b] = 0;
        }
    } 
	
}

function check_login() {
	
	var user = document.getElementById("username").value;
	var pw = document.getElementById("password");
	var regex = new RegExp("^([a-zA-Z]{4,})$");
	
	if(!regex.test(user))
	{
		document.getElementById("error").innerHTML = ("username must be at least 4 letters long");
	}
	else if(pw.value.length < 8)
	{
		document.getElementById("error").innerHTML = ("password must be at least 8 characters long");
	}
	else 
	{
		user_status[0] = user;
		document.getElementById("login").style.display = "none";	
		document.getElementById("menu_2").style.display = "block";
		document.getElementById("game_mode").style.display = "block";
		document.getElementById("difficulty").style.display = "block";
	}

}

function off_noLogin() {	
	user_status[0] = "noname";
	document.getElementById("login").style.display = "none";	
	document.getElementById("menu_2").style.display = "block";
	document.getElementById("game_mode").style.display = "none";
	document.getElementById("difficulty").style.display = "block";
}

function create_table(row, col) {
    'use strict';    
	
	if(mode === "online")
	{
		// URL/join   SERVIDOR
		alert("calling join function");
	}
	
	document.getElementById("menu_2").style.display = "none";
	document.getElementById("difficulty").style.display = "none";
	document.getElementById("game_mode").style.display = "none";
	document.getElementById("title").style.fontSize = "35px";
	document.getElementById("title").style.marginTop = "18px";
	
	rows = row;
	cols = col;
	
    var myTableDiv = document.getElementById("menu"),
        tableBody  = document.createElement("tbody");
	
	table = document.createElement("table");

    for(var a=0; a<row; a++) 
	{
    	matrix[a] = [];
   		for(var b=0; b<col; b++) 
		{
			matrix[a][b] = undefined;
        }
    } 
    
    for (var i = 0; i < row; i++) 
	{
        var tr = document.createElement("tr");

        for (var j = 0; j < col; j++) 
		{
            var td = document.createElement("td");
            
            if(j%2 === 0 && i%2 === 0) 
			{
				matrix[i][j] = "dot";
                td.className = "dot";
            }
            else if(j%2 === 0 && i%2 !== 0) 
			{
                matrix[i][j] = "0";                
				td.className = "traceV";
                td.addEventListener("click" , game_flow);
            }
            else if(j%2 !== 0 && i%2 === 0) 
			{
				matrix[i][j] = "0";
                td.className = "traceH";
                td.addEventListener("click" , game_flow);
            }
            else 
			{
				matrix[i][j] = "empty"
                td.className = "hole";
            }
            
            td.appendChild(document.createTextNode(""));
            tr.appendChild(td);
            
        }
        tableBody.appendChild(tr);
        
    }
    table.appendChild(tableBody);
    myTableDiv.appendChild(table);
	document.getElementById('menu_3').style.display = "block";
	startCount();
	
    
}

function game_flow() {
	
	if(turn == 0 && matrix[this.parentNode.rowIndex][this.cellIndex] == "0") 
	{	
		this.style.backgroundColor = "red"; 
		matrix[this.parentNode.rowIndex][this.cellIndex] = "1";
		check_square();		
	}	
	
	if(turn == 1 && mode === "offline") 
	{
		pc_move();
		check_square();		
	}

}

function pc_move() {
	
	for(var a=0; a<rows; a++)
	
        for(var b=0; b<cols; b++) 	
		
           	if(matrix[a][b] == "0") 
			{
				matrix[a][b] = "1";
        		table.rows[a].cells[b].style.backgroundColor = "blue";		
				return;
			}
			
}

function check_square() {
	
	var flag = 0;
	for(var a=0; a<rows; a++) 
	{
        for(var b=0; b<cols; b++) 
		{
           	if(matrix[a][b] == "empty") 
			{
				if(matrix[a+1][b] == "1" && matrix[a][b+1] == "1" && matrix[a-1][b] == "1" && matrix[a][b-1] == "1")
				{
					matrix[a][b] = "full";
					if(turn == 0)
					{
						table.rows[a].cells[b].style.transition = '1s';
						table.rows[a].cells[b].style.backgroundColor = "red";	
						score_u++;
						document.getElementById("score_u").innerHTML=("Your Score: " + score_u);
						
					}
					else 
					{
						table.rows[a].cells[b].style.transition = '1s';
						table.rows[a].cells[b].style.backgroundColor = "blue";
						score_pc++;
						document.getElementById("score_pc").innerHTML=("AI Score: " + score_pc);
						
					}
					
					flag = 1;
					
				}
	
			}
			
		}
		
	}
	if(flag == 0)
	{
		if(turn == 1)
		{
			turn = 0;
			startCount();
			return;
		}
		else
		{
			turn = 1;
			stopCount();
			return;
		}
		
	}	
	
	if(flag == 1 && turn == 1)
	{
		stopCount();
		game_flow();
	}
	
	high_scoreFunc();
	
}

function reset() {
	turn = 0;
	score_u = 0;
	score_pc = 0;
	c = 0;
	isOver = 0;
	stopCount();
	
	document.getElementById("game_over").style.display = "none";
	document.getElementById("score_pc").innerHTML=("AI Score: " + score_pc);
	document.getElementById("score_u").innerHTML=("Your Score: " + score_u);
	document.getElementById("time_u").innerHTML = (c);
	
	var tables= document.getElementsByTagName('table');
	while (tables.length>0)
    	tables[0].parentNode.removeChild(tables[0]);	
	
}
function restartFunc() {
	reset();
	create_table(rows, cols);

}	

function menuFunc() {
	reset();
	document.getElementById("menu_3").style.display = "none";
	document.getElementById("title").style.fontSize = "70px";
	document.getElementById("title").style.marginTop = "40px";		
	document.getElementById("menu_2").style.display = "block";
	document.getElementById("difficulty").style.display = "block";
	
	if(user_status[0] === "noname")
	{
		document.getElementById("game_mode").style.display = "none";
	}
	else
	{
		document.getElementById("game_mode").style.display = "block";
	}
}

function high_scoreFunc() {
	
	var total_squares = ( (rows-1)/2 ) * ( (cols-1)/2 );
	
	if( ((score_pc + score_u) == total_squares) && isOver == 0 )
	{
		isOver = 1;
		stopCount();
		var tables= document.getElementsByTagName('table');
		while (tables.length>0)
    		tables[0].parentNode.removeChild(tables[0]);
		
		document.getElementById("game_over").style.display = "block";
		
		if( (score_u == total_squares / 2) && (score_pc == total_squares / 2) )
		{
			//It's a Draw;	
			document.getElementById("game_over").innerHTML = ("It's a Draw");
		}
		else if(score_u > total_squares / 2)
		{
			//You Won;
			document.getElementById("game_over").innerHTML = ("You Won");
		}
		else
		{
			//You Lost;
			document.getElementById("game_over").innerHTML = ("You Lost");
		}
		
		user_status[1] = score_u;
		user_status[2] = c;	
		
		if(rows == 5)
		{
			high_B_score[5][0] = user_status[0];
			high_B_score[5][1] = user_status[1];
			high_B_score[5][2] = user_status[2];
			high_B_score.sort(comparator);
			
		}
		else if(rows == 9)
		{
			high_I_score[5][0] = user_status[0];
			high_I_score[5][1] = user_status[1];
			high_I_score[5][2] = user_status[2];
			high_I_score.sort(comparator);
		}
		else if(rows == 13)
		{
			high_A_score[5][0] = user_status[0];
			high_A_score[5][1] = user_status[1];
			high_A_score[5][2] = user_status[2];
			high_A_score.sort(comparator);
		}
		else
		{
			high_E_score[5][0] = user_status[0];
			high_E_score[5][1] = user_status[1];
			high_E_score[5][2] = user_status[2];
			high_E_score.sort(comparator);
		}
			
	}
}

function comparator(a,b) {
	if(a[1] < b[1]) 
	{
		return 1;
	}
	else if(a[1] > b[1])
	{
		return -1;
	}
	else
	{
		return comparator2(a,b);
	}
	
}

function comparator2(a,b) {
	if(a[2] < b[2]) 
	{
		return -1;
	}
	else if(a[2] > b[2])
	{
		return 1;
	}
	else
	{
		return 0;
	}
	
}

function high_scoreFuncDisplay() {
	reset();
	document.getElementById("menu_3").style.display = "none";
	document.getElementById("menu_4").style.display = "block";
	
	var myTableDiv = document.getElementById("menu"),
        tableBody  = document.createElement("tbody");
	
	score_table = document.createElement("table");
    
    for (var i = 0; i < 6; i++) 
	{
        var tr = document.createElement("tr");

        for (var j = 0; j < 3; j++) 
		{
            var td = document.createElement("td");
            
			if(j == 0)
			{
            	td.className = "name";	
			}
			else if(j == 1)
			{
            	td.className = "score"; 
			}
			else
			{
            	td.className = "time";  
			}
           	td.appendChild(document.createTextNode(""));
            tr.appendChild(td);
            
        }
        tableBody.appendChild(tr);
        
    }
    score_table.appendChild(tableBody);
    myTableDiv.appendChild(score_table);
	
	score_table.rows[0].cells[0].innerHTML = "Username";
  	score_table.rows[0].cells[1].innerHTML = "Score";
  	score_table.rows[0].cells[2].innerHTML = "Time (s)";
	
}

function show(array) {
	
	if(mode === "offline")
	{
		for (var i = 1; i < 6; i++) 
		{
			score_table.rows[i].cells[0].innerHTML = "";
			score_table.rows[i].cells[1].innerHTML = "";
			score_table.rows[i].cells[2].innerHTML = "";
		}
		for (var i = 1; i < 6; i++)
		{
			if(array[i-1][0] != 0) 
			{
				score_table.rows[i].cells[0].innerHTML = array[i-1][0];
				score_table.rows[i].cells[1].innerHTML = array[i-1][1];
				score_table.rows[i].cells[2].innerHTML = array[i-1][2];
			}
	
		}
	}
	else
	{
		// URL/ranking  SERVIDOR
	}
	
}

function back2game() {
	reset();
	document.getElementById("menu_4").style.display = "none"; 
	create_table(rows, cols);
}

function logoutFunc() {
	reset();
	document.getElementById("menu_3").style.display = "none";
	document.getElementById("title").style.fontSize = "70px";
	document.getElementById("title").style.marginTop = "40px";
	document.getElementById("login").style.display = "block";
	mode = "offline";		
	document.getElementById("myonoffswitch").checked = true;
}

function timedCount() {
	document.getElementById("time_u").innerHTML = (c);
    c = c + 1;
    t = setTimeout(function(){ timedCount() }, 1000);
}

function startCount() {
    if (!timer_is_on) {
        timer_is_on = 1;
        timedCount();
    }
}

function stopCount() {
    clearTimeout(t);
    timer_is_on = 0;
}

onload = function() {
	document.getElementById("time_u").innerHTML= ("0");
	document.getElementById("score_u").innerHTML= ("Your Score: " + score_u);
	document.getElementById("score_pc").innerHTML=("AI Score: " + score_pc);
	document.getElementById("restart").addEventListener("click" , restartFunc);
	document.getElementById("back2menu").addEventListener("click" , menuFunc);
	document.getElementById("high_score").addEventListener("click" , high_scoreFuncDisplay);
	document.getElementById("logout").addEventListener("click" , logoutFunc);
	document.getElementById("b2menu3").addEventListener("click", back2game);
	document.getElementById("myonoffswitch").addEventListener("click", function() {mode = mode === "offline" ? "online" : "offline";}	 );
	
	document.getElementById("beg").addEventListener("click", function(){show(high_B_score)});													
	document.getElementById("int").addEventListener("click", function(){show(high_I_score)});													
	document.getElementById("adv").addEventListener("click", function(){show(high_A_score)});													
	document.getElementById("exp").addEventListener("click", function(){show(high_E_score)});	
	
	document.getElementById("login").style.display = "block";
	document.getElementById("menu_2").style.display = "none";
	document.getElementById("game_mode").style.display = "none";
	document.getElementById("difficulty").style.display = "none";
	set_arrays(high_B_score);
	set_arrays(high_I_score);
	set_arrays(high_A_score);
	set_arrays(high_E_score);
};












