<?php
namespace Craft;

class GoogleMapsVariable
{
    public function map($options)
    {
        return craft()->googleMaps_templates->map($options);
    }

    public function geocode($location)
    {
        return craft()->googleMaps_geocoder->geocode($location);
    }

    public function staticMap($data, $options = array())
    {
        return craft()->googleMaps_templates->staticMap($data, $options);
    }

    public function directions($options = array())
    {
        return craft()->googleMaps_directions->route($options);
    }

    public function data($id, $data = array(), $options = array())
    {
        return craft()->googleMaps_templates->data($id, $data, $options);
    }

    public function mapDataModel($data)
    {
        return craft()->googleMaps_templates->mapDataModel($data);
    }

    public function center($id, $lat, $lng = '')
    {
        return craft()->googleMaps_templates->center($id, $lat, $lng);
    }

    public function zoom($id, $level)
    {
        return craft()->googleMaps_templates->zoom($id, $level);
    }

    public function marker($id, $options = array())
    {
        return craft()->googleMaps_templates->marker($id, $options);
    }

    public function polygon($id, $points, $options = array())
    {
        return craft()->googleMaps_templates->polygon($id, $points, $options);
    }

    public function polyline($id, $points, $options = array())
    {
        return craft()->googleMaps_templates->polyline($id, $points, $options);
    }

    public function circle($id, $options = array())
    {
        return craft()->googleMaps_templates->circle($id, $options);
    }

    public function groundOverlay($id, $options = array())
    {
        return craft()->googleMaps_templates->groundOverlay($id, $options);
    }

    public function currentLocation($id, $options = array())
    {
        return craft()->googleMaps_templates->currentLocation($id, $options);
    }

    public function searchEntriesWithinBounds($id, $url)
    { 
        craft()->templates->includeJs("
            $id.addListener('idle', function() {
                $.get('$url', function(data) {
                    console.log(data);
                });
            });
        ");
    }
}