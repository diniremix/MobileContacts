/*
Main JS for tutorial: "Getting Started with HTML5 Local Databases"
Written by Ben Lister (darkcrimson.com) revised 12 May 2010
Tutorial: http://blog.darkcrimson.com/2010/05/local-databases/

Licensed under the MIT License:
http://www.opensource.org/licenses/mit-license.php
*/

$(function(){ 
	//initDatabase();	
 	// Button and link actions
	$('#close_app').click(function(){ outro();/*dropTables();*/ });
 	$('#login_app').click(function(){ intro();/*updateSetting();*/ });
});

function intro() {
       alert('MobileContacts Version 0.1');
	   location.reload();
	   $('#logs').html('<h3 id="logins">Error, favor revise los campos</h3>').delay(2000).hide("fade");	   
}
function outro() {
       alert('Saliendo...');	   
	   location.reload();
}		
function initDatabase() {
	try {
	    if (!window.openDatabase) {	        
			alert('MobileContacts usa Bases de Datos Locales que no estan soportadas por este navegador, favor use un navegador que utilice Webkit');
	    } else {
	        var shortName = 'MobileContacts_db.sqlite';
	        var version = '1.0';
	        var displayName = 'MobileContacts database';
	        var maxSize = 100000; // in bytes
	        DEMODB = openDatabase(shortName, version, displayName, maxSize);
			createTables();
			selectAll();
	    }
	} catch(e) {
		console.log("usando MobileContacts_db "+ e +".");
	    if (e == 2) {
	        // Version mismatch.
	        console.log("Invalid database version.");
	    } else {
	        console.log("Unknown error "+ e +".");
	    }
	    return;
	} 
}



/***
**** CREATE TABLE ** 
***/
function createTables(){
	DEMODB.transaction(
        function (transaction) {
        	transaction.executeSql('CREATE TABLE IF NOT EXISTS page_settings(id INTEGER NOT NULL PRIMARY KEY, fname TEXT NOT NULL,bgcolor TEXT NOT NULL, font TEXT, favcar TEXT);', [], nullDataHandler, errorHandler);
        }
    );
	prePopulate();
}


/***
**** INSERT INTO TABLE ** 
***/
function prePopulate(){
	DEMODB.transaction(
	    function (transaction) {
		//Starter data when page is initialized
		var data = ['1','none','#B3B4EF','Helvetica','Porsche 911 GT3'];  
		
		transaction.executeSql("INSERT INTO page_settings(id, fname, bgcolor, font, favcar) VALUES (?, ?, ?, ?, ?)", [data[0], data[1], data[2], data[3], data[4]]);
	    }
	);	
}

/***
**** UPDATE TABLE ** 
***/
function updateSetting(){
	DEMODB.transaction(
	    function (transaction) {
	    	if($('#username').val() != '') {
	    		var user = $('#username').val();
	    	} else {
	    		var user = 'demo';
	    	}
			if($('#pass').val() != '') {
	    		var pass_ = $('#pass').val();
	    	} else {
	    		var pass_ = 'demo';
	    	}
			/*var bg    = $('#bg_color').val();
			var font  = $('#font_selection').val();
			var car   = $('#fav_car').val();*/
			
	    	
	    	/*transaction.executeSql("UPDATE page_settings SET fname=?, bgcolor=?, font=?, favcar=? WHERE id = 1", [fname, bg, font, car]);*/
			transaction.executeSql("INSERT INTO page_settings(fname, bgcolor, font, favcar) VALUES (?, ?, ?, ?)", [fname, bg, font, car] /*[data[0], data[1], data[2], data[3], data[4]]*/);
	    }
	);	
		selectAll();
}
function selectAll(){ 
	DEMODB.transaction(
	    function (transaction) {
	        transaction.executeSql("SELECT * FROM page_settings;", [], dataSelectHandler, errorHandler);
	        
	    }
	);	
}

function dataSelectHandler(transaction, results){

	// Handle the results
    for (var i=0; i<results.rows.length; i++) {
        
    	var row = results.rows.item(i);
    	
        var newFeature = new Object();
    	
    	newFeature.fname   = row['fname'];
        newFeature.bgcolor = row['bgcolor'];
        newFeature.font    = row['font'];
        newFeature.favcar  = row['favcar'];
        
        $('body').css('background-color',newFeature.bgcolor);
        $('body').css('font-family',newFeature.font);
        $('#content').html('<h4 id="your_car">Your Favorite Car is a '+ newFeature.favcar +'</h4>');
        
        if(newFeature.fname != 'none') {
       		$('#greeting').html('Howdy-ho, '+ newFeature.fname+'!');
       		$('#fname').val(newFeature.fname);
        } 
        
       $('select#font_selection').find('option[value='+newFeature.font+']').attr('selected','selected');
       $('select#bg_color').find('option[value='+newFeature.bgcolor+']').attr('selected','selected');  
       $('select#fav_car').find('option[value='+newFeature.favcar+']').attr('selected','selected');

       
    }

}





/***
**** Save 'default' data into DB table **
***/

function saveAll(){
		prePopulate(1);
}


function errorHandler(transaction, error){
 	if (error.code==1){
 		// DB Table already exists
		console.log('Oops.  la db existe Error was '+error.message+' (Code '+error.code+')');
 	} else {
    	// Error is a human-readable string.
	    console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
 	}
    return false;
}


function nullDataHandler(){
	console.log("SQL Query Succeeded");
}

/***
**** SELECT DATA **
***/
function selectAll(){ 
	DEMODB.transaction(
	    function (transaction) {
	        transaction.executeSql("SELECT * FROM page_settings;", [], dataSelectHandler, errorHandler);
	    }
	);	
}

/***
**** DELETE DB TABLE ** 
***/
function dropTables(){
	DEMODB.transaction(
	    function (transaction) {
	    	transaction.executeSql("DROP TABLE page_settings;", [], nullDataHandler, errorHandler);
	    }
	);
	console.log("Table 'page_settings' has been dropped.");
	location.reload();
}

	