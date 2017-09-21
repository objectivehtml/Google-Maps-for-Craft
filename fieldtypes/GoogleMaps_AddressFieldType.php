<?php
namespace Craft;

class GoogleMaps_AddressFieldType extends BaseFieldType
{
    protected $queryParams = false;

    public function getName()
    {
        return Craft::t('Address');
    }

    public function defineContentAttribute()
    {
        return array(AttributeType::String, 'column' => ColumnType::Text);
    }

    public function onAfterElementSave()
    {  
        $handle = $this->model->handle;
        
        $data = $this->element->$handle;

        $location = GoogleMaps_LocationRecord::model()->findByPk($data->locationId ?: 0);

        if(!$location)
        {
            $location = new GoogleMaps_LocationRecord;
            $location->elementId = $this->element->id;
            $location->handle = $handle;
        }

        $response = $data->getResponse();

	    if($response)
	    {
	        $location->address = $response->formatted_address;
	        $location->addressComponents = $response->address_components;
	        $location->title = $this->element->title;
	        $location->content = implode('<br>', explode(',', $response->formatted_address));
	        $location->lat = $data->latitude;
	        $location->lng = $data->longitude;
	        $location->save();

		    $data->locationId = $location->id;
	    }

        $this->element->getContent()->setAttribute($handle, $data->toJson());

        craft()->content->saveContent($this->element);
    }

    public function prepValue($value)
    {   
        if(is_string($value))
        {
            $value = json_decode($value);
        }

        return new GoogleMaps_AddressModel((array) $value);
    }

    public function getInputHtml($name, $value)
    { 
        $id = craft()->templates->formatInputId($name);

        $pluginSettings = craft()->plugins->getPlugin('GoogleMaps')->getSettings();
        $key = $pluginSettings->apiKey;

        // Figure out what that ID is going to look like once it has been namespaced
        $namespacedId = craft()->templates->namespaceInputId($id);
        
        craft()->templates->includeJsResource('googlemaps/js/app.compiled.js');
        craft()->templates->includeCssResource('googlemaps/css/app.css');
        craft()->templates->includeJsFile('//maps.googleapis.com/maps/api/js?key='.$key.'&sensor=false&callback=GoogleMaps.init');

        craft()->templates->includeJs("
        var data = ['#$namespacedId-field .oh-google-map-wrapper', {
            fieldname: '$name',
            savedData: ".(!empty($value) ? $value->toJson() : "false")."
        }];

        if(google.maps.Map) {
            GoogleMaps.initAddressField(data);
        }
        else {
            GoogleMaps.addressFieldData.push(data);
        }");

        return craft()->templates->render('googlemaps/address-fieldtype', array(
            'address' => $value,
            'name' => $name
        ));
    }

    public function validate($value)
    {
        $model = $this->prepValue($value);

        return $model->validate() ?: $model->getAllErrors();
    }
}