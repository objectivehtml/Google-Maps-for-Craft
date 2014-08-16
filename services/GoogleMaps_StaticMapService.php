<?php
namespace Craft;

class GoogleMaps_StaticMapService extends BaseApplicationComponent
{
    public $url = 'https://maps.googleapis.com/maps/api/staticmap';

    public function image(GoogleMaps_StaticMapModel $data, $options = array())
    {
        $url = $this->generate($data, $options);

        return '<img src="'.$url.'" '.(isset($options['class']) ? 'class="'.$options['class'].'"' : '').' '.(isset($options['id']) ? 'id="'.$options['id'].'"' : '').' '.(isset($options['alt']) ? 'alt="'.$options['alt'].'"' : '').' />';
    }

    public function generate(GoogleMaps_StaticMapModel $data, $options = array())
    {
        return $this->url . '?' . $data->getParameters();

        $client = new \Guzzle\Http\Client;
        
        $response = $client->get($this->url . '?' . $data->getParameters());

        $response->send();

        $rawdata = (string) $response->getResponse()->getBody();

        $storagePath = craft()->path->getStoragePath() . 'googlemaps/static/';

        IOHelper::ensureFolderExists($storagePath);

        $filename = md5($storagePath . time()) . '.' . $data->format;
        $fullpath = $storagePath . $filename;

        if(file_exists($fullpath))
        {
            unlink($fullpath);
        }

        $fp = fopen($fullpath,'x');
        fwrite($fp, $rawdata);
        fclose($fp);
    }

}
