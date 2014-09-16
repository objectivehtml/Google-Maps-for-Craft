<?php
namespace Craft;

class GoogleMaps_GroundOverlayModel extends BaseModel
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
            'ne'   => array(AttributeType::Mixed, 'default' => array()),
            'sw' => array(AttributeType::Mixed, 'default' => array()),
            'url' => array(AttributeType::Bool, 'default' => false),
            'opacity' => array(AttributeType::Number, 'default' => 1),
            'isNew' => array(AttributeType::Bool, 'default' => true),
            'elementId'   => array(AttributeType::Mixed, 'default' => false),
            'deleted' => array(AttributeType::Bool, 'default' => false),
        );
    }
}