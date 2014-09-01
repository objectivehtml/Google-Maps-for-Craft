<?php
namespace Craft;

class GoogleMaps_DirectionsModel extends BaseModel
{
    protected function defineAttributes()
    {
        return array(
            'routes'   => array(AttributeType::Mixed, 'default' => array()),
            'status'   => array(AttributeType::Mixed, 'default' => false),
        );
    }
}