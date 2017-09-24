function AnagramSolver ( txt ) {
    "use strict";

    this.tree = new Tree ();
    var t = txt.split ( /[?\s,\.]/ );
    for ( var a in t ) {
	      this.tree.addKey ( t[a] );
    }

this.makeAnagrams = function ( s ) {

	var tree = this.tree;
	var p = new Array();
	var hp = {};
	var ap = new Array();
	ap[0] = new Array();
	var ss = s.split( "" );

	for ( var t = 0; t < ss.length; t++ ){
	    ap[0].push ( tree.lookup( ss[t] ) );
	}
	for ( var k = 1; k < ss.length; k++ ){
	    findPerms ( k );
	}

	return p = p.sort ( function (a, b) {
	    if ( a.score > b.score ) return -1;
	    if ( a.score < b.score ) return 1;
	    if ( a.score === b.score ) return 0;
	});

	function findPerms ( lev ) {
	    ap[lev] = new Array ( );
	    for ( var j = 0; j < ap[lev-1].length; j++ ) {
		for ( var i = 0; i < ss.length; i++ ) {
		    if ( (ss[i] + ap[lev-1][j].data).match ( new RegExp ( ss[i], "g" ) ).length <= s.match( new RegExp ( ss[i], "g" ) ).length ){
			var look = tree.lookup ( ss[i], ap[lev-1][j] );
			if ( look !== -1 ){
			    if ( look.childs > 0 ){
				ap[lev].push ( look );
			    }
			    if ( look.score !== null )
				if ( hp[look.data] === undefined ) {
				    hp[look.data] = 0;
				    p.push( look );
				}
			}
		    }
		}
	    }

	}


}

function Node ( sf ) {
	this.score = null;
	this.data = sf;
	this.childs = 0;
	this.children = {};
	this.setData = function ( numb ) {
	    this.score = numb;
	}
}

function Tree () {
	this.root = new Node ( null, null );
	var values = { "a":1,"b":4,"c":4,"d":2,"e":1,"f":4,"g":3,"h":3,"i":1,
		       "j":10,"k":5,"l":2,"m":4,"n":2,"o":1,"p":4,"q":10,"r":1,
		       "s":1,"t":1,"u":2,"v":5,"w":4,"x":8,"y":3,"z":10 };
	this.addKey = function ( s ) {
	    var node = this.root;
	    var ss = s.split ( "" );
	    var num = 0;
	    var st = "";
	    for ( var d = 0; d < ss.length; d++ ) {
		if ( ! /[&\^%4#!@\*\)\(\}\{\[\]\\\|/><-_=\~`+?]/.test(ss[d]) ) {
		    st += ss[d];
		    if ( node.children[ss[d]] === undefined ) {
			node.children[ss[d]] = new Node ( st );
			node.childs++;
		    }
		    node = node.children[ss[d]];
		    num += values[ss[d]];
		}
	    }
	    node.setData ( num );
	}
	this.lookup = function ( s, n ) {
	    var node = ( n === undefined || n === null ) ? this.root : n;
	    var ss = s.toLowerCase().split ( "" );
	    for ( var d = 0; d < ss.length; d++ ) {
		if ( node.children[ss[d]] === undefined ) {
		    return -1;
		}
		node = node.children[ss[d]];
	    }
	    return node;
	   }
   }
}

var letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

var anagram;
loading(true, 'Loading dictionary');
if (window.localStorage.dict) {
  init(window.localStorage.dict);
}

else {
  fetch('words.txt').then(function(response) {
    return response.text().then(function(text) {
      window.localStorage.dict = text;
      init(text);
    });
  });
}


function init(dict) {
  anagram = new AnagramSolver(dict);
  loading(false);
}

function combos(word){

  word = word.split("").sort().join("");

  var words = [];
  var words2 = [];

  letters.forEach(function(letter){
    words.push(word.replace(/\?/, letter));
  });

  words.forEach(function(item){

    if(item.indexOf('?')>-1){

      letters.forEach(function(letter){
        words2.push(item.replace(/\?/, letter));
      })
    }

    else {
      words2.push(item);
    }
  })

  return words2;

}

function loading(active, message){

    if(active){
      document.body.setAttribute('data-loading', true);
      document.querySelector('.loader').setAttribute('data-active', true);
      document.querySelector('.loader span').textContent = message
    }

    else {
      document.body.removeAttribute('data-loading');
      document.querySelector('.loader').removeAttribute('data-active');
      document.querySelector('.loader span').textContent = "";
    }
}


function getResults(){

  var hand = document.querySelector("input").value;

  var matches = [];

  if(hand.match(/\?/)){
    combos(hand).forEach(function(word){
      matches = matches.concat(anagram.makeAnagrams( word ));
    })
  }

  else {
    matches = anagram.makeAnagrams(hand);
  }


  matches.sort(function(a,b){
    return b.data.length - a.data.length || a.data.localeCompare(b.data)
  });

  var dups = [];

  var results = matches.filter(function(item){
    if (dups.indexOf(item) === -1) {
      dups.push(item);
      return true;
    }

    return false;
  })


  var html = results.length ? '' : '<p>No results</p>';
  var len = 0;

  results.forEach (function(item){
    if(len != item.data.length){
      html += '</div><div class="card"><h2 class="word-header" data-text="'+ item.data.length +'">'+ item.data.length +' Letters</h2>';
    }
    html += '<div class="word">' + (item.data) + '</div>';
    len = item.data.length;
  });

  document.querySelector('#results').innerHTML = "<div class='card'>" + html + "</div>";


}

document.querySelector('form').onsubmit = function(event){
  event.preventDefault();
  if(document.querySelector('input').value.length > 2 && document.querySelector('input').value.match(/^[a-z?]+$/ig)){
    loading(true, 'Fetching words');
    document.querySelector('#results').innerHTML = "";
    setTimeout(function(){

        getResults();

    }, 50)
  }
}

document.querySelector('input').onkeyup = function(event){

  if(!this.value.match(/^[a-z?]+$/ig)){
    this.value = this.value.replace(event.key, '')
  }

  if(this.value.match(/\?/g) && this.value.match(/\?/g).length === 3){
    var index = this.value.lastIndexOf('?');
    this.value = this.value.replace(/\?/g, function(item, ind){
      if(ind === index){
        return ''
      }

      return item;
    })
  }
}


document.addEventListener('animationstart', function(event){
  console.log('trigger');
  loading(false);
})
