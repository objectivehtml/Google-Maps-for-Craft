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
            'markers' => array()
        );

        foreach($this->getMarkers() as $marker)
        {
            $return['markers'][] = $marker->getAttributes();
        }

        return json_encode($return);
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
            'markers'   => array(AttributeType::Mixed, 'default' => array())
        );

    }
}