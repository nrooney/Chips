(function() {

	/*
	 * global vars
	 */
	var ONEBLOCK = 32;

	/*
	 * Re-map player controls so chip goes over 1 square at a time
	 */
	Crafty.c("PlayerControls", {
		_keys: { 
			UP_ARROW: [0,-1],
			DOWN_ARROW: [0,1],
			RIGHT_ARROW: [1,0],
			LEFT_ARROW: [-1,0],
			W: [0,-1],
			S: [0,1],
			D: [1,0],
			A: [-1,0],
		}, 
		init: function() {
			this._moveX = 0;
			this._moveY = 0;

			for(var k in this._keys) {
				var keyCode = Crafty.keys[k] || k;
				this._keys[keyCode] = this._keys[k];
			}

			this.bind("KeyDown",function(e) {
			if(this._keys[e.key]) {
				this._moveX = this._keys[e.key][0];
				this._moveY = this._keys[e.key][1];

			}
			}).bind("EnterFrame",function() {
				if(this._moveX || this._moveY) {

					// Let's keep our pre-movement location
			        // Hey, Maybe we'll need it later :)
			        this._sourceX = this.x;
			        this._sourceY = this.y;

					this.x += this._moveX * 32;
					this.y += this._moveY * 32;
					this.trigger('Moved', {x: this.x, y: this.y});
					this._moveX = 0;
					this._moveY = 0;
					//jQuery("#testing").append(this.x + "/" + this.y + " | ");
				}
			});
		},
		cancelMove: function(){
			jQuery("#testing").append(this._sourceX + "/" + this._sourceY + " | ");
			this.x = this._sourceX;
      		this.y = this._sourceY;
      		this._moving = false;
		}
	});

	/*
	 * Make camera follow chip!
	 */
	Crafty.c("Camera",{
		init: function() {  },
			camera: function(obj) {
	 	 	this.set(obj);
	  		var that = this;
	  		obj.bind("Moved",function(location) { that.set(location); });
		},
		set: function(obj) {
	  		Crafty.viewport.x = -obj.x + Crafty.viewport.width / 2;
	  		Crafty.viewport.y = -obj.y + Crafty.viewport.height / 2;
		}
	});


	/*
	 * Load screen
	 */
	function load(){
		Crafty.load(["img/tiles.png", "img/window.png"], function() {
     		// Our assets are now pre-loaded
    	 	console.log("Images Loaded");
		});
	}
  
    // Create a player entity
	function makePlayer(x,y){	
		var player = Crafty.e("2D, Canvas, PlayerControls, chip, Player").attr({w:ONEBLOCK, h:ONEBLOCK, x: ONEBLOCK*x, y:ONEBLOCK*y, z:1}); 	
		player.addComponent("Collision").onHit("Block",function(obj) {
          	this.cancelMove();
          	//alert("hit");
        });
		return player;
	}
	
	// Create a player enemy
	function makeEnemy(x,y){		
		var enemy = Crafty.e("2D, Canvas, Color").color("blue").attr({w:ONEBLOCK, h:ONEBLOCK, x: ONEBLOCK*x, y:ONEBLOCK*y}); 	
		return enemy;
	}

	// Create tile which chip can go over
	function makeTile(x,y,sprite){

		var type = "Tile";

		if(sprite == "bb"){
			type = "Block"
		}
		else{
			type = "Tile";
		}

		var tile = Crafty.e("2D, Canvas," + sprite + ", " + type)
			.attr({h:ONEBLOCK, w:ONEBLOCK, x:ONEBLOCK*x, y:ONEBLOCK*y });
		return tile;
	}
  
  	main = function() {
  		console.log("INITIATED");
  	
		// Initialize Crafty
		Crafty.init(600, 600).canvas.init();
		Crafty.background("000"); 
		
		//load
  		load();
  		
  		// This will create entities called floor, wall1 and stairs
		Crafty.sprite(32,"img/tiles.png", {
			chip: [0,0],
			ti: [0,1], // tile
			bb: [2,1], // blocker block
			dirt: [1,2],
			gravel: [2,2],
			en: [5,1], // end
			gw: [4,1], // gateway
			kg : [3,5], // key green
			kb: [1,5], // key blue
			kr: [0,5], // key red
			ky: [2,5], // key yellow
			lg: [3,4], // lock green
			lb: [1,4], // lock blue
			lr: [0,4], // lock red
			ly: [2,4], // lock yellow
			mc: [3,1], // micro chip 
			mu: [0,2], // mud
		});
		

  		//get map
  		jQuery.getJSON('maps/map_001.json', function(data) {
			var xcoord_row = 0;
			var ycoord_column = 0;
			
			jQuery.each(data, function(key, val) {
				ycoord_column = key;
				jQuery.each(val, function(key, val) {
					//jQuery('#testing').append(val + ":");
					// we will need to push these onto an array to access later
					xcoord_row = key;
					makeTile(xcoord_row,ycoord_column,val);
				});
			});
		});

		//make red box player
		var player = makePlayer(7,6);
		//var camera = Crafty.e("Camera").camera(player); PUT CAMERA BACK IN WHEN READY!

		// /* Collision Code */
		// player.onHit("Block",function(hit) {
  //   		//alert("hit!");
  //   		//this._falling = false;
  //   		//jQuery("#testing").append("hit_x: " + this._x + "/" + hit[0].normal.y + "/" + hit[0].overlap +
  //   		//							"hit_y: " + this._y + "/" + hit[0].normal.x + "/" + hit[0].overlap);
  //   		console.log(hit[0])
  //   		this.attr({x: this._x + hit[0].normal.y * hit[0].overlap * 1, y: this._y + hit[0].normal.x * hit[0].overlap * 1});
  // 		});
  		
  	};
  	
 	
  	window.onload = main;
}).call(this);



