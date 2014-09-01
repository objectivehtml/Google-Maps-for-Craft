<?php
namespace Craft;

class GoogleMaps_TemplatesService extends BaseApplicationComponent
{
    public function scripts()
    {
        craft()->templates->includeJsFile('//maps.google.com/maps/api/js?sensor=true&libraries=geometry');
        craft()->templates->includeJsResource('googlemaps/js/vendor/base.js');
        craft()->templates->includeJsResource('googlemaps/js/vendor/underscore.js');
        craft()->templates->includeJsResource('googlemaps/js/plugin.js');
    }

    public function map($options)
    {
        $defaultOptions = array(
            'id' => 'map',
            'includeScripts' => true,
            'width' => false,
            'height' => false
        );

        $options = array_merge($defaultOptions, $options);

        $mapOptions = array();

        foreach($options as $option => $value)
        {
            if(!array_key_exists($option, $defaultOptions))
            {
                $mapOptions[$option] = $value;
            }
        }

        if(!isset($options['width']) && $options['width'])
        {
            throw new Exception('You must give the map a width');
        }

        if(!isset($options['height']) && $options['height'])
        {
            throw new Exception('You must give the map a height');
        }

        if($options['includeScripts'])
        {
            $this->scripts();
        }

        craft()->templates->includeJs('var '.$options['id'].' = new GoogleMaps.Map(document.getElementById("oh-map-'.$options['id'].'"), '.json_encode((object) $mapOptions).');');

        return TemplateHelper::getRaw(PHP_EOL.'<div id="oh-map-'.$options['id'].'" class="oh-google-map-canvas" style="width:'.$options['width'].';height:'.$options['height'].'"></div>');
    }

    public function geocode($location)
    {
        var_dump(craft()->googleMaps_geocoder->geocode($location));exit();

        return craft()->googleMaps_geocoder->geocode($location);
    }

    public function staticMap($data, $options = array())
    {
        if($data instanceof GoogleMaps_MapDataModel)
        {
            $model = $data->getStaticMapModel($options);

            return TemplateHelper::getRaw(craft()->googleMaps_staticMap->image($model, $options));
        }
        else
        {
            $options = array_merge($options, $data);

            $model = GoogleMaps_StaticMapModel::populateModel($options); 

            return TemplateHelper::getRaw(craft()->googleMaps_staticMap->image($model, $options));
        }
    }

    public function data($id, $data = '', $options = array())
    {
        if(is_string($data))
        {
            $data = json_decode($data);

            $data = new GoogleMaps_MapDataModel((array) $value);
        }

        craft()->templates->includeJs('new GoogleMaps.MapData('.$id.','.$data->toJson().','.json_encode($options).');');
    }

    public function mapDataModel($data)
    {
        return new GoogleMaps_MapDataModel((array) $data);
    }

    public function center($id, $lat, $lng = '')
    {
        $location = '"'.$lat.'"';

        if(!is_string($lat) && !is_string($lng))
        {  
            $location = 'new google.maps.LatLng('.$lat.','.$lng.')';
        }

        craft()->templates->includeJs($id.'.setCenter('.$location.');');
    }

    public function zoom($id, $level)
    {
        craft()->templates->includeJs($id.'.setZoom('.$level.');');
    }

    public function polygon($id, $points, $options = array())
    {
        craft()->templates->includeJs('new GoogleMaps.Polygon('.$id.','.json_encode($points).','.json_encode((object) $options).');');
    }

    public function polyline($id, $points, $options = array())
    {
        craft()->templates->includeJs('new GoogleMaps.Polyline('.$id.','.json_encode($points).','.json_encode((object) $options).');');
    }

    public function marker($id, $options = array())
    {
        craft()->templates->includeJs('new GoogleMaps.Marker('.$id.','.json_encode((object) $options).');');
    }
}
