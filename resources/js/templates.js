(function() {
var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['button-bar'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	<li><a ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.url), {hash:{},inverse:self.noop,fn:self.programWithDepth(2, program2, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " class=\"oh-google-map-control-button small\">";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.icon), {hash:{},inverse:self.noop,fn:self.programWithDepth(4, program4, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.name), {hash:{},inverse:self.noop,fn:self.programWithDepth(6, program6, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a></li>\n";
  return buffer;
  }
function program2(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "href=\""
    + escapeExpression(((stack1 = (depth1 && depth1.url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"";
  return buffer;
  }

function program4(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "<span data-icon=\""
    + escapeExpression(((stack1 = (depth1 && depth1.icon)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"></span>";
  return buffer;
  }

function program6(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += " "
    + escapeExpression(((stack1 = (depth1 && depth1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  return buffer;
  }

  buffer += "<ul>\n";
  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.buttons) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.buttons); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.buttons) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>";
  return buffer;
  });

templates['delete-marker-form'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h2>Delete Marker?</h2>\n\n<p>Are you sure you want to delete this marker?</p>\n\n<footer>\n	<button type=\"submit\" class=\"btn submit\">Delete Marker</button>\n	<a href=\"#\" class=\"cancel\">Cancel</a>\n</footer>";
  });

templates['delete-polygon-form'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h2>Delete Polygon?</h2>\n\n<p>Are you sure you want to delete this polygon?</p>\n\n<footer>\n	<button type=\"submit\" class=\"btn submit\">Delete Polygon</button>\n	<a href=\"#\" class=\"cancel\">Cancel</a>\n</footer>";
  });

templates['delete-polyline-form'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h2>Delete Polyline?</h2>\n\n<p>Are you sure you want to delete this polyline?</p>\n\n<footer>\n	<button type=\"submit\" class=\"btn submit\">Delete Polyline</button>\n	<a href=\"#\" class=\"cancel\">Cancel</a>\n</footer>";
  });

templates['delete-route-form'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h2>Delete Route?</h2>\n\n<p>Are you sure you want to delete this route?</p>\n\n<footer>\n	<button type=\"submit\" class=\"btn submit\">Delete Route</button>\n	<a href=\"#\" class=\"cancel\">Cancel</a>\n</footer>";
  });

templates['edit-marker-form'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h2>Edit Marker</h2>\n\n<h3><label for=\"title\">Title</label></h3>\n<input type=\"text\" name=\"title\" value=\"";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" id=\"content\" class=\"text fullwidth\" />\n\n<h3><label for=\"content\">Content</label></h3>\n<textarea name=\"content\" id=\"content\" class=\"text fullwidth\">";
  if (helper = helpers.content) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.content); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n\n<footer>\n	<button type=\"submit\" class=\"btn submit\">Save Changes</button>\n	<a href=\"#\" class=\"cancel\">Cancel</a>\n</footer>";
  return buffer;
  });

templates['geocoder'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n<h3>Locations Found</h3>\n\n<ul class=\"oh-google-map-highlight-list\">\n";
  stack1 = helpers.each.call(depth0, (depth1 && depth1.locations), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	<li><a href=\"#\">"
    + escapeExpression(((stack1 = (depth0 && depth0.formatted_address)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></li>\n";
  return buffer;
  }

  buffer += "<h2>Find a Location</h2>\n\n<input type=\"text\" name=\"location\" value=\"";
  if (helper = helpers.location) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"Enter an address, postal code, or city\" class=\"text fullwidth\" />\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.locations), {hash:{},inverse:self.noop,fn:self.programWithDepth(1, program1, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<footer>\n	<button type=\"submit\" class=\"btn submit\">Search</button>\n	<a href=\"#\" class=\"cancel\">Cancel</a>\n</footer>";
  return buffer;
  });

templates['map-list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, self=this, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\n<p>There are no markers on the map.</p>\n";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n	<li>";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.deleted), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "<a href=\"#\" class=\"marker-center\">"
    + escapeExpression(((stack1 = (depth0 && depth0.address)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.deleted), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.deleted), options) : helperMissing.call(depth0, "not", (depth0 && depth0.deleted), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</li>\n";
  return buffer;
  }
function program4(depth0,data) {
  
  
  return "<span class=\"oh-google-map-strike-out\">";
  }

function program6(depth0,data) {
  
  
  return "</span> <a href=\"#\" class=\"marker-undo oh-google-map-small-text\">Undo Delete</a>";
  }

function program8(depth0,data) {
  
  
  return "<span class=\"actions\"><a href=\"#\" class=\"edit\" data-property=\"markers\"><span data-icon=\"edit\"></span></a> <a href=\"#\" class=\"delete\" data-property=\"markers\"><span data-icon=\"trash\"></span></a></span>";
  }

function program10(depth0,data) {
  
  
  return "\n<p>There are no routes on the map.</p>\n";
  }

function program12(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n	<li>";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.deleted), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "<a href=\"#\" class=\"route-center\">";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.title), {hash:{},inverse:self.noop,fn:self.programWithDepth(13, program13, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.programWithDepth(15, program15, data, depth0),data:data},helper ? helper.call(depth0, (depth0 && depth0.title), options) : helperMissing.call(depth0, "not", (depth0 && depth0.title), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.deleted), {hash:{},inverse:self.noop,fn:self.program(17, program17, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(19, program19, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.deleted), options) : helperMissing.call(depth0, "not", (depth0 && depth0.deleted), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</li>\n";
  return buffer;
  }
function program13(depth0,data,depth1) {
  
  var stack1;
  return escapeExpression(((stack1 = (depth1 && depth1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program15(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "Route "
    + escapeExpression(((stack1 = (depth1 && depth1.count)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  return buffer;
  }

function program17(depth0,data) {
  
  
  return "</span> <a href=\"#\" class=\"route-undo oh-google-map-small-text\">Undo Delete</a>";
  }

function program19(depth0,data) {
  
  
  return "<span class=\"actions\"><a href=\"#\" class=\"edit\" data-property=\"routes\"><span data-icon=\"edit\"></span></a> <a href=\"#\" class=\"delete\" data-property=\"routes\"><span data-icon=\"trash\"></span></a></span>";
  }

function program21(depth0,data) {
  
  
  return "\n<p>There are no polygons on the map.</p>\n";
  }

function program23(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n	<li>";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.deleted), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "<a href=\"#\" class=\"polygon-center\">";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.title), {hash:{},inverse:self.noop,fn:self.programWithDepth(13, program13, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.programWithDepth(24, program24, data, depth0),data:data},helper ? helper.call(depth0, (depth0 && depth0.title), options) : helperMissing.call(depth0, "not", (depth0 && depth0.title), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.deleted), {hash:{},inverse:self.noop,fn:self.program(26, program26, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(28, program28, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.deleted), options) : helperMissing.call(depth0, "not", (depth0 && depth0.deleted), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</li>\n";
  return buffer;
  }
function program24(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "Polygon "
    + escapeExpression(((stack1 = (depth1 && depth1.count)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  return buffer;
  }

function program26(depth0,data) {
  
  
  return "</span> <a href=\"#\" class=\"polygon-undo oh-google-map-small-text\">Undo Delete</a>";
  }

function program28(depth0,data) {
  
  
  return "<span class=\"actions\"><a href=\"#\" class=\"edit\" data-property=\"polygons\"><span data-icon=\"edit\"></span></a> <a href=\"#\" class=\"delete\" data-property=\"polygons\"><span data-icon=\"trash\"></span></a></span>";
  }

function program30(depth0,data) {
  
  
  return "\n<p>There are no polylines on the map.</p>\n";
  }

function program32(depth0,data) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n	<li>";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.deleted), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "<a href=\"#\" class=\"polyline-center\">";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.title), {hash:{},inverse:self.noop,fn:self.programWithDepth(13, program13, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.programWithDepth(33, program33, data, depth0),data:data},helper ? helper.call(depth0, (depth0 && depth0.title), options) : helperMissing.call(depth0, "not", (depth0 && depth0.title), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.deleted), {hash:{},inverse:self.noop,fn:self.program(35, program35, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(37, program37, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.deleted), options) : helperMissing.call(depth0, "not", (depth0 && depth0.deleted), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</li>\n";
  return buffer;
  }
function program33(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "Polyline "
    + escapeExpression(((stack1 = (depth1 && depth1.count)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  return buffer;
  }

function program35(depth0,data) {
  
  
  return "</span> <a href=\"#\" class=\"polyline-undo oh-google-map-small-text\">Undo Delete</a>";
  }

function program37(depth0,data) {
  
  
  return "<span class=\"actions\"><a href=\"#\" class=\"edit\" data-property=\"polylines\"><span data-icon=\"edit\"></span></a> <a href=\"#\" class=\"delete\" data-property=\"polylines\"><span data-icon=\"trash\"></span></a></span>";
  }

  buffer += "<h2>Markers</h2>\n\n<a href=\"#\" class=\"cancel oh-google-map-close\">&times; close</a>\n\n";
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.markers)),stack1 == null || stack1 === false ? stack1 : stack1.length), options) : helperMissing.call(depth0, "not", ((stack1 = (depth0 && depth0.markers)),stack1 == null || stack1 === false ? stack1 : stack1.length), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<ol class=\"oh-google-map-ordered-list\">\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.markers), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ol>\n\n<h2>Routes</h2>\n\n<a href=\"#\" class=\"cancel oh-google-map-close\">&times; close</a>\n\n";
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.routes)),stack1 == null || stack1 === false ? stack1 : stack1.length), options) : helperMissing.call(depth0, "not", ((stack1 = (depth0 && depth0.routes)),stack1 == null || stack1 === false ? stack1 : stack1.length), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<ol class=\"oh-google-map-ordered-list\">\n";
  stack1 = (helper = helpers.forEach || (depth0 && depth0.forEach),options={hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.routes), options) : helperMissing.call(depth0, "forEach", (depth0 && depth0.routes), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ol>\n\n<h2>Polygons</h2>\n\n";
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(21, program21, data),data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.polygons)),stack1 == null || stack1 === false ? stack1 : stack1.length), options) : helperMissing.call(depth0, "not", ((stack1 = (depth0 && depth0.polygons)),stack1 == null || stack1 === false ? stack1 : stack1.length), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<ol class=\"oh-google-map-ordered-list\">\n";
  stack1 = (helper = helpers.forEach || (depth0 && depth0.forEach),options={hash:{},inverse:self.noop,fn:self.program(23, program23, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.polygons), options) : helperMissing.call(depth0, "forEach", (depth0 && depth0.polygons), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ol>\n\n<h2>Polylines</h2>\n\n";
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(30, program30, data),data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.polylines)),stack1 == null || stack1 === false ? stack1 : stack1.length), options) : helperMissing.call(depth0, "not", ((stack1 = (depth0 && depth0.polylines)),stack1 == null || stack1 === false ? stack1 : stack1.length), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<ol class=\"oh-google-map-ordered-list\">\n";
  stack1 = (helper = helpers.forEach || (depth0 && depth0.forEach),options={hash:{},inverse:self.noop,fn:self.program(32, program32, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.polylines), options) : helperMissing.call(depth0, "forEach", (depth0 && depth0.polylines), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ol>";
  return buffer;
  });

templates['map'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"oh-google-map-window\"></div>\n\n<div class=\"oh-google-map-controls\"></div>\n\n<div class=\"oh-google-map-zoom-control\">\n	<a href=\"#\" class=\"oh-google-map-control-button oh-google-map-zoom-in\">&plus;</a>\n	<a href=\"#\" class=\"oh-google-map-control-button oh-google-map-zoom-out\">&minus;</a>\n</div>\n\n<div class=\"oh-google-map\" style=\"width:";
  if (helper = helpers.width) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.width); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "; height:";
  if (helper = helpers.height) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.height); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></div>";
  return buffer;
  });

templates['marker-form'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\n	<h2>Add Marker</h2>\n";
  }

function program3(depth0,data) {
  
  
  return "\n	<h2>Edit Marker</h2>\n";
  }

function program5(depth0,data,depth1) {
  
  var stack1;
  return escapeExpression(((stack1 = (depth1 && depth1.icon)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1));
  }

function program7(depth0,data) {
  
  
  return "http://mt.googleapis.com/vt/icon/name=icons/spotlight/spotlight-poi.png&scale=2";
  }

function program9(depth0,data) {
  
  
  return "\n		<button type=\"submit\" class=\"btn submit\">Save Marker</button>\n	";
  }

function program11(depth0,data) {
  
  
  return "\n		<button type=\"submit\" class=\"btn submit\">Save Changes</button>\n	";
  }

  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.isSavedToMap), options) : helperMissing.call(depth0, "not", (depth0 && depth0.isSavedToMap), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isSavedToMap), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<nav class=\"oh-google-map-tabs oh-google-map-clearfix oh-google-map-two-up\">\n	<ul>\n		<li><a class=\"oh-google-map-tab-trigger active\" href=\"#oh-location-tab\">Location</a></li>\n		<li><a class=\"oh-google-map-tab-trigger\" href=\"#oh-content-tab\">Content</a></li>\n	</ul>\n</nav>\n\n<div id=\"oh-location-tab\" class=\"oh-google-map-clearfix oh-google-map-tab\">\n\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-8\">\n			<p><b>Address:</b> <span class=\"address\">";
  if (helper = helpers.address) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.address); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></p>\n			<p><b>Latitude:</b> <span class=\"lat\">";
  if (helper = helpers.lat) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lat); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></p>\n			<p><b>Longitude:</b> <span class=\"lng\">";
  if (helper = helpers.lng) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lng); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span></p>\n\n			<a href=\"#\" class=\"edit-location\">Change Location</a>\n		</div>\n		<div class=\"oh-google-map-column oh-google-map-large-4\">\n			<div class=\"oh-google-map-map-icon\">\n				<label>Map Icon</label>\n				<span><img src=\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.icon), {hash:{},inverse:self.noop,fn:self.programWithDepth(5, program5, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.icon), options) : helperMissing.call(depth0, "not", (depth0 && depth0.icon), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" /></span>\n				<a href=\"#\" class=\"change-icon\">Change Icon</a>\n			</div>\n		</div>\n	</div>\n\n</div>\n\n<div id=\"oh-content-tab\" class=\"oh-google-map-clearfix oh-google-map-tab\">\n	\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-12\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"poly-title\">Title</label>\n				<input type=\"text\" name=\"title\" id=\"poly-title\" value=\"";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"text fullwidth\" />\n			</div>\n		</div>\n	</div>\n\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-12\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"poly-title\">Content</label>\n				<textarea name=\"content\" id=\"poly-content\" class=\"text fullwidth\">";
  if (helper = helpers.content) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.content); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n			</div>\n		</div>\n	</div>\n\n</div>\n\n<div id=\"oh-options-tab\" class=\"oh-google-map-clearfix oh-google-map-tab\">\n\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-6\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"stroke-color\">Stroke Color</label>\n				<input type=\"text\" name=\"strokeColor\" id=\"stroke-color\" value=\"";
  if (helper = helpers.strokeColor) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeColor); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"simple-color-picker text fullwidth\" />\n			</div>\n		</div>\n		<div class=\"oh-google-map-column oh-google-map-large-6\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"stroke-color\">Fill Color</label>\n				<input type=\"text\" name=\"fillColor\" id=\"fill-color\" value=\"";
  if (helper = helpers.fillColor) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fillColor); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"simple-color-picker text fullwidth\" />\n			</div>\n		</div>\n	</div>\n\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-6\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"stroke-opacity\" class=\"oh-google-map-small-margin-bottom\">Stroke Opacity</label>\n				<div class=\"slider\" data-value=\"";
  if (helper = helpers.strokeOpacity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeOpacity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-start=\".6\" data-step=\".1\" data-min=\"0\" data-max=\"1\"></div>\n				<input type=\"hidden\" name=\"strokeOpacity\" id=\"stroke-opacity\" value=\"";
  if (helper = helpers.strokeOpacity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeOpacity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n			</div>\n		</div>\n		<div class=\"oh-google-map-column oh-google-map-large-6\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"fill-opacity\" class=\"oh-google-map-small-margin-bottom\">Fill Opacity</label>\n				<div class=\"slider\" data-value=\"";
  if (helper = helpers.fillOpacity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fillOpacity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-start=\".6\" data-step=\".1\" data-min=\"0\" data-max=\"1\"></div>\n				<input type=\"hidden\" name=\"fillOpacity\" id=\"fill-opacity\" value=\"";
  if (helper = helpers.fillOpacity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fillOpacity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n			</div>\n		</div>\n	</div>\n\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-6\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"stroke-opacity\" class=\"oh-google-map-small-margin-bottom\">Stroke Weight</label>\n				<div class=\"slider\" data-value=\"";
  if (helper = helpers.strokeWeight) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeWeight); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-start=\"3\" data-step=\"1\" data-min=\"0\" data-max=\"10\"></div>\n				<input type=\"hidden\" name=\"strokeWeight\" id=\"stroke-weight\" value=\"";
  if (helper = helpers.strokeWeight) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeWeight); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n			</div>\n		</div>\n		<div class=\"oh-google-map-column oh-google-map-large-6\">\n		</div>\n	</div>\n\n</div>\n\n<footer>\n	";
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.isSavedToMap), options) : helperMissing.call(depth0, "not", (depth0 && depth0.isSavedToMap), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isSavedToMap), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	\n	<a href=\"#\" class=\"cancel\">Cancel</a>\n</footer>";
  return buffer;
  });

templates['polygon-form'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\n	<h2>Add Polygon</h2>\n";
  }

function program3(depth0,data) {
  
  
  return "\n	<h2>Edit Polygon</h2>\n";
  }

function program5(depth0,data) {
  
  
  return "Show Details";
  }

function program7(depth0,data) {
  
  
  return "Hide Details";
  }

function program9(depth0,data) {
  
  
  return "style=\"display:none\"";
  }

function program11(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			<div class=\"oh-google-map-tag\" title=\"";
  if (helper = helpers.lat) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lat); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ",";
  if (helper = helpers.lng) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lng); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n				<span>Point ";
  if (helper = helpers.count) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.count); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n				<a href=\"#\" class=\"remove\"><span>&times;</span></a>\n			</div>\n			";
  return buffer;
  }

function program13(depth0,data) {
  
  
  return "\n		<button type=\"submit\" class=\"btn submit\">Save Polygon</button>\n	";
  }

function program15(depth0,data) {
  
  
  return "\n		<button type=\"submit\" class=\"btn submit\">Save Changes</button>\n	";
  }

  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.isSavedToMap), options) : helperMissing.call(depth0, "not", (depth0 && depth0.isSavedToMap), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isSavedToMap), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<nav class=\"oh-google-map-tabs oh-google-map-clearfix oh-google-map-three-up\">\n	<ul>\n		<li><a class=\"oh-google-map-tab-trigger active\" href=\"#oh-points-tab\">Points</a></li>\n		<li><a class=\"oh-google-map-tab-trigger\" href=\"#oh-content-tab\">Content</a></li>\n		<li><a class=\"oh-google-map-tab-trigger\" href=\"#oh-options-tab\">Options</a></li>\n	</ul>\n</nav>\n\n<div id=\"oh-points-tab\" class=\"oh-google-map-clearfix oh-google-map-tab\">\n	<p><span class=\"oh-google-map-small-text\"><a href=\"#\" class=\"toggle-details\">";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hideDetails), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.hideDetails), options) : helperMissing.call(depth0, "not", (depth0 && depth0.hideDetails), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a></span></p>\n\n	<div class=\"details\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hideDetails), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n		<p class=\"oh-google-map-small-text\">To add points to the polygon, you can either double click the map or add enter coordinates or addresses manually.</p>\n\n		<div class=\"points oh-google-map-tags\">\n			";
  stack1 = (helper = helpers.forEach || (depth0 && depth0.forEach),options={hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.points), options) : helperMissing.call(depth0, "forEach", (depth0 && depth0.points), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</div>\n	</div>\n\n	<div class=\"point-field\">\n		<input type=\"text\" name=\"point\" value=\"\" class=\"text\" placeholder=\"Enter a coordinate or address\" style=\"width:45%;\" /> <a class=\"btn add-point\" style=\"margin-left:10px;\">+ Add Point</a>\n	</div>\n\n</div>\n\n<div id=\"oh-content-tab\" class=\"oh-google-map-clearfix oh-google-map-tab\">\n	\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-12\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"poly-title\">Title</label>\n				<input type=\"text\" name=\"title\" id=\"poly-title\" value=\"";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"text fullwidth\" />\n			</div>\n		</div>\n	</div>\n\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-12\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"poly-title\">Content</label>\n				<textarea name=\"content\" id=\"poly-content\" class=\"text fullwidth\">";
  if (helper = helpers.content) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.content); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n			</div>\n		</div>\n	</div>\n\n</div>\n\n<div id=\"oh-options-tab\" class=\"oh-google-map-clearfix oh-google-map-tab\">\n\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-6\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"stroke-color\">Stroke Color</label>\n				<input type=\"text\" name=\"strokeColor\" id=\"stroke-color\" value=\"";
  if (helper = helpers.strokeColor) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeColor); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"simple-color-picker text fullwidth\" />\n			</div>\n		</div>\n		<div class=\"oh-google-map-column oh-google-map-large-6\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"stroke-color\">Fill Color</label>\n				<input type=\"text\" name=\"fillColor\" id=\"fill-color\" value=\"";
  if (helper = helpers.fillColor) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fillColor); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"simple-color-picker text fullwidth\" />\n			</div>\n		</div>\n	</div>\n\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-6\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"stroke-opacity\" class=\"oh-google-map-small-margin-bottom\">Stroke Opacity</label>\n				<div class=\"slider\" data-value=\"";
  if (helper = helpers.strokeOpacity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeOpacity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-start=\".6\" data-step=\".1\" data-min=\"0\" data-max=\"1\"></div>\n				<input type=\"hidden\" name=\"strokeOpacity\" id=\"stroke-opacity\" value=\"";
  if (helper = helpers.strokeOpacity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeOpacity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n			</div>\n		</div>\n		<div class=\"oh-google-map-column oh-google-map-large-6\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"fill-opacity\" class=\"oh-google-map-small-margin-bottom\">Fill Opacity</label>\n				<div class=\"slider\" data-value=\"";
  if (helper = helpers.fillOpacity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fillOpacity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-start=\".6\" data-step=\".1\" data-min=\"0\" data-max=\"1\"></div>\n				<input type=\"hidden\" name=\"fillOpacity\" id=\"fill-opacity\" value=\"";
  if (helper = helpers.fillOpacity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fillOpacity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n			</div>\n		</div>\n	</div>\n\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-6\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"stroke-opacity\" class=\"oh-google-map-small-margin-bottom\">Stroke Weight</label>\n				<div class=\"slider\" data-value=\"";
  if (helper = helpers.strokeWeight) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeWeight); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-start=\"3\" data-step=\"1\" data-min=\"0\" data-max=\"10\"></div>\n				<input type=\"hidden\" name=\"strokeWeight\" id=\"stroke-weight\" value=\"";
  if (helper = helpers.strokeWeight) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeWeight); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n			</div>\n		</div>\n		<div class=\"oh-google-map-column oh-google-map-large-6\">\n		</div>\n	</div>\n\n</div>\n\n<footer>\n	";
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.isSavedToMap), options) : helperMissing.call(depth0, "not", (depth0 && depth0.isSavedToMap), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isSavedToMap), {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	\n	<a href=\"#\" class=\"cancel\">Cancel</a>\n</footer>";
  return buffer;
  });

templates['polyline-form'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\n	<h2>Add Polyline</h2>\n";
  }

function program3(depth0,data) {
  
  
  return "\n	<h2>Edit Polyline</h2>\n";
  }

function program5(depth0,data) {
  
  
  return "Show Details";
  }

function program7(depth0,data) {
  
  
  return "Hide Details";
  }

function program9(depth0,data) {
  
  
  return "style=\"display:none\"";
  }

function program11(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n			<div class=\"oh-google-map-tag\" title=\"";
  if (helper = helpers.lat) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lat); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ",";
  if (helper = helpers.lng) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.lng); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n				<span>Point ";
  if (helper = helpers.count) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.count); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n				<a href=\"#\" class=\"remove\"><span>&times;</span></a>\n			</div>\n			";
  return buffer;
  }

function program13(depth0,data) {
  
  
  return "\n		<button type=\"submit\" class=\"btn submit\">Save Polyline</button>\n	";
  }

function program15(depth0,data) {
  
  
  return "\n		<button type=\"submit\" class=\"btn submit\">Save Changes</button>\n	";
  }

  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.isSavedToMap), options) : helperMissing.call(depth0, "not", (depth0 && depth0.isSavedToMap), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isSavedToMap), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<nav class=\"oh-google-map-tabs oh-google-map-clearfix oh-google-map-three-up\">\n	<ul>\n		<li><a class=\"oh-google-map-tab-trigger active\" href=\"#oh-points-tab\">Points</a></li>\n		<li><a class=\"oh-google-map-tab-trigger\" href=\"#oh-content-tab\">Content</a></li>\n		<li><a class=\"oh-google-map-tab-trigger\" href=\"#oh-options-tab\">Options</a></li>\n	</ul>\n</nav>\n\n<div id=\"oh-points-tab\" class=\"oh-google-map-clearfix oh-google-map-tab\">\n	<p><span class=\"oh-google-map-small-text\"><a href=\"#\" class=\"toggle-details\">";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hideDetails), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.hideDetails), options) : helperMissing.call(depth0, "not", (depth0 && depth0.hideDetails), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a></span></p>\n\n	<div class=\"details\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hideDetails), {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n		<p class=\"oh-google-map-small-text\">To add points to the polygon, you can either double click the map or add enter coordinates or addresses manually.</p>\n\n		<div class=\"points oh-google-map-tags\">\n			";
  stack1 = (helper = helpers.forEach || (depth0 && depth0.forEach),options={hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.points), options) : helperMissing.call(depth0, "forEach", (depth0 && depth0.points), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</div>\n	</div>\n\n	<div class=\"point-field\">\n		<input type=\"text\" name=\"point\" value=\"\" class=\"text\" placeholder=\"Enter a coordinate or address\" style=\"width:45%;\" /> <a class=\"btn add-point\" style=\"margin-left:10px;\">+ Add Point</a>\n	</div>\n\n</div>\n\n<div id=\"oh-content-tab\" class=\"oh-google-map-clearfix oh-google-map-tab\">\n	\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-12\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"poly-title\">Title</label>\n				<input type=\"text\" name=\"title\" id=\"poly-title\" value=\"";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"text fullwidth\" />\n			</div>\n		</div>\n	</div>\n\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-12\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"poly-title\">Content</label>\n				<textarea name=\"content\" id=\"poly-content\" class=\"text fullwidth\">";
  if (helper = helpers.content) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.content); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n			</div>\n		</div>\n	</div>\n\n</div>\n\n<div id=\"oh-options-tab\" class=\"oh-google-map-clearfix oh-google-map-tab\">\n\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-6\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"stroke-color\">Stroke Color</label>\n				<input type=\"text\" name=\"strokeColor\" id=\"stroke-color\" value=\"";
  if (helper = helpers.strokeColor) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeColor); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"simple-color-picker text fullwidth\" />\n			</div>\n		</div>\n		<div class=\"oh-google-map-column oh-google-map-large-6\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"stroke-opacity\" class=\"oh-google-map-small-margin-bottom\">Stroke Opacity</label>\n				<div class=\"slider\" data-value=\"";
  if (helper = helpers.strokeOpacity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeOpacity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-start=\".6\" data-step=\".1\" data-min=\"0\" data-max=\"1\"></div>\n				<input type=\"hidden\" name=\"strokeOpacity\" id=\"stroke-opacity\" value=\"";
  if (helper = helpers.strokeOpacity) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeOpacity); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n			</div>\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"stroke-opacity\" class=\"oh-google-map-small-margin-bottom\">Stroke Weight</label>\n				<div class=\"slider\" data-value=\"";
  if (helper = helpers.strokeWeight) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeWeight); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" data-start=\"3\" data-step=\"1\" data-min=\"0\" data-max=\"10\"></div>\n				<input type=\"hidden\" name=\"strokeWeight\" id=\"stroke-weight\" value=\"";
  if (helper = helpers.strokeWeight) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.strokeWeight); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" />\n			</div>\n		</div>\n	</div>\n\n</div>\n\n<footer>\n	";
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.isSavedToMap), options) : helperMissing.call(depth0, "not", (depth0 && depth0.isSavedToMap), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isSavedToMap), {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	\n	<a href=\"#\" class=\"cancel\">Cancel</a>\n</footer>";
  return buffer;
  });

templates['route-form'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  return "\n	<h2>Add Route</h2>\n";
  }

function program3(depth0,data) {
  
  
  return "\n	<h2>Edit Route</h2>\n";
  }

function program5(depth0,data) {
  
  
  return "Show Details";
  }

function program7(depth0,data) {
  
  
  return "Hide Details";
  }

function program9(depth0,data,depth1) {
  
  var buffer = "", stack1, helper, options;
  buffer += "\n	<ul class=\"oh-google-map-icon-list oh-google-map-clearfix\">\n		";
  stack1 = (helper = helpers.forEach || (depth1 && depth1.forEach),options={hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data},helper ? helper.call(depth0, (depth1 && depth1.locations), options) : helperMissing.call(depth0, "forEach", (depth1 && depth1.locations), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</ul>\n	";
  return buffer;
  }
function program10(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n		<li>\n			<img src=\"";
  if (helper = helpers.icon) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.icon); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" alt=\"Marker Icon\" class=\"oh-google-map-icon-list-icon\" /> \n			<span class=\"oh-google-map-icon-list-label\">\n				";
  if (helper = helpers.address) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.address); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " \n				<a href=\"#\" class=\"remove-location oh-google-map-icon-list-action\"><span data-icon=\"trash\"></span></a>\n				<a href=\"#\" class=\"edit-location oh-google-map-icon-list-action\" ><span data-icon=\"field\"></span></a> \n			</span>\n		</li>\n		";
  return buffer;
  }

function program12(depth0,data) {
  
  
  return "\n		<!-- <p class=\"oh-google-map-margin-bottom\"><em>There are no locations added to this route yet.</em></p> -->\n	";
  }

function program14(depth0,data) {
  
  
  return "style=\"display:none\"";
  }

function program16(depth0,data) {
  
  
  return "checked=\"checked\"";
  }

function program18(depth0,data) {
  
  
  return "on";
  }

function program20(depth0,data) {
  
  
  return "\n		<button type=\"submit\" class=\"btn submit\">Save Route</button>\n	";
  }

function program22(depth0,data) {
  
  
  return "\n		<button type=\"submit\" class=\"btn submit\">Save Changes</button>\n	";
  }

  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.isSavedToMap), options) : helperMissing.call(depth0, "not", (depth0 && depth0.isSavedToMap), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isSavedToMap), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<nav class=\"oh-google-map-tabs oh-google-map-clearfix oh-google-map-three-up\">\n	<ul>\n		<li><a class=\"oh-google-map-tab-trigger active\" href=\"#oh-locations-tab\">Locations</a></li>\n		<li><a class=\"oh-google-map-tab-trigger\" href=\"#oh-content-tab\">Content</a></li>\n		<li><a class=\"oh-google-map-tab-trigger\" href=\"#oh-options-tab\">Options</a></li>\n	</ul>\n</nav>\n\n<div id=\"oh-locations-tab\" class=\"oh-google-map-clearfix oh-google-map-tab\">\n	\n	<!--\n	<p><span class=\"oh-google-map-small-text\"><a href=\"#\" class=\"toggle-details\">";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hideDetails), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.hideDetails), options) : helperMissing.call(depth0, "not", (depth0 && depth0.hideDetails), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a></span></p>\n	-->\n\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.locations), {hash:{},inverse:self.noop,fn:self.programWithDepth(9, program9, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n	";
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data},helper ? helper.call(depth0, ((stack1 = (depth0 && depth0.locations)),stack1 == null || stack1 === false ? stack1 : stack1.length), options) : helperMissing.call(depth0, "not", ((stack1 = (depth0 && depth0.locations)),stack1 == null || stack1 === false ? stack1 : stack1.length), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n	<!--\n	<div class=\"details\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.hideDetails), {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ">\n		<p class=\"oh-google-map-small-text\">You can add up to 8 locations to a single route. You can either double click the map or add enter coordinates or addresses manually.</p>\n	</div>\n	-->\n\n	<a class=\"btn add-location\" style=\"margin:5px 10px\">+ Add Location</a>\n\n</div>\n\n<div id=\"oh-content-tab\" class=\"oh-google-map-clearfix oh-google-map-tab\">\n	\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-12\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"poly-title\">Title</label>\n				<input type=\"text\" name=\"title\" id=\"poly-title\" value=\"";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"text fullwidth\" />\n			</div>\n		</div>\n	</div>\n\n	<div class=\"oh-google-map-row\">\n		<div class=\"oh-google-map-column oh-google-map-large-12\">\n			<div class=\"oh-google-map-margin-bottom\">\n				<label for=\"poly-title\">Content</label>\n				<textarea name=\"content\" id=\"poly-content\" class=\"text fullwidth\">";
  if (helper = helpers.content) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.content); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n			</div>\n		</div>\n	</div>\n\n</div>\n\n<div id=\"oh-options-tab\" class=\"oh-google-map-clearfix oh-google-map-tab\">\n\n	<div class=\"btngroup\" style=\"margin:5px auto 25px auto;width:260px;display:block;\">\n		<label class=\"btn\"><input type=\"radio\" name=\"travelMode\" value=\"DRIVING\" ";
  stack1 = (helper = helpers.is || (depth0 && depth0.is),options={hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.travelMode), "DRIVING", options) : helperMissing.call(depth0, "is", (depth0 && depth0.travelMode), "DRIVING", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.travelMode), options) : helperMissing.call(depth0, "not", (depth0 && depth0.travelMode), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " /> Driving</label>\n		<label class=\"btn\"><input type=\"radio\" name=\"travelMode\" value=\"WALKING\" ";
  stack1 = (helper = helpers.is || (depth0 && depth0.is),options={hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.travelMode), "WALKING", options) : helperMissing.call(depth0, "is", (depth0 && depth0.travelMode), "WALKING", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " /> Walking</label>\n		<label class=\"btn\"><input type=\"radio\" name=\"travelMode\" value=\"BICYCLING\" ";
  stack1 = (helper = helpers.is || (depth0 && depth0.is),options={hash:{},inverse:self.noop,fn:self.program(16, program16, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.travelMode), "BICYCLING", options) : helperMissing.call(depth0, "is", (depth0 && depth0.travelMode), "BICYCLING", options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " /> Bicycling</label>\n	</div>\n\n	<ul class=\"oh-google-map-small-block-grid-3\">\n		<li>\n			<p>Avoid Ferries</p>\n\n			<div class=\"lightswitch ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.avoidFerries), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" tabindex=\"0\">\n				<div class=\"lightswitch-container\">\n					<div class=\"label on\"></div>\n					<div class=\"handle\"></div>\n					<div class=\"label off\"></div>\n				</div>\n				<input type=\"hidden\" name=\"avoidFerries\" value=\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.avoidFerries), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" />\n			</div>\n		</li>\n		<li>\n			<p>Avoid Highways</p>\n\n			<div class=\"lightswitch ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.avoidHighways), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" tabindex=\"0\">\n				<div class=\"lightswitch-container\">\n					<div class=\"label on\"></div>\n					<div class=\"handle\"></div>\n					<div class=\"label off\"></div>\n				</div>\n				<input type=\"hidden\" name=\"avoidHighways\" value=\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.avoidHighways), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" />\n			</div>\n		</li>\n		<li>\n			<p>Avoid Tolls</p>\n\n			<div class=\"lightswitch ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.avoidTolls), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" tabindex=\"0\">\n				<div class=\"lightswitch-container\">\n					<div class=\"label on\"></div>\n					<div class=\"handle\"></div>\n					<div class=\"label off\"></div>\n				</div>\n				<input type=\"hidden\" name=\"avoidTolls\" value=\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.avoidTolls), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" />\n			</div>\n		</li>\n		<li>\n			<p>Calculate Duration with Traffic</p>\n\n			<div class=\"lightswitch ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.durationInTraffic), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" tabindex=\"0\">\n				<div class=\"lightswitch-container\">\n					<div class=\"label on\"></div>\n					<div class=\"handle\"></div>\n					<div class=\"label off\"></div>\n				</div>\n				<input type=\"hidden\" name=\"durationInTraffic\" value=\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.durationInTraffic), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" />\n			</div>\n		</li>\n		<li>\n			<p>Optimize Waypoints</p>\n\n			<div class=\"lightswitch ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.optimizeWaypoints), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" tabindex=\"0\">\n				<div class=\"lightswitch-container\">\n					<div class=\"label on\"></div>\n					<div class=\"handle\"></div>\n					<div class=\"label off\"></div>\n				</div>\n				<input type=\"hidden\" name=\"optimizeWaypoints\" value=\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.optimizeWaypoints), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" />\n			</div>\n		</li>\n		<li>\n			<p>Provide Route Alternatives</p>\n\n			<div class=\"lightswitch ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.provideRouteAlternatives), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" tabindex=\"0\">\n				<div class=\"lightswitch-container\">\n					<div class=\"label on\"></div>\n					<div class=\"handle\"></div>\n					<div class=\"label off\"></div>\n				</div>\n				<input type=\"hidden\" name=\"provideRouteAlternatives\" value=\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.provideRouteAlternatives), {hash:{},inverse:self.noop,fn:self.program(18, program18, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" />\n			</div>\n		</li>\n	</ul>\n\n</div>\n\n<footer>\n	";
  stack1 = (helper = helpers.not || (depth0 && depth0.not),options={hash:{},inverse:self.noop,fn:self.program(20, program20, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.isSavedToMap), options) : helperMissing.call(depth0, "not", (depth0 && depth0.isSavedToMap), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.isSavedToMap), {hash:{},inverse:self.noop,fn:self.program(22, program22, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	\n	<a href=\"#\" class=\"cancel\">Cancel</a>\n</footer>";
  return buffer;
  });

templates['route-location-form'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n<h3>Locations Found</h3>\n\n<ul class=\"oh-google-map-highlight-list\">\n";
  stack1 = helpers.each.call(depth0, (depth1 && depth1.locations), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	<li><a href=\"#\">"
    + escapeExpression(((stack1 = (depth0 && depth0.formatted_address)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></li>\n";
  return buffer;
  }

  buffer += "<h2>Add Location</h2>\n\n<input type=\"text\" name=\"location\" value=\"";
  if (helper = helpers.location) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.location); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"Enter an address, postal code, or city\" class=\"text fullwidth\" />\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.locations), {hash:{},inverse:self.noop,fn:self.programWithDepth(1, program1, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n<footer>\n	<button type=\"submit\" class=\"btn submit\">Search</button>\n	<a href=\"#\" class=\"cancel\">Cancel</a>\n</footer>";
  return buffer;
  });
}());