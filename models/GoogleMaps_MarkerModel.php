<?php
namespace Craft;

class GoogleMaps_MarkerModel extends BaseModel
{
    public function toJson()
    {
        return json_encode($this->getAttributes());
    }

    public function getStaticMapParameters()
    {
        return 'markers=' . urldecode(!empty($this->address) ? $this->address : $this->lat.','.$this->lng);
    }

    public function isWithinProximity(\stdClass $params)
    {
        if(!isset($params->lat) || !isset($params->lng))
        {
            return true;
        }

        $distance = $this->getDistance(
            $params->lat, 
            $params->lng,
            $params->unit
        );

        $this->setAttribute('distance', $distance);

        switch ($params->distanceOperator) {

            case '>':

                if($distance > $params->distance)
                {
                    return true;
                }

                break;

            case '>=':

                if($distance >= $params->distance)
                {
                    return true;
                }

                break;

            case '==':

                if($distance == $params->distance)
                {
                    return true;
                }

                break;

            case '<':

                if($distance < $params->distance)
                {
                    return true;
                }

                break;

            default:

                if($distance <= $params->distance)
                {
                    return true;
                }

                break;
        }

        return false;
    }

    protected function defineAttributes()
    {
        return array(
            // Location Parameters
            'title'   => array(AttributeType::String, 'default' => ''),
            'distance'   => array(AttributeType::Mixed, 'default' => false),
            'icon'   => array(AttributeType::Mixed, 'default' => ''),
            'lat'   => array(AttributeType::Number, 'default' => 0),
            'lng'   => array(AttributeType::Number, 'default' => 0),
            'content'   => array(AttributeType::String, 'default' => ''),
            'customContent'   => array(AttributeType::Mixed, 'default' => false),
            'address'   => array(AttributeType::String, 'default' => ''),
            'addressComponents'   => array(AttributeType::Mixed, 'default' => array()),
            'locationId'   => array(AttributeType::Mixed, 'default' => false),
            'elementId'   => array(AttributeType::Mixed, 'default' => false),
            'isNew' => array(AttributeType::Bool, 'default' => true),
            'deleted' => array(AttributeType::Bool, 'default' => false),
        );
    }

    private function getDistance($latitudeFrom, $longitudeFrom, $unit = 'miles', $earthRadius = 6371000)
    {
        // convert from degrees to radians
        $latFrom = deg2rad($latitudeFrom);
        $lonFrom = deg2rad($longitudeFrom);
        $latTo = deg2rad($this->lat);
        $lonTo = deg2rad($this->lng);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) + 
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
        
        return ($angle * $earthRadius * 0.00062137) * craft()->googleMaps->getUnitMultiplier($unit);
    }

    public static function defaultContent($content)
    {
       return implode('<br>', explode(',', $content));
    }
}