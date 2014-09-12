<?php
namespace Craft;

class GoogleMaps_CircleModel extends BaseModel
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
            'lat'   => array(AttributeType::Number, 'default' => 0),
            'lng'   => array(AttributeType::Number, 'default' => 0),
            'metric' => array(AttributeType::String, 'default' => ''),
            'radius' => array(AttributeType::String, 'default' => ''),
            'address' => array(AttributeType::String, 'default' => ''),
            'addressComponents' => array(AttributeType::Mixed, 'default' => array()),
            'hideDetails' => array(AttributeType::Mixed, 'default' => true),
            'strokeColor' => array(AttributeType::Mixed, 'default' => null),
            'strokeWeight' => array(AttributeType::Mixed, 'default' => null),
            'strokeOpacity' => array(AttributeType::Mixed, 'default' => null),
            'fillColor' => array(AttributeType::Mixed, 'default' => null),
            'fillOpacity' => array(AttributeType::Mixed, 'default' => null),
            'isNew' => array(AttributeType::Bool, 'default' => true),
            'elementId'   => array(AttributeType::Mixed, 'default' => false),
            'deleted' => array(AttributeType::Bool, 'default' => false),
        );
    }
}