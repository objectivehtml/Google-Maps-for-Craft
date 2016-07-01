<?php
namespace Craft;

class GoogleMapsPlugin extends BasePlugin
{
    public function getName()
    {
         return Craft::t('Google Maps');
    }

    public function getVersion()
    {
        return '0.8.4';
    }

    public function getDeveloper()
    {
        return 'Objective HTML';
    }

    public function getDeveloperUrl()
    {
        return 'https://objectivehtml.com';
    }

    protected function defineSettings()
    {
        return array(
            'enableGeocoder' => array(AttributeType::Bool, 'label' => 'Enable Geocoder', 'default' => false),
            'geocodeSections' => array(AttributeType::Mixed, 'label' => 'Geocode Sections', 'default' => array()),
            'geocodeFields' => array(AttributeType::String, 'label' => 'Geocode Fields'),
            'mapFields' => array(AttributeType::Mixed, 'label' => 'Google Maps Fields', 'default' => array()),
            'apiKey'   => array(AttributeType::String, 'required' => true, 'label' => 'API Key'),
        );
    }

    public function getSettingsHtml()
    {
        $sections = array();

        foreach(craft()->sections->getAllSections() as $section)
        {
            $sections[] = array(
                'label' => $section->name,
                'value' => $section->id
            );
        }

        $fields = array();

        foreach(craft()->googleMaps_templates->getGoogleMapsFieldTypes() as $field)
        {
            $fields[] = array(
                'label' => $field->name,
                'value' => $field->id
            );
        }

        return craft()->templates->render('googlemaps/settings', array(
            'sections' => $sections,
            'fields'   => $fields,
            'settings' => $this->getSettings()
        ));
    }

    public function init()
    {
        $settings = $this->getSettings();

/*
        craft()->on('postmaster.init', function(Event $event) {
            require_once 'GoogleMapsParcelType.php';

            craft()->postmaster->registerParcelType('Craft\GoogleMapsParcelType');
        });
*/

        if($settings->enableGeocoder)
        {
            craft()->on('entries.saveEntry', function(Event $event) use ($settings)
            {    
                $entry = $event->params['entry'];
                $content = $entry->getContent();

                // If section being saved matches a section set in the geocode settings
                if(in_array($entry->sectionId, $settings->geocodeSections))
                {
                    $address = array();

                    foreach(explode("\r\n", $settings->geocodeFields) as $field)
                    {
                        if($value = trim($content->getAttribute(trim($field))))
                        {
                            if(!empty($value))
                            {
                                $address[] = trim($value);
                            }
                        }
                    }

                    // If no address was entered, return script with no changes to db.
                    if(!count($address))
                    {
                        return;
                    }

                    $response = craft()->googleMaps_geocoder->geocode($address);

                    $mapFields = $settings->mapFields;

                    if($response->status == 'OK')
                    {
                        $geocodeResponse = $response->results[0];

                        if($mapFields == '*')
                        {
                            $fields = craft()->db->createCommand()
                                ->select('f.*')
                                ->from('fields f')
                                ->where('f.type = :type', array(':type' => 'GoogleMaps_GoogleMap'))
                                ->queryAll();

                            $mapFields = array();

                            foreach($fields as $field)
                            {
                                $mapFields[] = $field['id'];
                            }
                        }

                        foreach($mapFields as $mapFieldId)
                        {
                            $mapField = craft()->fields->getFieldById($mapFieldId);
                            $mapData = json_decode($content->{$mapField->handle});

                            $mapDataModel = new GoogleMaps_MapDataModel((array) $mapData);

                            // Update marker if exists, otherwise add a new marker
                            if($marker = $mapDataModel->getMarker(0))
                            {
                                $marker->lat = $geocodeResponse->geometry->location->lat;
                                $marker->lng = $geocodeResponse->geometry->location->lng;
                                $marker->address = $geocodeResponse->formatted_address;
                                $marker->addressComponents = $geocodeResponse->address_components;

                                if(!$marker->customContent)
                                {
                                    $marker->customContent = GoogleMaps_MarkerModel::defaultContent($geocodeResponse->formatted_address);
                                }
                            }
                            else
                            {
                                $marker = GoogleMaps_MarkerModel::populateModel(array(
                                    'lat' => $geocodeResponse->geometry->location->lat,
                                    'lng' => $geocodeResponse->geometry->location->lng,
                                    'address' => $geocodeResponse->formatted_address,
                                    'addressComponents' => $geocodeResponse->address_components,
                                    'content' => GoogleMaps_MarkerModel::defaultContent($geocodeResponse->formatted_address)
                                ));

                                $mapDataModel->addMarker($marker);
                            }

                            $content->{$mapField->handle} = $mapDataModel->toJson();

                            craft()->content->saveContent($entry);
                        }
                    }
                }
            });
        }
    }
}