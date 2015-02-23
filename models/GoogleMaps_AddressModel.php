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
            'line1' => array(AttributeType::String, 'required' => true),
            'line2' => array(AttributeType::String),
            'city' => array(AttributeType::String, 'required' => true),
            'state' => array(AttributeType::String),
            'zipcode' => array(AttributeType::String),
            'country' => array(AttributeType::String),
            'response' => array(AttributeType::String, 'required' => true),
            'latitude' => array(AttributeType::Mixed, 'required' => true),
            'longitude' => array(AttributeType::Mixed, 'required' => true),
            'locationId' => array(AttributeType::Number)
        );
    }
}