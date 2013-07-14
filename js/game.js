(function() {

	//load screen
	function load(){
		Crafty.load(["img/tiles.png", "img/window.png"], function() {
     		// Our assets are now pre-loaded
    	 	console.log("Images Loaded");
		});
	}
  
    // Create a player entity
	function makePlayer(){	
		var player = Crafty.e("2D, Canvas, chip").attr({w:50, h:50}); 		
		return player;
	}
	
	// Create a player enemy
	function makeEnemy(){		
		var enemy = Crafty.e("2D, Canvas, Color").color("blue").attr({w:50, h:50, x: 50, y:50}); 
		
		// Add some components to the entity
		//enemy.addComponent("2D, Canvas, Color"); 		
		return enemy;
	}
	
	// Create wall
	function makeWall(){
		var wall = Crafty.e("2D, Canvas, Collision, wall1")
			.attr({h:50, w:500, x:0, y:400 })
			.collision();
	
		return wall;
	}
  
  	main = function() {
  		console.log("INITIATED");
  	
		// Initialize Crafty
		Crafty.init(640, 480).canvas.init();
		Crafty.background("black"); 
		
		//load
  		load();
  		
  		// This will create entities called floor, wall1 and stairs
		Crafty.sprite(32,"img/tiles.png", {
			chip: [0,12.5],
			wall1: [0,1],
			stairs: [3,1]
		});
		
		//make red box player
		var player = makePlayer();
		
		//make blue box
		var enemy = makeEnemy();
		
		//make wall
		var wall = makeWall();
  		
  		/* Collision Code */ //JQUERY CODE! MUST DL JQUERY
	  	player.addComponent("Collision").bind('Moved', function(from) {
	    	if(this.hit('2D')) {
	       		this.attr({x: from.x, y:from.y});
	    	}
	  	});
	  	
	  	enemy.addComponent("Collision").bind('Moved', function(from) {
	    	if(this.hit('2D')) {
	       		this.attr({x: from.x, y:from.y});
	    	}
	 	});
	 	
		// Can use the arrow keys as well,
  		// but we don't want to accidentally change slides
  		player.addComponent("Fourway").fourway(10);
  	};
  	
 	
  	window.onload = main;
}).call(this);