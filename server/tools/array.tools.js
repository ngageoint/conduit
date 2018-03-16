module.exports = {
    /**
     * Identifies the difference between two arrays, returning the unique values of the first given array
     * 
     * @param {array} a The array on which to identify unique values
     * @param {int} b The array to compare against
     * @return {array} The values in array a that were not found in array b
     */
    diff: function(a, b) {
        for(var i = 0; i < b.length; i++) {
            for(var j = 0; j < a.length; j++) {
                if(b[i].id === a[j].id) {
                    a = this.removeElement(a, j);
                    j--;
                }
            }
        }
        return a;
    },
    same: function(a, b) {
        return a.filter(function(i) {return b.indexOf(i) >= 0;});
    },
    /**
     * Removes duplicate values in an array, given a function identifying a key
     * 
     * @param {array} a The array on which the action will be performed
     * @param {function} key A function that returns the key (from each object) that will be used to check for duplication
     * @return {array} The array with duplicate elements removed
     */
    removeDuplicates: function(a, key) {
        var seen = {};
        return a.filter(function(item) {
            var k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        })
    },
    /**
     * This function removes an element at a specified index from the array, adusting all other elements accordingly.
     * 
     * @param {array} array The array on which the action will be performed
     * @param {int} index The index at which the element will be removed
     * @return {array} The array with the element at the specified index removed
     */
    removeElement: function(array, index) {
        if(index < array.length && index >= 0)
            array.splice(index, 1);
        return array;
    },
    /**
     * This function moves and element from one index to another, and adjusts all other elements accordingly.
     * 
     * @param {array} array The array on which the action will be performed
     * @param {int} crtIndex The index at which the element currently resides
     * @param {int} newIndex The index to which the element will be moved
     * @return {array} The array with the element moved
     */
    moveElement: function(array, crtIndex, newIndex) {
        if(crtIndex < array.length && newIndex < array.length && crtIndex >= 0 && newIndex >= 0)
            array.splice(newIndex, 0, array.splice(crtIndex, 1)[0]);
    },
    /**
     * This function moves an element at a specified index to the end of the array, and moves the last element
     * in the array to take its position
     * 
     * @param {array} array The array on which the action will be performed
     * @param {int} index The index at which the element currently resides
     * @return {array} The array with the specified element moved to the end
     */
    moveToEnd: function(array, index) {
        return this.swap(array, index, array.length - 1);	
    },
    /**
     * This function gets the index of an object in an array, assuming the object has an id property
     * 
     * @param {array} array An array of objects that have an id property
     * @param {string} id A string that will be compared to the id property in the array
     * @return {int} The first index (as an integer) with a property matching the idea
     */
    getIndex: function(array, id) {
        for(var i = 0; i < array.length; i++)
            if(~array[i].id.indexOf(id))
                return i;
    },
    /**
     * This function swaps the index of two elements in a given array.
     * 
     * @param {array} array The array on which the action will be performed
     * @param {int} a The index at which the first element resides
     * @param {int} b The index at which the second element resides
     * @return {array} The array with the specified elements swapped
     */
    swap: function(array, a, b){
        var temp = array[a];
        array[a] = array[b];
        array[b] = temp;
        
        return array;
    }
};