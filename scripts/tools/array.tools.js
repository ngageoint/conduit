angular.module('conduit.tools').factory('ArrayTools', function($q, $http, __config) { 
	return {
        removeElement: function(array, index) {
			if(index < array.length && index >= 0)
				array.splice(index, 1);
			return array;
		},
        moveElement: function(array, crtIndex, newIndex) {
			if(crtIndex < array.length && newIndex < array.length && crtIndex >= 0 && newIndex >= 0)
				array.splice(newIndex, 0, array.splice(crtIndex, 1)[0]);
		},
        moveToEnd: function(array, i) {
			return swap(array, i, array.length - 1);	
		},
        getIndex: function(array, id) {
			for(var i = 0; i < array.length; i++)
				if(~array[i].id.indexOf(id))
					return i;
		},
        swap: function(array, a, b){
			var temp = array[a];
			array[a] = array[b];
			array[b] = temp;
			
			return array;
		}
    };		
});