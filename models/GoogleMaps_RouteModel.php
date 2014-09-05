<?php
namespace Craft;

class GoogleMaps_RouteModel extends BaseModel
{
    public function toJson()
    {
        return json_encode($this->getAttributes());
    }

    public function getStaticMapParameters()
    {
        // return 'markers=' . urldecode(!empty($this->address) ? $this->address : $this->lat.','.$this->lng);
    }

    protected function defineAttributes()
    {
        return array(
            // Location Parameters
            'title'   => array(AttributeType::String, 'default' => ''),
            'content'   => array(AttributeType::String, 'default' => ''),
            'locations'   => array(AttributeType::Mixed, 'default' => array()),
            'markers' => array(AttributeType::Mixed, 'default' => array()),
            'avoidFerries' => array(AttributeType::Bool, 'default' => false),
            'avoidHighways' => array(AttributeType::Mixed, 'default' => false),
            'avoidTolls' => array(AttributeType::Mixed, 'default' => false),
            'durationInTraffic' => array(AttributeType::Mixed, 'default' => false),
            'optimizeWaypoints' => array(AttributeType::Mixed, 'default' => false),
            'provideRouteAlternatives' => array(AttributeType::Mixed, 'default' => false),
            'transitOptions' => array(AttributeType::Mixed, 'default' => (object) array()),
            'unitSystem' => array(AttributeType::String, 'default' => 'IMPERIAL'),
            'travelMode' => array(AttributeType::String, 'default' => 'DRIVING'),
            'isNew' => array(AttributeType::Bool, 'default' => true),
            'elementId'   => array(AttributeType::Mixed, 'default' => false),
            'deleted' => array(AttributeType::Bool, 'default' => false),
        );
    }
}