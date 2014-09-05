<?php
namespace Craft;

class GoogleMaps_GeocoderService extends BaseApplicationComponent
{
	public $url = 'http://maps.googleapis.com/maps/api/geocode/json';

	public $expirationLength = 365; // In days

    public function geocode($address)
    {
        if(is_array($address))
        {
            $address = implode(' ', $address);
        }

    	$encodedAddress = urlencode($address);
    	
    	$url = $this->url.'?address='.$encodedAddress;

    	$expires = date('Y-m-d H:i:s', time() - $this->expirationLength * 24 * 60 * 60);

    	$results = GoogleMaps_GeocoderCacheRecord::model()->find('query = :query AND dateCreated >= :date', array(
    		':query' => $encodedAddress,
    		':date' => $expires
    	));

    	if($results)
    	{
    		return json_decode($results->response);
    	}

    	$client = new \Guzzle\Http\Client;
    	
    	$response = $client->get($url);

    	$response->send();

    	$response = (string) $response->getResponse()->getBody();

    	$this->cacheResponse($encodedAddress, $response);

    	return json_decode($response);
    }

    public function cacheResponse($query, $response)
    {
    	$record = new GoogleMaps_GeocoderCacheRecord;
    	$record->query = $query;
    	$record->response = $response;
    	$record->save();

    	return $record;
    }
}
