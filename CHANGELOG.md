## Google Maps for Craft

### Changelog

#### 0.6.1
##### 09/12/2014

- (Bug Fix) Fixed an issue that prevented circles from appearing on the map list view
- (Bug Fix) Improved UX on map list view, if you edit a map object from this view and click cancel, you will be returned to the map list view just like the delete action.

#### 0.6.0
##### 09/12/2014

- (Feature) Added ability to add circles to a map from the fieldtype.
- (Feature) Added new GoogleMaps.Circle class for the plugin.js to plot circles on the front-end
- (Feature) Added new template tag to plot circles without the field type

#### 0.5.3
##### 09/11/2014

- (Bug Fix) Fixed a critical JS issue that was preventing a map from working upon instantiation. Bug was a result of a recent refactor

#### 0.5.2
##### 09/11/2014

- (Bug Fix) Didn't update the version in 0.5.1, so now it becomes 0.5.2

#### 0.5.1
##### 09/09/2014

- (Feature) Added ability to change the map type within the fieldtype

#### 0.5.0
##### 09/08/2014

- (Feature) Added full support for HTML5 geolocation with CurrentLocation
- (Bug Fix) Fixed an issue with icon size being passed a value if an a scaled dimension had not been set

#### 0.4.0
##### 09/05/2014

- (Feature) Added ability to customize which buttons appear on the map
- (Feature) Added ability to define address fields in the field type which when populated will automatically plot a new marker or edit the first marker on the map (if one exists)
- (Feature) Added server-side Geocoder functionality to work just like the client-side but not require JS.
- (Bug Fix) Fixed an issue with deleted and editing items from the map list view and user hits cancel, they aren't redirected back to the map list view
- (Bug Fix) Fixed a couple issues with the MapDataModel that caused issues when fetching and manipulating existing map objects
- (Bug Fix) Fixed an issue with the MapList view showing the edit modal when the delete button was clicked.

#### 0.3.1
##### 09/04/2014

- (Bug Fix) Fixed an issue with the MapList view showing the edit modal when the delete button was clicked.


#### 0.3.0
##### 09/02/2014

- (Feature) Added new GoogleMaps_DirectionsModel to make it easier to directions data
- (Feature) Added ability to plot directions responses directly to a map
- (Feature) Added marker clustering
- (Feature) Added marker clustering to marker in the data template tag.
- (Bug Fix) Plugin.js now properly centers polylines in the bounds
- (Bug Fix) Fixed some JS errors in the field type

#### 0.2.1
##### 09/01/2014

- (Feature) Added new Routes feature to the field type that allows users to plot directions or routes on a map
- (Feature) Added directions to the MapData class in the front-end plugin
- (Feature) Added ability to edit and delete map objects from the list view
- (Bug Fix) Fixed an issue with data not saving with field inside a matrix field
- (Bug Fix) Fixed a bug with multiple maps in a matrix field
- (Bug Fix) Fixed an issue with map data not being saved

#### 0.2.0
##### 08/20/2014

- (Feature) Added ability to add/edit/delete Polylines from the map just like Polygons.
- (Feature) Added ability to pick custom icons from an Assets modal

#### 0.1.0 
##### 08/19/2014

- Initial Beta Release