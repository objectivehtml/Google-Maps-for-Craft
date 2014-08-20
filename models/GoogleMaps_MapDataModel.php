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
    }

    public function markers()
    {
        return $this->getMarkers();
    }

    public function getMarkers()
    {
        $return = array();

        foreach($this->markers as $marker)
        {
            $marker = GoogleMaps_MarkerModel::populateModel((array) $marker);

            if($this->queryParams)
            {
                if($marker->isWithinProximity($this->queryParams))
                {
                    $return[] = $marker;
                }
            }
            else
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

    public function getPolygons()
    {
        $return = array();

        foreach($this->polygons as $polygon)
        {
            $return[] = GoogleMaps_PolygonModel::populateModel((array) $polygon);

        }

        return $return;
    }

    public function getPolylines()
    {
        $return = array();

        foreach($this->polylines as $polyline)
        {
            $return[] = GoogleMaps_PolylineModel::populateModel((array) $polyline);

        }

        return $return;
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
            'polygons' => array()
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

    public function addPolygon(GoogleMaps_PolygonModel $polygon)
    {
        $polylines = $this->polylines;

        $polylines[] = $polygon;

        $this->polylines = $polylines;
    }

    public function addPolyline(GoogleMaps_PolylineModel $polyline)
    {
        $polygons = $this->polygons;

        $polygons[] = $polyline;

        $this->polygons = $polygons;
    }

    public function removePolygon($index)
    {
        $polygons = $this->polygons;

        unset($polygons[$index]);

        $this->polygons = $polygons;
    }

    public function removePolyline($index)
    {
        $polylines = $this->polylines;

        unset($polylines[$index]);

        $this->polylines = $polylines;
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
            // Location Parameters
            'markers'   => array(AttributeType::Mixed, 'default' => array()),
            'polygons'   => array(AttributeType::Mixed, 'default' => array()),
            'polylines'   => array(AttributeType::Mixed, 'default' => array())
        );

    }
}