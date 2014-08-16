<?php
namespace Craft;

class GoogleMaps_GeocoderCacheRecord extends BaseRecord
{
    public function getTableName()
    {
        return 'googlemaps_geocoder_cache';
    }

    protected function defineAttributes()
    {
        return array(
            'query'     => array(AttributeType::String, 'column' => ColumnType::Text),
            'response'  => array(AttributeType::String, 'column' => ColumnType::LongText)
        );

    }
}