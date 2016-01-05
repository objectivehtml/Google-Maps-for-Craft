<?php
namespace Craft;

class GoogleMaps_AddressModel extends BaseModel
{
    public function toJson()
    {
        return json_encode($this->getAttributes());
    }

    public function getResponse()
    {
        $response = $this->response;

        if(is_string($response))
        {
            $response = json_decode($response);
        }

        return $response;
    }

    protected function defineAttributes()
    {
        return array(
            'line1' => array(AttributeType::String),
            'line2' => array(AttributeType::String),
            'city' => array(AttributeType::String),
            'state' => array(AttributeType::String),
            'zipcode' => array(AttributeType::String),
            'country' => array(AttributeType::String),
            'response' => array(AttributeType::String),
            'latitude' => array(AttributeType::Mixed),
            'longitude' => array(AttributeType::Mixed),
            'locationId' => array(AttributeType::Number)
        );
    }
}