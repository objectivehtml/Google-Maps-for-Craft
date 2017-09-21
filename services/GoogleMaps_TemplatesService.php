<?php
namespace Craft;

class GoogleMaps_TemplatesService extends BaseApplicationComponent
{
    public function scripts()
    {
        if($this->isSecure())
        {
            $protocol = 'https://';
        }
        else 
        {
            $protocol = 'http://';
        }

        $pluginSettings = craft()->plugins->getPlugin('GoogleMaps')->getSettings();
        $key = $pluginSettings->apiKey;

        craft()->templates->includeJsFile($protocol . 'maps.google.com/maps/api/js?sensor=true&libraries=geometry'.($key ? '&key='.$key : ''));
        craft()->templates->includeJsResource('googlemaps/js/vendor/base.js');
        craft()->templates->includeJsResource('googlemaps/js/vendor/underscore.js');
        craft()->templates->includeJsResource('googlemaps/js/vendor/markerclusterer.js');
        craft()->templates->includeJsResource('googlemaps/js/vendor/geolocationmarker.js');
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

        craft()->templates->includeJs('var '.$options['id'].' = new GoogleMaps.Map(document.getElementById("oh-map-'.$options['id'].'"), '.$this->jsonEncode((object) $mapOptions).');');

        return TemplateHelper::getRaw(PHP_EOL.'<div id="oh-map-'.$options['id'].'" class="oh-google-map-canvas" style="width:'.$options['width'].';height:'.$options['height'].'"></div>');
    }

    public function currentLocation($id, $options = array())
    {
        craft()->templates->includeJs('new GoogleMaps.CurrentLocation('.$id.', '.$this->jsonEncode((object) $options).');');
    }

    public function geocode($location)
    {
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

        craft()->templates->includeJs('new GoogleMaps.MapData('.$id.','.$data->toJson().','.$this->jsonEncode($options).');');
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
	    craft()->templates->includeJs('new GoogleMaps.Polygon('.$id.','.$this->jsonEncode($points).').setOptions('.$this->jsonEncode((object) $options).');');
	}

    public function polyline($id, $points, $options = array())
    {
        craft()->templates->includeJs('new GoogleMaps.Polyline('.$id.','.$this->jsonEncode($points).','.$this->jsonEncode((object) $options).');');
    }

    public function marker($id, $options = array())
    {
        craft()->templates->includeJs('new GoogleMaps.Marker('.$id.','.$this->jsonEncode((object) $options).');');
    }

    public function circle($id, $options = array())
    {
        craft()->templates->includeJs('new GoogleMaps.Circle('.$id.','.$this->jsonEncode((object) $options).');');
    }

    public function groundOverlay($id, $options = array())
    {
        craft()->templates->includeJs('new GoogleMaps.GroundOverlay('.$id.','.$this->jsonEncode((object) $options).');');
    }

    private function _populateField($result)
    {
        if ($result['settings'])
        {
            $result['settings'] = JsonHelper::decode($result['settings']);
        }

        return new FieldModel($result);
    }

    public function getGoogleMapsFieldTypes($type = 'GoogleMaps_GoogleMap')
    {
        $fields = craft()->db->createCommand()
            ->select('id, groupId, name, handle, context, instructions, translatable, type, settings')
            ->from('fields')
            ->order('name')
            ->where('type = :type', array(':type' => $type))
            ->queryAll();

        foreach($fields as $index => $field)
        {
            $fields[$index] = $this->_populateField($field);
        }

        return $fields;
    }

    public function jsonEncode($data)
    {
        return  preg_replace_callback("/(\"|')google.maps.\\w+.\\w+(\"|')/u", function($match) {
            return str_replace(array('"', '\''), '', $match[0]);
        }, json_encode($data));
    }

    public function isSecure()
    {
      return
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || $_SERVER['SERVER_PORT'] == 443;
    }
    
}
