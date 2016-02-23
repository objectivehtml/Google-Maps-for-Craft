<?php
namespace Craft;

class GoogleMaps_MapDataModel extends BaseModel
{
    protected $queryParams = false;

    public function __construct($data, $queryParams = false)
    {
        if($queryParams)
        {
            $this->queryParams = (object) $queryParams;
        }

        parent::__construct($data);

        $markers = array();

        foreach($this->markers as $marker)
        {
            if(get_class($marker) != 'Craft\GoogleMaps_MarkerModel')
            {
                $marker = GoogleMaps_MarkerModel::populateModel((array) $marker);
            }

            $markers[] = $marker;
        }

        $this->markers = $markers;

        $routes = array();

        foreach($this->routes as $route)
        {
            if(get_class($route) != 'Craft\GoogleMaps_RouteModel')
            {
                $route = GoogleMaps_RouteModel::populateModel((array) $route);
            }

            $routes[] = $route;
        }

        $this->routes = $routes;


        $polygons = array();

        foreach($this->polygons as $polygon)
        {
            if(get_class($polygon) != 'Craft\GoogleMaps_PolygonModel')
            {
                $polygon = GoogleMaps_PolygonModel::populateModel((array) $polygon);
            }

            $polygons[] = $polygon;
        }

        $this->polygons = $polygons;


        $polylines = array();

        foreach($this->polylines as $polyline)
        {
            if(get_class($polyline) != 'Craft\GoogleMaps_PolylineModel')
            {
                $polyline = GoogleMaps_PolylineModel::populateModel((array) $polyline);
            }

            $polylines[] = $polyline;
        }

        $this->polylines = $polylines;


        $circles = array();

        foreach($this->circles as $circle)
        {
            if(get_class($circle) != 'Craft\GoogleMaps_CircleModel')
            {
                $circle = GoogleMaps_CircleModel::populateModel((array) $circle);
            }

            $circles[] = $circle;
        }

        $this->circles = $circles;


        $groundOverlays = array();

        foreach($this->groundOverlays as $overlay)
        {
            if(get_class($overlay) != 'Craft\GoogleMaps_GroundOverlayModel')
            {
                $overlay = GoogleMaps_GroundOverlayModel::populateModel((array) $overlay);
            }

            $groundOverlays[] = $overlay;
        }

        $this->groundOverlays = $groundOverlays;
    }

    public function markers()
    {
        return $this->getMarkers();
    }

    public function getMarkers()
    {
        $return = array();

        foreach($this->markers as $index => $marker)
        {
            if(get_class($marker) != 'Craft\GoogleMaps_MarkerModel')
            {
                $marker = GoogleMaps_MarkerModel::populateModel((array) $marker);
            }

            if($this->queryParams && $marker->isWithinProximity($this->queryParams))
            {
                $return[] = $marker;
            }
            else if (!$this->queryParams)
            {
                $return[] = $marker;
            }
        }

        if($this->queryParams)
        {
            usort($return, array($this, 'sortByDistanceAsc'));
        }

        return $return;
    }

    public function getMarker($index)
    {
        $markers = $this->getMarkers();

        if(isset($markers[$index]))
        {
            return $markers[$index];
        }

        return null;
    }

    public function hasMarkers()
    {
        return count($this->getMarkers()) ? true : false;
    }

    public function getPolygons()
    {
        $return = array();

        foreach($this->polygons as $polygon)
        {
            if(get_class($polygon) != 'Craft\GoogleMaps_PolygonModel')
            {
                $polygon = GoogleMaps_PolygonModel::populateModel((array) $polygon);
            }

            $return[] = $polygon;
        }

        return $return;
    }

    public function getPolygon($index)
    {
        $polygons = $this->getPolygons();

        if(isset($polygons[$index]))
        {
            return $polygons[$index];
        }

        return null;
    }

    public function hasPolygon()
    {
        return count($this->getPolygons()) ? true : false;
    }

    public function getPolylines()
    {
        $return = array();

        foreach($this->polylines as $polyline)
        {
            if(get_class($polyline) != 'Craft\GoogleMaps_PolylineModel')
            {
                $polyline = GoogleMaps_PolylineModel::populateModel((array) $polyline);
            }

            $return[] = $polyline;
        }

        return $return;
    }

    public function getPolyline($index)
    {
        $polylines = $this->getPolylines();

        if(isset($polylines[$index]))
        {
            return $polylines[$index];
        }

        return null;
    }

    public function hasPolyline()
    {
        return count($this->getPolylines()) ? true : false;
    }

    public function getRoutes()
    {
        $return = array();

        foreach($this->routes as $route)
        {
            if(get_class($route) != 'Craft\GoogleMaps_RouteModel')
            {
                $route = GoogleMaps_RouteModel::populateModel((array) $route);
            }

            $return[] = $route;
        }

        return $return;
    }

    public function getRoute($index)
    {
        $routes = $this->getRoutes();

        if(isset($routes[$index]))
        {
            return $routes[$index];
        }

        return null;
    }

    public function hasRoutes()
    {
        return count($this->getRoutes()) ? true : false;
    }

    public function getGroundOverlays()
    {
        $return = array();

        foreach($this->groundOverlays as $overlay)
        {
            if(get_class($overlay) != 'Craft\GoogleMaps_GroundOverlayModel')
            {
                $overlay = GoogleMaps_RouteModel::populateModel((array) $overlay);
            }

            $return[] = $overlay;
        }

        return $return;
    }

    public function getGroundOverlay($index)
    {
        $overlays = $this->getGroundOverlays();

        if(isset($overlays[$index]))
        {
            return $overlays[$index];
        }

        return null;
    }

    public function hasGroundOverlays()
    {
        return count($this->getGroundOverlays()) ? true : false;
    }

    public function getCircles()
    {
        $return = array();

        foreach($this->circles as $circle)
        {
            if(get_class($circle) != 'Craft\GoogleMaps_CircleModel')
            {
                $circle = GoogleMaps_CircleModel::populateModel((array) $circle);
            }

            $return[] = $circle;
        }

        return $return;
    }

    public function getCircle($index)
    {
        $circles = $this->getCircles();

        if(isset($circles[$index]))
        {
            return $circles[$index];
        }

        return null;
    }

    public function hasCircles()
    {
        return count($this->getCircles()) ? true : false;
    }

    public function sortByDistanceAsc($a, $b)
    {
        return $a->distance < $b->distance ? -1 : 1;
    }

    public function sortByDistanceDesc($a, $b)
    {
        return $a->distance < $b->distance ? 1 : -1;
    }

    public function toJson()
    {
        $return = array(
            'markers' => array(),
            'polygons' => array(),
            'polylines' => array(),
            'routes' => array(),
            'circles' => array(),
            'groundOverlays' => array()
        );

        foreach($this->getMarkers() as $marker)
        {
            $return['markers'][] = $marker->getAttributes();
        }

        foreach($this->getPolygons() as $polygon)
        {
            $return['polygons'][] = $polygon->getAttributes();
        }

        foreach($this->getPolylines() as $polygon)
        {
            $return['polylines'][] = $polygon->getAttributes();
        }

        foreach($this->getRoutes() as $route)
        {
            $return['routes'][] = $route->getAttributes();
        }

        foreach($this->getCircles() as $circle)
        {
            $return['circles'][] = $circle->getAttributes();
        }

        foreach($this->getGroundOverlays() as $overlay)
        {
            $return['groundOverlays'][] = $overlay->getAttributes();
        }

        return json_encode($return);
    }

    public function addMarker(GoogleMaps_MarkerModel $marker)
    {
        $markers = $this->markers;

        $markers[] = $marker;

        $this->markers = $markers;
    }

    public function removeMarker($index)
    {
        $markers = $this->markers;

        unset($markers[$index]);

        $this->markers = $markers;
    }

    public function addCircle(GoogleMaps_CircleModel $circle)
    {
        $circles = $this->circles;

        $circles[] = $circle;

        $this->circles = $circles;
    }

    public function removeCircle($index)
    {
        $circles = $this->circles;

        unset($circles[$index]);

        $this->circles = $circles;
    }

    public function addPolygon(GoogleMaps_PolygonModel $polygon)
    {
        $polylines = $this->polylines;

        $polylines[] = $polygon;

        $this->polylines = $polylines;
    }

    public function removePolygon($index)
    {
        $polygons = $this->polygons;

        unset($polygons[$index]);

        $this->polygons = $polygons;
    }

    public function addPolyline(GoogleMaps_PolylineModel $polyline)
    {
        $polygons = $this->polygons;

        $polygons[] = $polyline;

        $this->polygons = $polygons;
    }

    public function removePolyline($index)
    {
        $polylines = $this->polylines;

        unset($polylines[$index]);

        $this->polylines = $polylines;
    }

    public function addRoute(GoogleMaps_RouteModel $route)
    {
        $routes = $this->routes;

        $routes[] = $route;

        $this->routes = $routes;
    }

    public function removeRoute($index)
    {
        $routes = $this->routes;

        unset($routes[$index]);

        $this->routes = $routes;
    }

    public function addGroundOverlay(GoogleMaps_GroundOverlayModel $overlay)
    {
        $groundOverlays = $this->groundOverlays;

        $groundOverlays[] = $overlay;

        $this->groundOverlays = $groundOverlays;
    }

    public function removeGroundOverlay($index)
    {
        $groundOverlays = $this->groundOverlays;

        unset($groundOverlays[$index]);

        $this->groundOverlays = $groundOverlays;
    }

    public function getStaticMapModel($options = array())
    {
        $options = array_merge($options, array(
            'markers' => $this->getMarkers()
        ));

        $model = GoogleMaps_StaticMapModel::populateModel($options); 

        return $model;
    }

    protected function defineAttributes()
    {
        return array(
            'markers' => array(AttributeType::Mixed, 'default' => array()),
            'polygons' => array(AttributeType::Mixed, 'default' => array()),
            'polylines' => array(AttributeType::Mixed, 'default' => array()),
            'routes' => array(AttributeType::Mixed, 'default' => array()),
            'circles' => array(AttributeType::Mixed, 'default' => array()),
            'groundOverlays' => array(AttributeType::Mixed, 'default' => array()),
        );

    }
}