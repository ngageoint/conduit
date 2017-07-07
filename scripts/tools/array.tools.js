angular.module('conduit.tools').factory('ArrayTools', function($q, $http, __config) { 
	return {
        /**
		 * This function removes and element at a specified index from the array, adusting all other elements accordingly.
		 * 
		 * @param array The array on which the action will be performed
		 * @param index The index at which the element will be removed
		 * @return The array with the element at the specified index removed
		 */
		removeElement: function(array, index) {
			if(index < array.length && index >= 0)
				array.splice(index, 1);
			return array;
		},
		/**
		 * This function moves and element from one index to another, and adjusts all other elements accordingly.
		 * 
		 * @param array The array on which the action will be performed
		 * @param crtIndex The index at which the element currently resides
		 * @param newIndex The index to which the element will be moved
		 * @return The array with the element moved
		 */
        moveElement: function(array, crtIndex, newIndex) {
			if(crtIndex < array.length && newIndex < array.length && crtIndex >= 0 && newIndex >= 0)
				array.splice(newIndex, 0, array.splice(crtIndex, 1)[0]);
		},
		/**
		 * This function moves an element at a specified index to the end of the array, and moves the last element
		 * in the array to take its position
		 * 
		 * @param array The array on which the action will be performed
		 * @param index The index at which the element currently resides
		 * @return The array with the specified element moved to the end
		 */
        moveToEnd: function(array, index) {
			return swap(array, index, array.length - 1);	
		},
		/**
		 * This function gets the index of an object in an array, assuming the object has an id property
		 * 
		 * @param array An array of objects that have an id property
		 * @param id A string that will be compared to the id property in the array
		 * @return The first index (as an integer) with a property matching the idea
		 */
        getIndex: function(array, id) {
			for(var i = 0; i < array.length; i++)
				if(~array[i].id.indexOf(id))
					return i;
		},
		/**
		 * This function swaps the index of two elements in a given array.
		 * 
		 * @param array The array on which the action will be performed
		 * @param a The index at which the first element resides
		 * @param b The index at which the second element resides
		 * @return The array with the specified elements swapped
		 */
        swap: function(array, a, b){
			var temp = array[a];
			array[a] = array[b];
			array[b] = temp;
			
			return array;
		}
    };		
});