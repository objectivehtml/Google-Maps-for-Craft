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
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	<li>";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.deleted), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "<a href=\"#\" class=\"center\">"
    + escapeExpression(((stack1 = (depth0 && depth0.address)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.deleted), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</li>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "<span class=\"oh-google-map-strike-out\">";
  }

function program4(depth0,data) {
  
  
  return "</span> <a href=\"#\" class=\"undo oh-google-map-small-text\">Undo Delete</a>";
  }

  buffer += "<h2>Markers</h2>\n\n<a href=\"#\" class=\"cancel oh-google-map-close\">&times; close</a>\n\n<ol class=\"oh-google-map-ordered-list\">\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.markers), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ol>";
  return buffer;
  });

templates['map'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"oh-google-map-window\"></div>\n\n<div class=\"oh-google-map-controls\"></div>\n\n<div class=\"oh-google-map-zoom-control\">\n	<a href=\"#\" class=\"oh-google-map-control-button oh-google-map-zoom-in\">&plus;</a>\n	<a href=\"#\" class=\"oh-google-map-control-button oh-google-map-zoom-out\">&minus;</a>\n</div>\n\n<div class=\"oh-google-map\"></div>\n\n<textarea name=\"fields[";
  if (helper = helpers.fieldname) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.fieldname); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "]\" class=\"field-data\" style=\"display:none\">";
  if (helper = helpers.savedData) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.savedData); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</textarea>";
  return buffer;
  });
}());