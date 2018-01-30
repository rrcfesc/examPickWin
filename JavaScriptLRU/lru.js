(function(g,f){
  const e = typeof exports == 'object' ? exports : typeof g == 'object' ? g : {};
  f(e);
  if (typeof define == 'function' && define.amd) { define('lru', e); }
})(this, function(exports) {
    /**
     * Defined Constant
     */
    const NEWER         = Symbol('newer');
    const OLDER         = Symbol('older');
    /**
     * Construct 
     * @param {integer} limit
     * @returns {nm$_lru.lruL#5.LRU}
     */
    function LRU(limit) {
        this.limit      = limit;
        this.size       = 0;
        this.oldest = this.newest = undefined;
        this._keymap = new Map();
    };
    exports.LRU          = LRU;
    /****/
    function Entry(key, value) {
        this.key = key;
        this.value = value;
        this[NEWER] = undefined;
        this[OLDER] = undefined;
    };
    /**
     * 
     * @param {type} entry
     * @returns {undefined}
     */
    LRU.prototype._markEntryAsUsed = function(entry) {
        if (entry === this.newest) {
          return;
        }
        if (entry[NEWER]) {
            if (entry === this.oldest) {
                this.oldest = entry[NEWER];
            }
            entry[NEWER][OLDER] = entry[OLDER]; 
        }
        if (entry[OLDER]) {
            entry[OLDER][NEWER] = entry[NEWER];
        }
        entry[NEWER] = undefined;
        entry[OLDER] = this.newest;
        if (this.newest) {
            this.newest[NEWER] = entry;
        }
        this.newest = entry;
    };
    /** Methos to test**/
    LRU.prototype.put    = function(key, value) {
        var entry           = this._keymap.get(key);
        if (entry) {
          // update existing
          entry.value       = value;
          this._markEntryAsUsed(entry);
          return this;
        }
        // new entry
        this._keymap.set(key, (entry = new Entry(key, value)));
        if (this.newest) {
            // link previous tail to the new tail (entry)
            this.newest[NEWER]  = entry;
            entry[OLDER]        = this.newest;
        } else {
            // we're first in -- yay
            this.oldest = entry;
        }
        // add new entry to the end of the linked list -- it's now the freshest entry.
        this.newest = entry;
        ++this.size;
        if (this.size > this.limit) {
            // we hit the limit -- remove the head
            this.shift();
        }
        return this;
    };
    /**
     * Get Method from cache
     * @param {integer} key
     * @returns {undefined|nm$_lru.lruL#5.LRU._keymap@call;get.value}
     */
    LRU.prototype.get = function(key) {
        var entry       = this._keymap.get(key);
        if (!entry) return;
        this._markEntryAsUsed(entry);
        return entry.value;
    };
    LRU.prototype.shift = function() {
        var entry = this.oldest;
        if (entry) {
            if (this.oldest[NEWER]) {
              // advance the list
              this.oldest = this.oldest[NEWER];
              this.oldest[OLDER] = undefined;
            } else {
              this.oldest = undefined;
              this.newest = undefined;
            }
            entry[NEWER] = entry[OLDER] = undefined;
            this._keymap.delete(entry.key);
            --this.size;
            return [entry.key, entry.value];
        }
    };
});