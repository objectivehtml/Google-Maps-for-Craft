<?php
namespace Craft;

class GoogleMaps_GoogleMapFieldType extends BaseFieldType
{
    protected $queryParams = false;

    public $results = array();

    public function init()
    {
        $t = $this;

        craft()->on('elements.populateElement', function(Event $event) use ($t)
        {
            $t->results[$event->params['element']->id] = $event->params['result'];
        });
    }

    public function getName()
    {
        return Craft::t('Google Map');
    }

    public function defineContentAttribute()
    {
        return array(AttributeType::String, 'column' => ColumnType::Text);
    }

    public function onAfterElementSave()
    {  
        $handle = $this->model->handle;
        
        $data = $this->element->$handle;

        foreach($data->markers as $index => $marker)
        {
            if($marker->deleted)
            {
                if(isset($marker->locationId))
                {
                    $location = GoogleMaps_LocationRecord::model()->findByPk($marker->locationId);

                    if($location)
                    {
                        $location->delete();
                    }
                }

                $data->removeMarker($index);
            }
            else
            {
                $marker->isNew = false;
                
                $marker->elementId = $this->element->id;

                $location = GoogleMaps_LocationRecord::model()->findByPk(isset($marker->locationId) ? $marker->locationId : 0);

                if(!$location)
                {
                    $location = new GoogleMaps_LocationRecord;
                    $location->elementId = $this->element->id;
                    $location->handle = $handle;
                }

                $location->address = $marker->address;
                $location->addressComponents = $marker->addressComponents;
                $location->title = $marker->title;
                $location->content = $marker->content;
                $location->lat = $marker->lat;
                $location->lng = $marker->lng;
                $location->save();

                $marker->locationId = $location->id;
            }
        }

        foreach($data->polygons as $index => $polygon)
        {
            if($polygon->deleted)
            {
                $data->removePolygon($index);
            }
            else
            {
                $polygon->elementId = $this->element->id;
                $polygon->isNew = false;
            }
        }

        foreach($data->polylines as $index => $polyline)
        {
            if($polyline->deleted)
            {
                $data->removePolyline($index);
            }
            else
            {
                $polyline->elementId = $this->element->id;
                $polyline->isNew = false;
            }
        }

        foreach($data->routes as $index => $route)
        {
            if($route->deleted)
            {
                $data->removeRoute($index);
            }
            else
            {
                $route->elementId = $this->element->id;
                $route->isNew = false;
            }
        }

        foreach($data->circles as $index => $circle)
        {
            if($circle->deleted)
            {
                $data->removeCircle($index);
            }
            else
            {
                $circle->elementId = $this->element->id;
                $circle->isNew = false;
            }
        }

        foreach($data->groundOverlays as $index => $overlay)
        {
            if($overlay->deleted)
            {
                $data->removeGroundOverlay($index);
            }
            else
            {
                $overlay->elementId = $this->element->id;
                $overlay->isNew = false;
            }
        }
        
        if(isset($this->element->$handle))
        {
            $this->element->getContent()->{$handle} = $data->toJson();

            craft()->content->saveContent($this->element);
        }
        
        parent::onAfterElementSave();
    }

    public function prepValue($value)
    {   
        $value = json_decode($value);

        return new GoogleMaps_MapDataModel((array) $value, $this->queryParams);
    }

    public function getSearchKeywords($value)
    {
        $keywords = array();

        if(isset($value->markers))
        {
            foreach($value->markers as $marker)
            {
                $keywords[] = $marker->address;
            }
        }

        return implode(' ', $keywords);
    }

    public function modifyElementsQuery(DbCommand $query, $params = array())
    {
        if(is_null($params))
        {
            return null;
        }

        $defaultParams = array(
            'distanceColumn' => 'distance',
            'distanceOperator' => '<=',
            'unit' => 'miles'
        );

        $this->queryParams = array_merge($defaultParams, $params);

        if(isset($this->queryParams['latitude']))
        {
            $this->queryParams['lat'] = $this->queryParams['latitude'];
            unset($this->queryParams['latitude']);
        }

        if(isset($this->queryParams['longitude']))
        {
            $this->queryParams['lng'] = $this->queryParams['longitude'];
            unset($this->queryParams['longitude']);
        }

        $handle = $this->model->handle;

        if(isset($this->queryParams['address']))
        {
            $response = craft()->googleMaps_geocoder->geocode($this->queryParams['address']);
            
            if($response->status != 'OK')
            {
                return null;
            }
    
            $this->queryParams['lat'] = $lat = $response->results[0]->geometry->location->lat;
            $this->queryParams['lng'] = $lng = $response->results[0]->geometry->location->lng;
        }
        elseif(isset($this->queryParams['lat']) && isset($this->queryParams['lng']))
        {            
            $lat = $this->queryParams['lat'];
            $lng = $this->queryParams['lng'];
        }

        if(isset($lat) && isset($lng))
        {
            $query->addSelect($this->queryParams['distanceColumn']);
            $query->join('(SELECT *, ROUND((((ACOS(SIN('.$lat.' * PI() / 180) * SIN('.craft()->db->tablePrefix.'googlemaps_locations.lat * PI() / 180) + COS('.$lat.' * PI() / 180) * COS('.craft()->db->tablePrefix.'googlemaps_locations.lat * PI() / 180) * COS(('.$lng.' - '.craft()->db->tablePrefix.'googlemaps_locations.lng) * PI() / 180)) * 180 / PI()) * 60 * 1.1515) * '.craft()->googleMaps->getUnitMultiplier($this->queryParams['unit']).'), 1) AS '.$this->queryParams['distanceColumn'].' FROM '.craft()->db->tablePrefix.'googlemaps_locations '.(isset($this->queryParams['distance']) ? 'HAVING '.$this->queryParams['distanceColumn'].' ' . $this->queryParams['distanceOperator'] . ' ' . $this->queryParams['distance'] . ' OR ' . $this->queryParams['distanceColumn'] . ' IS NULL' : '').' ORDER BY '.$this->queryParams['distanceColumn'].' ASC) googlemaps_locations', 'elements.id=googlemaps_locations.elementId');
        }
    }

    public function getInputHtml($name, $value)
    { 
        $id = craft()->templates->formatInputId($name);

        // Figure out what that ID is going to look like once it has been namespaced
        $namespacedId = craft()->templates->namespaceInputId($id);

        $pluginSettings = craft()->plugins->getPlugin('GoogleMaps')->getSettings();
        $key = $pluginSettings->apiKey;
        
        craft()->templates->includeJsResource('googlemaps/js/app.compiled.js');
        craft()->templates->includeCssResource('googlemaps/css/app.css');
        craft()->templates->includeJsFile('//maps.googleapis.com/maps/api/js?key='.$key.'&sensor=false&callback=GoogleMaps.init');

        $addressFields = $this->getSettings()->addressFields;

        craft()->templates->includeJs("
        var data = ['#$namespacedId-field .oh-google-map-wrapper', {
            fieldname: '$name',
            savedData: ".(!empty($value) ? $value->toJson() : "false").",
            width: '".$this->getSettings()->defaultMapWidth."',
            height: '".$this->getSettings()->defaultMapHeight."',
            center: '".$this->getSettings()->defaultMapCenter."',
            zoom: ".$this->getSettings()->defaultMapZoom.",
            availableButtons: ".$this->getAvailableButtons().",
            showButtons: ".json_encode($this->getSettings()->displayButtons).",
            addressFields: ".($addressFields ? json_encode(explode("\r\n", $this->getSettings()->addressFields)) : 'false')."
        }];

        if(google.maps.Map) {
            GoogleMaps.initMapField(data);
        }
        else {
            GoogleMaps.mapFieldData.push(data);
        }");

        return craft()->templates->render('googlemaps/fieldtype', array(
            'name' => $name
        ));
    }

    public function getAvailableButtons()
    {
        foreach(craft()->config->get('availableMapButtons', 'googlemaps') as $button)
        {
            $return[] = $button['value'];
        }

        return json_encode($return);
    }

    public function getSettingsHtml()
    {
        $namespacedId = craft()->templates->namespaceInputId(isset($this->model->id) ? $this->model->id : null);

        craft()->googleMaps_templates->scripts();

        $coord = explode(',', $this->getSettings()->defaultMapCenter);

        craft()->templates->includeJs("
            (function() {
                var canvas = $('.oh-google-map:not(.initialized)').first().addClass('initialized');

                canvas.css({
                    width: '{$this->getSettings()->defaultMapWidth}',
                    height: '{$this->getSettings()->defaultMapHeight}'
                })

                var map = new GoogleMaps.Map(canvas.get(0), {
                    lat: ".(isset($coord[0]) ? $coord[0] : 0).",
                    lng: ".(isset($coord[1]) ? $coord[1] : 0).",
                    options: {
                        zoom: {$this->getSettings()->defaultMapZoom},
                    },
                    onCenterChanged: function() {
                        var center = this.getCenter();

                        $('#types-GoogleMaps_GoogleMap-defaultMapCenter').val(center.lat()+','+center.lng());
                    },
                    onZoomChanged: function() {
                        $('#types-GoogleMaps_GoogleMap-defaultMapZoom').val(this.getZoom());
                    }
                });

                $('#types-GoogleMaps_GoogleMap-defaultMapZoom').blur(function() {
                    map.setZoom(parseInt($(this).val()));
                });

                $('#types-GoogleMaps_GoogleMap-defaultMapCenter').blur(function() {
                    var coord = $(this).val().split(',');

                    map.setCenter(coord[0], coord[1]);
                });

                $('#types-GoogleMaps_GoogleMap-defaultMapWidth').blur(function() {
                    canvas.css('width', $(this).val());
                    map.redraw();
                });

                $('#types-GoogleMaps_GoogleMap-defaultMapHeight').blur(function() {
                    canvas.css('height', $(this).val());
                    map.redraw();
                });
            }());
        ");

        $fields = array();

        foreach(craft()->googleMaps_templates->getGoogleMapsFieldTypes() as $field)
        {
            $fields[] = array(
                'label' => $field->name,
                'value' => $field->id
            );
        }

        return craft()->templates->render('googlemaps/fieldtype-settings', array(
            'fields' => $fields,
            'settings' => $this->getSettings()
        ));
    }

    protected function defineSettings()
    {
        return array(
            'defaultMapCenter' => array(AttributeType::String, 'min' => 0, 'default' => '0,0'),
            'defaultMapZoom' => array(AttributeType::Number, 'default' => '10'),
            'defaultMapWidth' => array(AttributeType::String, 'default' => '100%'),
            'defaultMapHeight' => array(AttributeType::String, 'default' => '400px'),
            'displayButtons' => array(AttributeType::Mixed, 'default' => array(
                'list',
                'refresh',
                'markers', 
                'routes', 
                'polylines', 
                'polygons'
            )),
            'addressFields' => array(AttributeType::Mixed, 'default' => false),
            // 'addressFields' => array(AttributeType::Mixed, 'default' => array())
        );
    }
}