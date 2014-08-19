<?php
namespace Craft;

class GoogleMaps_StaticMapService extends BaseApplicationComponent
{
    public $url = 'https://maps.googleapis.com/maps/api/staticmap';

    protected $expirationLength = false;

    public function __construct()
    {
        $this->expirationLength = craft()->config->get('staticMapCacheLength', 'googlemaps');
    }

    public function image(GoogleMaps_StaticMapModel $data, $options = array())
    {
        $url = $this->generate($data, $options);

        return '<img src="'.$url.'" '.(isset($options['class']) ? 'class="'.$options['class'].'"' : '').' '.(isset($options['id']) ? 'id="'.$options['id'].'"' : '').' '.(isset($options['alt']) ? 'alt="'.$options['alt'].'"' : '').' />';
    }

    public function generate(GoogleMaps_StaticMapModel $data, $options = array())
    {
        $basePath = craft()->config->get('staticMapCachePath', 'googlemaps');
        $baseUrl = craft()->config->get('staticMapCacheUrl', 'googlemaps');

        $url = $this->url . '?' . $data->getParameters();

        if($this->expirationLength)
        {
            $expires = date('Y-m-d H:i:s', time() - $this->expirationLength * 24 * 60 * 60);
        }
        else
        {
            $expires = '0000-00-00 00:00:00';
        }

        $record = GoogleMaps_StaticMapRecord::model()->find('query = :query AND dateCreated >= :date', array(
            ':query' => $data->getParameters(),
            ':date' => $expires
        ));

        if($record && $record->cachedFileExists())
        {
            return $record->getCachedUrl();
        }

        if($basePath && $baseUrl)
        {
            $basePath = rtrim($basePath, '/') . '/';
            $baseUrl = rtrim($baseUrl, '/') . '/';

            $client = new \Guzzle\Http\Client;
            
            $response = $client->get($url);

            $response->send();

            $rawdata = (string) $response->getResponse()->getBody();

            IOHelper::ensureFolderExists($basePath);

            $filename = md5($basePath . time()) . '.' . $data->format;
            $fullpath = $basePath . $filename;

            if(file_exists($fullpath))
            {
                unlink($fullpath);
            }

            $fp = fopen($fullpath,'x');
            fwrite($fp, $rawdata);
            fclose($fp);

            $record = new GoogleMaps_StaticMapRecord;
            $record->query = $data->getParameters();
            $record->filename = $filename;
            $record->save();

            return $baseUrl . $filename;
        }

        return $url;
    }

}
