<?php
namespace Craft;

class GoogleMaps_StaticMapRecord extends BaseRecord
{
    public function getTableName()
    {
        return 'googlemaps_staticmaps';
    }

    public function getCachedUrl()
    {
        $baseUrl = rtrim(craft()->config->get('staticMapCacheUrl', 'googlemaps'), '/') . '/';

        return $baseUrl . $this->filename;
    }

    public function cachedFileExists()
    {
        $basePath = rtrim(craft()->config->get('staticMapCachePath', 'googlemaps'), '/') . '/';

        return file_exists($basePath . $this->filename); 
    }

    protected function defineAttributes()
    {
        return array(
            'query' => array(AttributeType::String, 'column' => ColumnType::Text),
            'filename' => AttributeType::String,
        );
    }
}